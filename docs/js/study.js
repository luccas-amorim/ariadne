// Modo estudo: perguntas de múltipla escolha geradas a partir dos próprios dados.
// Três tipos: síntese → divisão; divisão → diploma; divisão → faixa de artigos.
import { esc } from './data.js';

const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export class Study {
    /**
     * @param {object} o
     * @param {TreeModel} o.model
     * @param {Trail} o.trail
     * @param {HTMLElement} o.container  onde o cartão é desenhado
     * @param {(d) => void} o.onReveal   navega até o nó da resposta
     * @param {() => void} o.onEnd
     * @param {(hide:boolean) => void} o.onHideLabels
     */
    constructor({ model, trail, container, onReveal, onEnd, onHideLabels }) {
        Object.assign(this, { model, trail, container, onReveal, onEnd, onHideLabels });
        this.active = false;
        this.score = { right: 0, wrong: 0 };
        this.blind = false;
        this.pool = [];
        this.current = null;
        this.scopeLabel = '';
    }

    /** Começa com o escopo do nó (se tiver divisões suficientes) ou com toda a árvore. */
    start(scope) {
        const divisions = n => { const out = []; (function walk(x) { if (x.data.kind === 'division') out.push(x); (x.children || x._children || []).forEach(walk); })(n); return out; };
        let pool = divisions(scope);
        let label = this.model.labelOf(scope);
        if (pool.length < 6) { pool = divisions(this.model.root); label = this.model.isFocus() ? this.model.labelOf(this.model.root) : 'todo o ordenamento'; }
        if (pool.length < 4) { this.render(`<p class="muted">Poucas divisões para montar perguntas. Expanda o filtro de diplomas.</p>`); return false; }
        this.pool = pool;
        this.scopeLabel = label;
        this.active = true;
        this.score = { right: 0, wrong: 0 };
        this.next();
        return true;
    }

    stop() {
        this.active = false;
        if (this.blind) { this.blind = false; this.onHideLabels(false); }
        this.onEnd();
    }

    next() {
        const target = pick(this.pool);
        const doc = this.model.docOf(target);
        const sameDoc = this.pool.filter(d => this.model.docOf(d) === doc && d !== target);
        const docs = [...new Set(this.pool.map(d => this.model.docOf(d)))];
        const types = ['synthesis'];
        if (sameDoc.length >= 3) types.push('range');
        if (docs.length >= 4) types.push('diploma');
        const type = pick(types);
        let q;
        if (type === 'synthesis') {
            const others = shuffle(sameDoc.length >= 3 ? sameDoc : this.pool.filter(d => d !== target)).slice(0, 3);
            q = {
                type, target,
                prompt: `Qual divisão de <strong>${esc(doc.shortTitle)}</strong> corresponde a esta síntese?`,
                body: esc(target.data.node.content),
                options: shuffle([target, ...others]).map(d => ({ d, text: d.data.node.name, correct: d === target }))
            };
        } else if (type === 'range') {
            const others = shuffle(sameDoc.filter(d => d.data.node.subtitle !== target.data.node.subtitle)).slice(0, 3);
            q = {
                type, target,
                prompt: `Que faixa de artigos ocupa <strong>${esc(target.data.node.name)}</strong> (${esc(doc.shortTitle)})?`,
                body: '',
                options: shuffle([target, ...others]).map(d => ({ d, text: d.data.node.subtitle, correct: d === target }))
            };
        } else {
            const otherDocs = shuffle(docs.filter(d => d !== doc)).slice(0, 3);
            q = {
                type, target,
                prompt: `Em que diploma está <strong>${esc(target.data.node.name)}</strong>?`,
                body: esc(target.data.node.content),
                options: shuffle([doc, ...otherDocs]).map(dd => ({ d: dd, text: `${dd.shortTitle} · ${dd.title}`, correct: dd === doc }))
            };
        }
        this.current = q;
        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.current;
        const total = this.score.right + this.score.wrong;
        this.render(`
            <div class="study-head">
                <span class="chip" style="background:#0f172a">Modo estudo</span>
                <span class="muted">Escopo: ${esc(this.scopeLabel)} · ${total ? `${this.score.right}/${total} acertos` : 'primeira pergunta'}</span>
            </div>
            <p class="study-prompt">${q.prompt}</p>
            ${q.body ? `<p class="study-body">${q.body}</p>` : ''}
            <div class="study-options">
                ${q.options.map((o, i) => `<button type="button" class="btn study-opt" data-i="${i}">${esc(o.text)}</button>`).join('')}
            </div>
            <div class="study-foot">
                <label class="muted"><input type="checkbox" id="study-blind" ${this.blind ? 'checked' : ''}> Ocultar rótulos da árvore</label>
                <button type="button" class="btn" id="study-stop">Encerrar</button>
            </div>`);
        this.container.querySelectorAll('.study-opt').forEach(b => b.addEventListener('click', () => this.answer(+b.dataset.i)));
        this.container.querySelector('#study-stop').addEventListener('click', () => this.stop());
        this.container.querySelector('#study-blind').addEventListener('change', e => { this.blind = e.target.checked; this.onHideLabels(this.blind); });
    }

    answer(i) {
        const q = this.current, opt = q.options[i];
        const correct = !!opt.correct;
        if (correct) this.score.right++; else { this.score.wrong++; this.trail.set(q.target.key, 'review'); }
        const t = q.target, doc = this.model.docOf(t);
        this.render(`
            <div class="study-head">
                <span class="chip" style="background:${correct ? '#16a34a' : '#dc2626'}">${correct ? 'Certo' : 'Errado'}</span>
                <span class="muted">${this.score.right}/${this.score.right + this.score.wrong} acertos</span>
            </div>
            <p class="study-prompt"><strong>${esc(t.data.node.name)}</strong> <span class="muted">· ${esc(doc.shortTitle)} · ${esc(t.data.node.subtitle)}</span></p>
            <p class="study-body">${esc(t.data.node.content)}</p>
            ${correct ? '' : '<p class="muted">Marcado em sua trilha como "revisar".</p>'}
            <div class="study-foot">
                <button type="button" class="btn" id="study-reveal">Ver na árvore</button>
                <button type="button" class="btn btn-primary" id="study-next">Próxima</button>
                <button type="button" class="btn" id="study-stop">Encerrar</button>
            </div>`);
        this.container.querySelector('#study-next').addEventListener('click', () => this.next());
        this.container.querySelector('#study-stop').addEventListener('click', () => this.stop());
        this.container.querySelector('#study-reveal').addEventListener('click', () => this.onReveal(t));
    }

    render(html) { this.container.innerHTML = `<div class="study-card">${html}</div>`; }
}
