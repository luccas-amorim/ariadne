// Renderizador 3D: o mesmo modelo e o mesmo layout radial do 2D, com cada camada
// elevada no eixo vertical. Nós são placas com volume, iluminadas e com sombra;
// ligações são tubos; rótulos são etiquetas flutuantes sempre voltadas para a câmera.
// Three.js é carregado sob demanda.
import { mix } from './features.js';

const LEVEL_H = 150;       // altura entre camadas
const SLAB_D = 14;         // espessura das placas
const DURATION = 550;
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
        this.items = new Map();      // node.id → { slab, label, link }
        this.relMeshes = [];
        this.tweens = new Set();
        this.textures = new Map();
        this.matCache = new Map();
        this.disposed = false;
        this.ready = this.init();
    }

    async init() {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
        if (this.disposed) return;
        this.THREE = THREE;
        this.RoundedBoxGeometry = RoundedBoxGeometry;
        const w = this.width(), h = this.height();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setSize(w, h);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.setAttribute('role', 'img');
        this.renderer.domElement.setAttribute('aria-label', 'Árvore tridimensional da legislação');
        this.container.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 60000);
        this.camera.position.set(900, 700, 1400);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxPolarAngle = Math.PI * 0.49;   // não passa por baixo do chão
        this.controls.addEventListener('start', () => { this.userZoomed = true; });

        // Iluminação: hemisférica (céu/chão), direcional com sombra e um preenchimento suave.
        this.hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.9);
        this.scene.add(this.hemi);
        this.sun = new THREE.DirectionalLight(0xffffff, 1.4);
        this.sun.position.set(600, 1400, 800);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(2048, 2048);
        this.sun.shadow.bias = -0.0005;
        this.sun.shadow.normalBias = 0.5;
        this.scene.add(this.sun);
        this.scene.add(this.sun.target);
        this.fill = new THREE.DirectionalLight(0xffffff, 0.35);
        this.fill.position.set(-800, 300, -600);
        this.scene.add(this.fill);

        // Chão que só recebe sombra + grade polar
        this.ground = new THREE.Mesh(new THREE.CircleGeometry(1, 96), new THREE.ShadowMaterial({ opacity: 0.18 }));
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -SLAB_D;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        this.gridGroup = new THREE.Group();
        this.scene.add(this.gridGroup);
        this.rings = new THREE.Group();
        this.scene.add(this.rings);
        this.applyPaletteToScene();

        // Seleção por raio (clique sem arrasto) e cursor
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        let down = null;
        const el = this.renderer.domElement;
        const pickables = () => { const out = []; for (const it of this.items.values()) { out.push(it.slab); if (it.label) out.push(it.label); } return out; };
        el.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
        el.addEventListener('pointerup', e => {
            if (!down) return;
            const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
            down = null;
            if (moved > 5) return;
            const hit = this.pick(e, pickables());
            if (hit) this.onSelect(hit.userData.node);
        });
        el.addEventListener('pointermove', e => {
            const hit = this.pick(e, pickables());
            el.style.cursor = hit ? 'pointer' : 'grab';
            el.title = hit ? this.model.titleOf(hit.userData.node) : '';
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

    pick(e, objects) {
        const r = this.renderer.domElement.getBoundingClientRect();
        this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hits = this.raycaster.intersectObjects(objects, false);
        return hits.length ? hits[0].object : null;
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
        this.palette = p; this.textures.clear(); this.matCache.clear();
        if (this.scene) this.applyPaletteToScene();
        if (this.model.root) this.update(this.selected || this.model.root);
    }
    applyPaletteToScene() {
        const THREE = this.THREE, p = this.palette;
        this.scene.background = new THREE.Color(p.scene);
        this.scene.fog = new THREE.Fog(p.scene, 2500, 7000);
        this.hemi.color = new THREE.Color(p.name === 'dark' ? 0xcfd8e3 : 0xffffff);
        this.hemi.groundColor = new THREE.Color(p.name === 'dark' ? 0x1e293b : 0x94a3b8);
        this.ground.material.opacity = p.name === 'dark' ? 0.45 : 0.18;
    }
    reset() {
        if (!this.scene) return;
        for (const it of this.items.values()) this.removeItem(it);
        this.relMeshes.forEach(m => { this.scene.remove(m); m.geometry.dispose(); });
        this.items.clear(); this.relMeshes = []; this.tweens.clear();
    }
    removeItem(it) {
        this.scene.remove(it.slab); it.slab.geometry.dispose();
        if (it.label) this.scene.remove(it.label);
        if (it.link) { this.scene.remove(it.link); it.link.geometry.dispose(); }
    }
    destroy() {
        this.disposed = true;
        if (this.raf) cancelAnimationFrame(this.raf);
        if (this.ro) this.ro.disconnect();
        if (this.renderer) { this.renderer.dispose(); this.renderer.domElement.remove(); }
        for (const t of this.textures.values()) t.dispose();
    }

    // ---------- posições e dimensões ----------
    posOf(d) { return new this.THREE.Vector3(d.px, d.depth * LEVEL_H, d.py); }
    dims(d) {
        const k = d.data.kind;
        if (k === 'center') return { w: 92, h: 92, r: 46, sphere: true };
        const w = this.model.boxWidth(d);
        const h = k === 'ramo' ? 36 : k === 'diploma' ? 30 : 28;
        return { w, h, r: k === 'ramo' ? 17 : 6, sphere: false };
    }

    // ---------- materiais ----------
    material(color, { emissive = 0, opacity = 1, metal = 0.05, rough = 0.55 } = {}) {
        const key = `${color}|${emissive}|${opacity}|${metal}|${rough}`;
        if (this.matCache.has(key)) return this.matCache.get(key);
        const THREE = this.THREE;
        const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), metalness: metal, roughness: rough, transparent: opacity < 1, opacity });
        if (emissive) { m.emissive = new THREE.Color(color); m.emissiveIntensity = emissive; }
        this.matCache.set(key, m);
        return m;
    }
    slabColor(d) {
        const m = this.model, p = this.palette, c = m.ramoOf(d).color, k = d.data.kind;
        if (k === 'center') return m.isCfCenter(d) ? p.centerFill : c;
        if (k === 'ramo') return c;
        if (d.data.planned) return p.name === 'dark' ? '#1e293b' : '#e2e8f0';
        if (d === this.selected) return c;
        if (k === 'diploma') return mix(c, 0.35, p.mixBase);
        return d._children ? mix(c, 0.22, p.mixBase) : (p.name === 'dark' ? '#334155' : '#f1f5f9');
    }

    // ---------- etiquetas (texturas de canvas) ----------
    labelTexture(d) {
        const m = this.model, p = this.palette, THREE = this.THREE;
        const kind = d.data.kind;
        const label = this.hideLabels && kind === 'division' ? '· · ·' : m.labelOf(d);
        const c = m.ramoOf(d).color;
        const selected = d === this.selected;
        const dark = p.name === 'dark';
        const bg = selected ? c : kind === 'ramo' || kind === 'center' ? (dark ? '#0f172a' : '#ffffff') : (dark ? 'rgba(15,23,42,.92)' : 'rgba(255,255,255,.94)');
        const fg = selected ? '#ffffff' : kind === 'ramo' ? c : (dark ? '#e2e8f0' : '#0f172a');
        const badge = d._children ? d._children.length : 0;
        const trail = this.trailProvider(d.key);
        const sub = kind === 'center' ? (m.isCfCenter(d) ? 'Constituição' : m.ramoOf(d).short) : kind === 'division' ? d.data.node.subtitle : '';
        const key = [kind, label, bg, fg, badge, trail, sub, selected, d.data.planned].join('|');
        if (this.textures.has(key)) return this.textures.get(key);

        const font = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
        const S = 3;
        const fs = kind === 'center' ? 16 : kind === 'ramo' ? 13 : 11;
        const probe = document.createElement('canvas').getContext('2d');
        probe.font = `700 ${fs}px ${font}`;
        const tw = probe.measureText(label).width;
        probe.font = `500 9px ${font}`;
        const sw = sub ? probe.measureText(sub).width : 0;
        const w = Math.ceil(Math.max(tw, sw) + 22), h = sub ? 32 : 22;
        const pad = 12;
        const canvas = document.createElement('canvas');
        canvas.width = (w + pad * 2) * S; canvas.height = (h + pad * 2) * S;
        const ctx = canvas.getContext('2d');
        ctx.scale(S, S); ctx.translate(pad, pad);
        const rr = (x, y, ww, hh, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + ww, y, x + ww, y + hh, r); ctx.arcTo(x + ww, y + hh, x, y + hh, r); ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + ww, y, r); ctx.closePath(); };
        ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
        rr(0, 0, w, h, 6); ctx.fillStyle = bg; ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = 1.2; ctx.strokeStyle = selected ? c : (dark ? 'rgba(148,163,184,.5)' : 'rgba(100,116,139,.45)');
        if (d.data.planned) ctx.setLineDash([2, 3]);
        rr(0, 0, w, h, 6); ctx.stroke(); ctx.setLineDash([]);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = fg;
        ctx.font = `${d.data.planned ? 'italic ' : ''}700 ${fs}px ${font}`;
        ctx.fillText(label, w / 2, sub ? 11 : h / 2 + 0.5);
        if (sub) { ctx.font = `500 9px ${font}`; ctx.fillStyle = selected ? 'rgba(255,255,255,.85)' : (dark ? '#94a3b8' : '#64748b'); ctx.fillText(sub, w / 2, 23); }
        if (badge) {
            ctx.beginPath(); ctx.arc(w - 1, 1, 8, 0, Math.PI * 2); ctx.fillStyle = p.badge; ctx.fill(); ctx.strokeStyle = p.surface; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = p.badgeText; ctx.font = `700 9px ${font}`; ctx.fillText(String(badge), w - 1, 1.5);
        }
        if (trail) {
            ctx.beginPath(); ctx.arc(1, 1, 4.5, 0, Math.PI * 2); ctx.fillStyle = trail === 'studied' ? p.studied : p.review; ctx.fill(); ctx.strokeStyle = p.surface; ctx.lineWidth = 1.5; ctx.stroke();
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.userData = { w: w + pad * 2, h: h + pad * 2 };
        this.textures.set(key, tex);
        return tex;
    }

    // ---------- geometria das ligações ----------
    linkCurve(parent, child) {
        const THREE = this.THREE;
        const a = this.posOf(parent), b = this.posOf(child);
        const da = this.dims(parent), db = this.dims(child);
        a.y += da.sphere ? da.r * 0.6 : da.h / 2;      // sai pelo topo do pai
        b.y -= db.h / 2;                                 // entra por baixo do filho
        const lift = (b.y - a.y) * 0.55;
        const c1 = new THREE.Vector3(a.x, a.y + lift, a.z);
        const c2 = new THREE.Vector3(b.x, b.y - lift * 0.6, b.z);
        return new THREE.CubicBezierCurve3(a, c1, c2, b);
    }
    makeTube(curve, radius, material, segments = 16) {
        const THREE = this.THREE;
        const geo = new THREE.TubeGeometry(curve, segments, radius, 7, false);
        const mesh = new THREE.Mesh(geo, material);
        mesh.castShadow = true;
        return mesh;
    }

    // ---------- renderização ----------
    async update(source) {
        await this.ready;
        if (this.disposed) return;
        const THREE = this.THREE, m = this.model, p = this.palette;
        m.layout();
        const nodes = m.root.descendants();
        const now = performance.now();
        const srcItem = this.items.get(source.id);
        const srcPos = srcItem ? srcItem.slab.position.clone() : this.posOf(source);
        const alive = new Set();

        for (const d of nodes) {
            alive.add(d.id);
            const target = this.posOf(d);
            const dm = this.dims(d);
            const color = this.slabColor(d);
            const selected = d === this.selected;
            const mat = this.material(color, { emissive: selected ? 0.25 : d.data.kind === 'ramo' ? 0.12 : 0, opacity: d.data.planned ? 0.55 : 1, rough: d.data.kind === 'center' ? 0.35 : 0.55 });
            let it = this.items.get(d.id);
            if (!it) {
                const geo = dm.sphere ? new THREE.SphereGeometry(dm.r, 40, 28) : new this.RoundedBoxGeometry(dm.w, dm.h, SLAB_D, 3, Math.min(dm.r, dm.h / 2 - 0.5));
                const slab = new THREE.Mesh(geo, mat);
                slab.castShadow = true; slab.receiveShadow = true;
                slab.position.copy(srcPos);
                slab.userData = { node: d };
                this.scene.add(slab);
                it = { slab, label: null, link: null, dims: dm };
                this.items.set(d.id, it);
            } else {
                it.slab.material = mat;
                it.slab.userData.node = d;
            }
            // etiqueta flutuante
            const tex = this.labelTexture(d);
            if (!it.label) {
                it.label = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
                it.label.position.copy(srcPos);
                it.label.userData = { node: d };
                it.label.renderOrder = 20;
                this.scene.add(it.label);
            } else if (it.label.material.map !== tex) { it.label.material.map = tex; it.label.material.needsUpdate = true; }
            it.label.userData.node = d;
            const ls = d.data.kind === 'division' ? 0.9 : 1;
            it.label.scale.set(tex.userData.w * ls, tex.userData.h * ls, 1);
            it.labelOffset = (dm.sphere ? dm.r : dm.h / 2) + tex.userData.h * ls / 2 - 2;
            this.tweens.add({ it, from: it.slab.position.clone(), to: target, t0: now, dur: DURATION });

            // ligação até o pai: tubo já na posição final, surgindo com opacidade
            if (it.link) { this.scene.remove(it.link); it.link.geometry.dispose(); it.link = null; }
            if (d.parent) {
                const c = m.ramoOf(d).color;
                const radius = d.depth === 1 ? 4.5 : d.depth === 2 ? 3.2 : 2.2;
                const lm = this.material(d.depth <= 2 ? c : mix(c, 0.7, p.mixBase), { opacity: 0.999, rough: 0.7 });
                const linkMat = lm.clone(); linkMat.transparent = true; linkMat.opacity = 0;
                it.link = this.makeTube(this.linkCurve(d.parent, d), radius, linkMat);
                it.link.userData = { node: d };
                this.scene.add(it.link);
                this.tweens.add({ fade: it.link, t0: now, dur: DURATION });
            }
        }
        for (const [id, it] of this.items) {
            if (alive.has(id)) continue;
            if (it.link) { this.scene.remove(it.link); it.link.geometry.dispose(); it.link = null; }
            this.tweens.add({ it, from: it.slab.position.clone(), to: srcPos.clone(), t0: now, dur: DURATION, remove: true });
        }
        this.drawGround();
        this.drawRelations();
    }

    drawGround() {
        const THREE = this.THREE, p = this.palette, m = this.model;
        const radii = m.radii || [0];
        const R = Math.max(400, (radii[radii.length - 1] || 0) + 160);
        this.ground.scale.set(R, R, 1);
        this.gridGroup.clear();
        const grid = new THREE.PolarGridHelper(R, 12, Math.max(4, radii.length), 96,
            new THREE.Color(p.name === 'dark' ? 0x334155 : 0xcbd5e1), new THREE.Color(p.name === 'dark' ? 0x1f2937 : 0xe2e8f0));
        grid.position.y = -SLAB_D + 0.5;
        grid.material.transparent = true; grid.material.opacity = 0.55;
        this.gridGroup.add(grid);
        // anéis translúcidos em cada camada
        this.rings.clear();
        radii.forEach((r, depth) => {
            if (!r || depth === 0) return;
            const ring = new THREE.Mesh(new THREE.RingGeometry(r - 1.2, r + 1.2, 128), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.name === 'dark' ? 0x475569 : 0x94a3b8), transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = depth * LEVEL_H - 16;
            this.rings.add(ring);
        });
        // luz e sombra acompanham o tamanho da árvore
        const H = (radii.length - 1) * LEVEL_H + 100;
        this.sun.position.set(R * 0.8, H + R * 1.2, R * 1.0);
        const cam = this.sun.shadow.camera;
        cam.left = -R * 1.3; cam.right = R * 1.3; cam.top = R * 1.3 + H; cam.bottom = -R * 1.3;
        cam.near = 10; cam.far = R * 4 + H * 2;
        cam.updateProjectionMatrix();
    }

    drawRelations() {
        const THREE = this.THREE, m = this.model, p = this.palette, sel = this.selected;
        this.relMeshes.forEach(x => { this.scene.remove(x); x.geometry.dispose(); });
        this.relMeshes = [];
        if (!sel) return;
        const items = m.relationsFor(sel, { includeDescendants: sel.data.kind !== 'division' }).filter(r => r.other);
        for (const r of items) {
            const rep = m.visibleRep(r.other);
            if (rep === sel) continue;
            const a = this.posOf(sel), b = this.posOf(rep);
            const mid = a.clone().add(b).multiplyScalar(0.5);
            mid.y = Math.max(a.y, b.y) + 160 + a.distanceTo(b) * 0.12;
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const resolved = rep === r.other;
            const mat = this.material(p.relation, { emissive: 0.6, opacity: resolved ? 0.95 : 0.5, rough: 0.4 });
            const tube = this.makeTube(curve, resolved ? 3.2 : 2.2, mat, 32);
            tube.castShadow = false;
            tube.renderOrder = 5;
            this.scene.add(tube);
            this.relMeshes.push(tube);
            // marcador no destino
            const dot = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), mat);
            dot.position.copy(b); dot.position.y += this.dims(rep).h / 2 + 6;
            this.scene.add(dot);
            this.relMeshes.push(dot);
        }
    }

    stepTweens() {
        if (!this.tweens.size) return;
        const now = performance.now();
        for (const t of this.tweens) {
            const s = easeOut(Math.min(1, (now - t.t0) / t.dur));
            if (t.fade) {
                t.fade.material.opacity = s;
                if (s >= 1) { t.fade.material.transparent = false; this.tweens.delete(t); }
                continue;
            }
            const it = t.it;
            it.slab.position.lerpVectors(t.from, t.to, s);
            if (it.label) { it.label.position.copy(it.slab.position); it.label.position.y += it.labelOffset; }
            if (t.remove) {
                const k = 1 - s;
                it.slab.scale.setScalar(Math.max(0.001, k));
                if (it.label) it.label.material.opacity = k;
            }
            if (s >= 1) {
                this.tweens.delete(t);
                if (t.remove) { this.removeItem(it); this.items.delete(it.slab.userData.node.id); }
            }
        }
    }

    // ---------- câmera ----------
    boundsSphere() {
        const THREE = this.THREE;
        const box = new THREE.Box3();
        this.model.root.each(d => box.expandByPoint(this.posOf(d)));
        box.expandByScalar(90);
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        return sphere;
    }
    moveCamera(target, position, animate = true) {
        if (!animate) { this.controls.target.copy(target); this.camera.position.copy(position); this.controls.update(); return; }
        const t0 = performance.now(), dur = DURATION + 250;
        const fromT = this.controls.target.clone(), fromP = this.camera.position.clone();
        const step = () => {
            const s = easeOut(Math.min(1, (performance.now() - t0) / dur));
            this.controls.target.lerpVectors(fromT, target, s);
            this.camera.position.lerpVectors(fromP, position, s);
            if (s < 1 && !this.disposed) requestAnimationFrame(step);
        };
        step();
    }
    async fit(animate = true) {
        await this.ready; if (this.disposed) return;
        const sphere = this.boundsSphere();
        const fov = this.camera.fov * Math.PI / 180;
        const aspect = Math.max(0.5, this.camera.aspect);
        const dist = (sphere.radius / Math.sin(fov / 2)) * (aspect < 1 ? 1 / aspect : 1) * 0.78;
        // câmera oblíqua: baixa o bastante para ler a altura das camadas
        const dir = new this.THREE.Vector3(0.75, 0.42, 1).normalize();
        const target = sphere.center.clone(); target.y *= 0.8;
        this.moveCamera(target, target.clone().add(dir.multiplyScalar(dist)), animate);
        this.scene.fog.near = dist * 1.1; this.scene.fog.far = dist * 3.2;
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
        const len = Math.min(offset.length(), 1100);
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
