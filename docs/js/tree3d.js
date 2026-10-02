// Renderizador 3D: o mesmo modelo e o mesmo layout radial do 2D, com a profundidade
// de cada camada elevada no eixo vertical. Rótulos são sprites com textura de canvas,
// ligações são linhas coloridas pelo ramo. Three.js é carregado sob demanda.
import { mix } from './features.js';

const LEVEL_H = 70;       // altura entre camadas
const DURATION = 500;
const easeOut = t => 1 - Math.pow(1 - t, 3);

export class Tree3D {
    constructor(container, model, { onSelect, palette, trailProvider = () => null } = {}) {
        this.container = container;
        this.model = model;
        this.onSelect = onSelect || (() => {});
        this.palette = palette;
        this.trailProvider = trailProvider;
        this.selected = null;
        this.hideLabels = false;
        this.userZoomed = false;
        this.sprites = new Map();   // node.id → Sprite
        this.lines = new Map();     // node.id → Line (até o pai)
        this.relLines = [];
        this.tweens = new Set();
        this.textures = new Map();
        this.disposed = false;
        this.ready = this.init();
    }

    async init() {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        if (this.disposed) return;
        this.THREE = THREE;
        const w = this.width(), h = this.height();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setSize(w, h);
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.setAttribute('role', 'img');
        this.renderer.domElement.setAttribute('aria-label', 'Árvore tridimensional da legislação');
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.palette.scene);
        this.camera = new THREE.PerspectiveCamera(50, w / h, 1, 50000);
        this.camera.position.set(0, 700, 1100);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxPolarAngle = Math.PI * 0.95;
        this.controls.addEventListener('start', () => { this.userZoomed = true; });

        // chão sutil: anéis das camadas
        this.rings = new THREE.Group();
        this.scene.add(this.rings);

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        let down = null;
        const el = this.renderer.domElement;
        el.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
        el.addEventListener('pointerup', e => {
            if (!down) return;
            const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
            down = null;
            if (moved > 5) return;
            const r = el.getBoundingClientRect();
            this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const hits = this.raycaster.intersectObjects([...this.sprites.values()], false);
            if (hits.length) this.onSelect(hits[0].object.userData.node);
        });
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
            this.raycaster.setFromCamera(this.pointer, this.camera);
            const hits = this.raycaster.intersectObjects([...this.sprites.values()], false);
            el.style.cursor = hits.length ? 'pointer' : 'grab';
            el.title = hits.length ? this.model.titleOf(hits[0].object.userData.node) : '';
        });

        let timer, last = '';
        this.ro = new ResizeObserver(() => {
            const size = `${this.width()}x${this.height()}`;
            if (size === last) return;
            last = size;
            this.resize();
            clearTimeout(timer);
            timer = setTimeout(() => { if (this.model.root && !this.userZoomed) this.fit(false); }, 150);
        });
        this.ro.observe(this.container);

        const loop = () => {
            if (this.disposed) return;
            this.raf = requestAnimationFrame(loop);
            this.stepTweens();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        loop();
    }

    width() { return this.container.clientWidth || 1; }
    height() { return this.container.clientHeight || 1; }
    resize() {
        if (!this.renderer) return;
        this.camera.aspect = this.width() / this.height();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width(), this.height());
    }
    setSelected(d) { this.selected = d; }
    setTrailProvider(fn) { this.trailProvider = fn; }
    setHideLabels(b) { this.hideLabels = b; this.textures.clear(); if (this.model.root) this.update(this.selected || this.model.root); }
    setPalette(p) {
        this.palette = p; this.textures.clear();
        if (this.scene) this.scene.background = new this.THREE.Color(p.scene);
        if (this.model.root) this.update(this.selected || this.model.root);
    }
    reset() {
        if (!this.scene) return;
        for (const s of this.sprites.values()) this.scene.remove(s);
        for (const l of this.lines.values()) this.scene.remove(l);
        this.relLines.forEach(l => this.scene.remove(l));
        this.sprites.clear(); this.lines.clear(); this.relLines = []; this.tweens.clear();
    }
    destroy() {
        this.disposed = true;
        if (this.raf) cancelAnimationFrame(this.raf);
        if (this.ro) this.ro.disconnect();
        if (this.renderer) { this.renderer.dispose(); this.renderer.domElement.remove(); }
        for (const t of this.textures.values()) t.dispose();
    }

    // ---------- posições ----------
    posOf(d) { return new this.THREE.Vector3(d.px, d.depth * LEVEL_H, d.py); }

    // ---------- texturas ----------
    textureFor(d) {
        const m = this.model, p = this.palette, THREE = this.THREE;
        const kind = d.data.kind;
        const label = this.hideLabels && kind === 'division' ? '' : m.labelOf(d);
        const c = m.ramoOf(d).color;
        const selected = d === this.selected;
        const fill = kind === 'center' ? (m.isCfCenter(d) ? p.centerFill : c)
            : kind === 'ramo' ? (selected ? p.centerFill : c)
            : d.data.planned ? p.bg : selected ? c : d._children ? mix(c, 0.14, p.mixBase) : p.nodeFill;
        const stroke = kind === 'center' ? (selected ? p.textStrong : m.isCfCenter(d) ? p.centerStroke : mix(c, 0.6, p.mixBase))
            : kind === 'ramo' ? (selected ? p.textStrong : c)
            : d.data.planned ? '#94a3b8' : selected || kind === 'diploma' ? c : mix(c, 0.55, p.mixBase);
        const text = (kind === 'center' || kind === 'ramo' || selected) ? p.onColor : d.data.planned ? p.textMuted : p.text;
        const badge = d._children ? d._children.length : 0;
        const trail = this.trailProvider(d.key);
        const dashed = m.isProcessual(d) || d.data.planned;
        const sub = kind === 'center' ? (m.isCfCenter(d) ? 'Constituição' : m.ramoOf(d).short) : '';
        const key = [kind, label, fill, stroke, text, badge, trail, dashed, sub, selected].join('|');
        if (this.textures.has(key)) return this.textures.get(key);

        const w = kind === 'center' ? 110 : m.boxWidth(d);
        const h = kind === 'center' ? 110 : kind === 'ramo' ? 36 : 30;
        const pad = 14, S = 3; // margem para badge/anel e supersampling
        const canvas = document.createElement('canvas');
        canvas.width = (w + pad * 2) * S; canvas.height = (h + pad * 2) * S;
        const ctx = canvas.getContext('2d');
        ctx.scale(S, S);
        ctx.translate(pad, pad);
        const rr = (x, y, ww, hh, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + ww, y, x + ww, y + hh, r); ctx.arcTo(x + ww, y + hh, x, y + hh, r); ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + ww, y, r); ctx.closePath(); };
        ctx.lineWidth = kind === 'center' ? 4 : selected ? 2.5 : 1.5;
        if (dashed) ctx.setLineDash(d.data.planned ? [2, 3] : [5, 3]);
        if (kind === 'center') { ctx.beginPath(); ctx.arc(w / 2, h / 2, 46, 0, Math.PI * 2); ctx.closePath(); }
        else rr(0, 0, w, h, kind === 'ramo' ? 18 : 6);
        ctx.fillStyle = fill; ctx.fill();
        ctx.strokeStyle = stroke; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = text;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const font = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        if (kind === 'center') {
            ctx.font = `700 15px ${font}`; ctx.fillText(label, w / 2, h / 2 - 5);
            ctx.font = `500 9px ${font}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText(sub.toUpperCase(), w / 2, h / 2 + 11);
        } else {
            ctx.font = `${kind === 'ramo' ? 600 : 600} ${kind === 'ramo' ? 12 : kind === 'diploma' ? 11 : 10.5}px ${font}`;
            if (d.data.planned) ctx.font = `italic ${ctx.font}`;
            ctx.fillText(label, w / 2, h / 2 + 0.5, w - 10);
        }
        if (badge) {
            const bx = kind === 'center' ? w / 2 + 34 : w - 2, by = kind === 'center' ? h / 2 - 34 : 1;
            ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fillStyle = p.badge; ctx.fill(); ctx.strokeStyle = p.surface; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = p.badgeText; ctx.font = `700 9px ${font}`; ctx.fillText(String(badge), bx, by + 0.5);
        }
        if (trail) {
            const tx = kind === 'center' ? w / 2 - 34 : 1, ty = kind === 'center' ? h / 2 - 34 : 1;
            ctx.beginPath(); ctx.arc(tx, ty, 4.5, 0, Math.PI * 2); ctx.fillStyle = trail === 'studied' ? p.studied : p.review; ctx.fill(); ctx.strokeStyle = p.surface; ctx.lineWidth = 1.5; ctx.stroke();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.userData = { w: w + pad * 2, h: h + pad * 2 };
        this.textures.set(key, tex);
        return tex;
    }

    // ---------- renderização ----------
    async update(source) {
        await this.ready;
        if (this.disposed) return;
        const THREE = this.THREE, m = this.model, p = this.palette;
        m.layout();
        const nodes = m.root.descendants();
        const now = performance.now();
        const srcPos = this.sprites.has(source.id) ? this.sprites.get(source.id).position.clone() : this.posOf(source);
        const alive = new Set();

        for (const d of nodes) {
            alive.add(d.id);
            const target = this.posOf(d);
            const tex = this.textureFor(d);
            let s = this.sprites.get(d.id);
            if (!s) {
                s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true, depthWrite: false }));
                s.position.copy(srcPos);
                s.userData = { node: d };
                s.renderOrder = 10 + d.depth;
                this.scene.add(s);
                this.sprites.set(d.id, s);
            } else if (s.material.map !== tex) { s.material.map = tex; s.material.needsUpdate = true; }
            s.userData.node = d;
            s.scale.set(tex.userData.w, tex.userData.h, 1);
            this.tweens.add({ obj: s, from: s.position.clone(), to: target, t0: now, dur: DURATION });

            if (d.parent) {
                let l = this.lines.get(d.id);
                const color = new THREE.Color(m.ramoOf(d).color);
                if (!l) {
                    const geo = new THREE.BufferGeometry().setFromPoints([srcPos, srcPos]);
                    l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: d.depth <= 2 ? 0.6 : 0.4 }));
                    l.userData = { node: d };
                    this.scene.add(l);
                    this.lines.set(d.id, l);
                } else { l.material.color = color; l.userData.node = d; }
            }
        }
        // remove os que saíram
        for (const [id, s] of this.sprites) {
            if (alive.has(id)) continue;
            this.tweens.add({ obj: s, from: s.position.clone(), to: srcPos.clone(), t0: now, dur: DURATION, remove: true });
            const l = this.lines.get(id);
            if (l) { this.scene.remove(l); l.geometry.dispose(); this.lines.delete(id); }
        }
        this.drawRings();
        this.drawRelations();
    }

    drawRings() {
        const THREE = this.THREE, p = this.palette, m = this.model;
        this.rings.clear();
        (m.radii || []).forEach((r, depth) => {
            if (!r) return;
            const pts = [];
            for (let i = 0; i <= 96; i++) { const a = (i / 96) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, depth * LEVEL_H, Math.sin(a) * r)); }
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(p.link), transparent: true, opacity: 0.35 }));
            this.rings.add(line);
        });
    }

    drawRelations() {
        const THREE = this.THREE, m = this.model, p = this.palette, sel = this.selected;
        this.relLines.forEach(l => { this.scene.remove(l); l.geometry.dispose(); });
        this.relLines = [];
        if (!sel) return;
        const items = m.relationsFor(sel, { includeDescendants: sel.data.kind !== 'division' }).filter(r => r.other);
        for (const r of items) {
            const rep = m.visibleRep(r.other);
            if (rep === sel) continue;
            const a = this.posOf(sel), b = this.posOf(rep);
            const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += 90; mid.x *= 0.5; mid.z *= 0.5;
            const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(24);
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mat = rep === r.other
                ? new THREE.LineBasicMaterial({ color: new THREE.Color(p.relation), transparent: true, opacity: 0.9 })
                : new THREE.LineDashedMaterial({ color: new THREE.Color(p.relation), dashSize: 8, gapSize: 6, transparent: true, opacity: 0.9 });
            const line = new THREE.Line(geo, mat);
            line.computeLineDistances();
            line.renderOrder = 5;
            this.scene.add(line);
            this.relLines.push(line);
        }
    }

    stepTweens() {
        if (!this.tweens.size) return;
        const now = performance.now();
        for (const t of this.tweens) {
            const s = easeOut(Math.min(1, (now - t.t0) / t.dur));
            t.obj.position.lerpVectors(t.from, t.to, s);
            if (t.remove) t.obj.material.opacity = 1 - s;
            if (s >= 1) {
                this.tweens.delete(t);
                if (t.remove) { this.scene.remove(t.obj); this.sprites.delete(t.obj.userData.node.id); }
            }
        }
        // ligações seguem os sprites
        const pos = new Float32Array(6);
        for (const [id, l] of this.lines) {
            const d = l.userData.node;
            const a = this.sprites.get(d.parent.id), b = this.sprites.get(id);
            if (!a || !b) continue;
            pos[0] = a.position.x; pos[1] = a.position.y; pos[2] = a.position.z;
            pos[3] = b.position.x; pos[4] = b.position.y; pos[5] = b.position.z;
            l.geometry.setAttribute('position', new this.THREE.BufferAttribute(pos.slice(), 3));
        }
    }

    // ---------- câmera ----------
    boundsSphere() {
        const THREE = this.THREE;
        const box = new THREE.Box3();
        this.model.root.each(d => box.expandByPoint(this.posOf(d)));
        box.expandByScalar(80);
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        return sphere;
    }
    moveCamera(target, position, animate = true) {
        const THREE = this.THREE;
        if (!animate) { this.controls.target.copy(target); this.camera.position.copy(position); this.controls.update(); return; }
        const t0 = performance.now(), dur = DURATION + 200;
        const fromT = this.controls.target.clone(), fromP = this.camera.position.clone();
        const step = () => {
            const s = easeOut(Math.min(1, (performance.now() - t0) / dur));
            this.controls.target.lerpVectors(fromT, target, s);
            this.camera.position.lerpVectors(fromP, position, s);
            if (s < 1 && !this.disposed) requestAnimationFrame(step);
        };
        step();
        void THREE;
    }
    async fit(animate = true) {
        await this.ready; if (this.disposed) return;
        const sphere = this.boundsSphere();
        const fov = this.camera.fov * Math.PI / 180;
        const aspect = Math.max(0.5, this.camera.aspect);
        const dist = (sphere.radius / Math.sin(fov / 2)) * (aspect < 1 ? 1 / aspect : 1) * 0.8;
        const dir = new this.THREE.Vector3(0.15, 0.75, 1).normalize();
        this.moveCamera(sphere.center, sphere.center.clone().add(dir.multiplyScalar(dist)), animate);
        this.userZoomed = false;
    }
    async reveal(d) {
        await this.ready; if (this.disposed) return;
        const target = this.posOf(d);
        const v = target.clone().project(this.camera);
        if (Math.abs(v.x) < 0.85 && Math.abs(v.y) < 0.85 && v.z < 1) return;
        const offset = this.camera.position.clone().sub(this.controls.target);
        this.moveCamera(target, target.clone().add(offset));
    }
    async centerOn(d) {
        await this.ready; if (this.disposed) return;
        const target = this.posOf(d);
        const offset = this.camera.position.clone().sub(this.controls.target);
        const len = Math.min(offset.length(), 900);
        this.moveCamera(target, target.clone().add(offset.setLength(len)));
    }
    zoomBy(f) {
        if (!this.camera) return;
        const offset = this.camera.position.clone().sub(this.controls.target).multiplyScalar(1 / f);
        this.moveCamera(this.controls.target.clone(), this.controls.target.clone().add(offset));
    }
    focusNode() { /* sem foco de teclado em canvas */ }

    /** PNG da cena atual. */
    snapshotPng() {
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/png');
    }
}
