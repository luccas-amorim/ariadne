"""Gera a página das Críticas a partir dos capítulos em Markdown."""
import argparse
import html
import math
import re
from functools import cache
from pathlib import Path

import markdown

BASE = Path(__file__).resolve().parent
CAPS_DIR = BASE / "caps"

# (id, título curto, bloco, posição na planta)
CAPS = [
    ("0", "Método e aparato", "fundacao", "plinto"),
    ("1", "O problema crítico", "fundacao", "esq"),
    ("2.1", "Estética Transcendental", "teorica", "esq"),
    ("2.2", "Deduções metafísica e transcendental", "teorica", "esq"),
    ("2.3", "Esquematismo e princípios", "teorica", "esq"),
    ("2.4", "Fenômeno e númeno", "teorica", "esq"),
    ("3.1", "Ilusão transcendental e Paralogismos", "teorica", "esq"),
    ("3.2", "Antinomias", "teorica", "esq"),
    ("3.3", "O Ideal e o uso regulativo das ideias", "teorica", "esq"),
    ("3.4", "Doutrina do Método", "teorica", "esq"),
    ("4.1", "Fundamentação, Prefácio e Seções I e II", "pratica", "dir"),
    ("4.2", "Fundamentação, Seção III", "pratica", "dir"),
    ("5.1", "Crítica da Razão Prática, Analítica", "pratica", "dir"),
    ("5.2", "Crítica da Razão Prática, Dialética e Metodologia", "pratica", "dir"),
    ("6.1", "Crítica do Juízo: Introduções e Analítica do Belo", "juizo", "dir"),
    ("6.2", "Crítica do Juízo: Sublime, Dedução e Dialética estética", "juizo", "dir"),
    ("6.3", "Crítica do Juízo Teleológico", "juizo", "dir"),
    ("7.1", "Arquitetônica: a unidade do sistema", "fecho", "chave"),
    ("7.2", "Introdução à Metafísica dos Costumes", "direito", "topo"),
    ("7.3", "Introdução à Doutrina do Direito", "direito", "topo"),
    ("7.4", "Direito Privado I: o meu e o teu externo", "direito", "topo"),
    ("7.5", "Direito Privado II: aquisição originária e direito real", "direito", "topo"),
    ("7.6", "Direito Privado III: contrato, família e testamento", "direito", "topo"),
    ("7.7", "Direito Público I: a passagem ao Estado e os três poderes", "direito", "topo"),
    ("7.8", "Direito Público II: resistência, revolução e direito de punir", "direito", "topo"),
    ("7.9", "Direito Público III: direito das gentes e cosmopolita", "direito", "topo"),
]

BLOCOS = {
    "fundacao": ("Fundação", "Método e o problema crítico, de 1770 a 1783"),
    "teorica": ("Razão teórica", "Crítica da Razão Pura, 1781 e 1787"),
    "pratica": ("Razão prática", "Fundamentação da Metafísica dos Costumes, 1785, e Crítica da Razão Prática, 1788"),
    "juizo": ("Juízo", "Crítica do Juízo, 1790"),
    "fecho": ("Fecho de abóbada", "A liberdade e a unidade do sistema"),
    "direito": ("Doutrina do Direito", "Metafísica dos Costumes, 1797, com os escritos políticos de 1793 a 1798"),
}

IDS = [c[0] for c in CAPS]
MD = markdown.Markdown(extensions=["tables", "sane_lists", "fenced_code"])


@cache
def ler(cid):
    p = CAPS_DIR / f"{cid}.md"
    return p.read_text(encoding="utf-8") if p.exists() else None


def _indent(texto):
    out=[]
    for ln in texto.split("\n"):
        m=re.match(r"^( +)(?=(?:[-*] |\d+\. ))", ln)
        if m:
            n=len(m.group(1)); nivel=1 if n<4 else 2
            ln=" "*(4*nivel)+ln[n:]
        out.append(ln)
    return "\n".join(out)


def _separa_listas(texto):
    """Lista colada num parágrafo ganha linha em branco antes (só espaçamento)."""
    out = []
    lista = re.compile(r"^(?:[-*+]|\d+\.) ")
    for ln in texto.split("\n"):
        if lista.match(ln) and out and out[-1].strip() and not re.match(r"^\s*(?:[-*+]|\d+\.) ", out[-1]):
            out.append("")
        out.append(ln)
    return "\n".join(out)


def md2html(texto):
    MD.reset()
    return MD.convert(_indent(_separa_listas(texto)))


def secao_md(texto, nome):
    """Devolve o markdown entre '**nome**' e o próximo rótulo em negrito."""
    linhas = texto.split("\n")
    out, dentro = [], False
    for ln in linhas:
        s = ln.strip()
        if re.fullmatch(r"\*\*[^*]+\*\*", s):
            if dentro:
                break
            if s.strip("*").startswith(nome):
                dentro = True
                continue
        elif dentro:
            out.append(ln)
    return "\n".join(out).strip()


def excerto(texto):
    s = secao_md(texto, "Pergunta") or secao_md(texto, "Objetivo")
    s = s.split("\n\n")[0]
    h = md2html(s)
    return re.sub(r"^<p>|</p>$", "", h.strip())


def linkar(h):
    def rep(m):
        cid = m.group(2)
        if cid in IDS and ler(cid):
            return f'<a href="#cap-{cid}">{m.group(1)} {cid}</a>'
        return m.group(0)
    return re.sub(r"\b([Ee]tapas?) (\d(?:\.\d)?)(?![\d.]*\d)", rep, h)


def corpo(texto):
    h = md2html(texto)
    h = re.sub(r"<p><strong>([^<]+)</strong></p>", r"<h3>\1</h3>", h)
    h = re.sub(r"<p><em>([^<]+)</em></p>", r"<h4>\1</h4>", h)
    h = re.sub(r"<table>", '<div class="tabela"><table>', h)
    h = re.sub(r"</table>", "</table></div>", h)
    # links para outras etapas (fora do título)
    partes = h.split("</h1>", 1)
    if len(partes) == 2:
        h = partes[0] + "</h1>" + linkar(partes[1])
    # camada crítica
    marcas = list(re.finditer(r"<h3>(.*?)</h3>", h))
    if marcas:
        pedacos, ult = [], 0
        for i, m in enumerate(marcas):
            ini = m.start()
            fim = marcas[i + 1].start() if i + 1 < len(marcas) else len(h)
            pedacos.append(h[ult:ini])
            sec = h[ini:fim]
            if m.group(1).startswith("Atritos") or m.group(1).startswith("Dúvidas abertas"):
                sec = f'<div class="critica">{sec}</div>'
            pedacos.append(sec)
            ult = fim
        h = "".join(pedacos)
    return h


# ---------- planta (SVG) ----------
CX, CY, RO, RI = 400, 470, 330, 232


def setor(a1, a2):
    def pt(r, a):
        t = math.radians(a)
        return CX + r * math.cos(t), CY - r * math.sin(t)
    x1, y1 = pt(RO, a1); x2, y2 = pt(RO, a2)
    x3, y3 = pt(RI, a2); x4, y4 = pt(RI, a1)
    return (f"M{x1:.1f},{y1:.1f} A{RO},{RO} 0 0,1 {x2:.1f},{y2:.1f} "
            f"L{x3:.1f},{y3:.1f} A{RI},{RI} 0 0,0 {x4:.1f},{y4:.1f} Z")


def pedra(cid, titulo, bloco, forma, rx, ry, extra=""):
    escrito = ler(cid) is not None
    cls = f"pedra {bloco}" + ("" if escrito else " pendente")
    tit = html.escape(f"{cid} {titulo}" + ("" if escrito else " (a escrever)"))
    txt = f'<text x="{rx:.1f}" y="{ry:.1f}" text-anchor="middle" dominant-baseline="central">{cid}</text>{extra}'
    inner = f"<title>{tit}</title>{forma}{txt}"
    if escrito:
        return f'<a class="{cls}" href="#cap-{cid}" aria-label="{tit}">{inner}</a>'
    return f'<g class="{cls}">{inner}</g>'


def planta_svg():
    partes = []
    esq = [c for c in CAPS if c[3] == "esq"]
    dir_ = [c for c in CAPS if c[3] == "dir"]
    topo = [c for c in CAPS if c[3] == "topo"]
    chave = [c for c in CAPS if c[3] == "chave"][0]
    plinto = [c for c in CAPS if c[3] == "plinto"][0]
    g = 0.7
    k1, k2 = 97, 83
    # lado esquerdo: de 180 até 97
    passo = (180 - k1) / len(esq)
    for i, c in enumerate(esq):
        a_hi = 180 - i * passo
        a_lo = a_hi - passo
        a1, a2 = a_hi - g / 2, a_lo + g / 2
        mid = math.radians((a1 + a2) / 2); rm = (RO + RI) / 2
        partes.append(pedra(c[0], c[1], c[2], f'<path d="{setor(a1, a2)}"/>',
                            CX + rm * math.cos(mid), CY - rm * math.sin(mid)))
    # chave
    a1, a2 = k1 - g / 2, k2 + g / 2
    rm = (RO + RI) / 2
    partes.append(pedra(chave[0], chave[1], chave[2], f'<path d="{setor(a1, a2)}"/>', CX, CY - rm))
    # lado direito: de 83 até 0
    passo = k2 / len(dir_)
    for i, c in enumerate(dir_):
        a_hi = k2 - i * passo
        a_lo = a_hi - passo
        a1, a2 = a_hi - g / 2, a_lo + g / 2
        mid = math.radians((a1 + a2) / 2)
        partes.append(pedra(c[0], c[1], c[2], f'<path d="{setor(a1, a2)}"/>',
                            CX + rm * math.cos(mid), CY - rm * math.sin(mid)))
    # entablamento: Doutrina do Direito
    n = len(topo); x0, x1 = 128, 672; y0, alt = 76, 54
    w = (x1 - x0 - (n - 1) * 4) / n
    for i, c in enumerate(topo):
        x = x0 + i * (w + 4)
        partes.append(pedra(c[0], c[1], c[2],
                            f'<rect x="{x:.1f}" y="{y0}" width="{w:.1f}" height="{alt}" rx="1.5"/>',
                            x + w / 2, y0 + alt / 2))
    # plinto
    partes.append(pedra(plinto[0], plinto[1], plinto[2],
                        f'<rect x="40" y="478" width="720" height="40" rx="1.5"/>', 400, 498,
                        ""))
    rotulos = (
        '<text class="rot" x="400" y="62" text-anchor="middle">Doutrina do Direito</text>'
        '<text class="rot" x="400" y="270" text-anchor="middle">a liberdade</text>'
        '<text class="rot" x="150" y="548" text-anchor="middle">razão teórica</text>'
        '<text class="rot" x="650" y="548" text-anchor="middle">razão prática e juízo</text>'
    )
    return ('<svg viewBox="0 0 800 560" role="img" aria-labelledby="planta-tit">'
            '<title id="planta-tit">Planta do sistema crítico: cada pedra é um capítulo</title>'
            + "".join(partes) + rotulos + "</svg>")


def legenda():
    itens = []
    for b, (nome, _) in BLOCOS.items():
        itens.append(f'<li data-bloco="{b}"><span class="amostra"></span>{nome}</li>')
    itens.append('<li><span class="amostra vazia"></span>a escrever</li>')
    return '<ul class="legenda">' + "".join(itens) + "</ul>"


def indice():
    out = []
    for b, (nome, obra) in BLOCOS.items():
        itens = []
        for cid, tit, bl, _ in CAPS:
            if bl != b:
                continue
            t = ler(cid)
            if t:
                itens.append(
                    f'<li class="item"><a href="#cap-{cid}"><span class="num">{cid}</span>'
                    f'<span class="tit">{html.escape(tit)}</span>'
                    f'<span class="perg">{excerto(t)}</span></a></li>')
            else:
                itens.append(
                    f'<li class="item pendente"><div><span class="num">{cid}</span>'
                    f'<span class="tit">{html.escape(tit)}</span>'
                    f'<span class="perg">A escrever.</span></div></li>')
        out.append(f'<section class="bloco" data-bloco="{b}"><h2>{nome}</h2>'
                   f'<p class="obra">{obra}</p><ol class="itens">{"".join(itens)}</ol></section>')
    return "".join(out)


def faixa(atual):
    seg = []
    for cid, tit, bl, _ in CAPS:
        rot = html.escape(f"{cid} {tit}")
        if ler(cid):
            cls = "atual" if cid == atual else ""
            seg.append(f'<a data-bloco="{bl}" class="{cls}" href="#cap-{cid}" title="{rot}" aria-label="{rot}"></a>')
        else:
            seg.append(f'<span data-bloco="{bl}" class="pendente" title="{rot} (a escrever)"></span>')
    return '<nav class="faixa" aria-label="Posição no percurso">' + "".join(seg) + "</nav>"


def capitulos():
    escritos = [c for c in CAPS if ler(c[0])]
    out = []
    for i, (cid, tit, bl, _) in enumerate(escritos):
        t = ler(cid)
        ant = escritos[i - 1] if i > 0 else None
        seg = escritos[i + 1] if i + 1 < len(escritos) else None
        nav = '<nav class="passos">'
        nav += (f'<a href="#cap-{ant[0]}"><small>Anterior</small>{ant[0]} {html.escape(ant[1])}</a>'
                if ant else "<span></span>")
        nav += (f'<a class="seg" href="#cap-{seg[0]}"><small>Seguinte</small>{seg[0]} {html.escape(seg[1])}</a>'
                if seg else '<a class="seg" href="#planta"><small>Fim do que está escrito</small>Voltar à planta</a>')
        nav += "</nav>"
        nome, obra = BLOCOS[bl]
        out.append(
            f'<article class="vista capitulo" id="cap-{cid}" data-bloco="{bl}" '
            f'data-titulo="{html.escape(cid + " " + tit)}">'
            f'{faixa(cid)}'
            f'<div class="topo-cap"><p class="rotulo-bloco">{nome}: {obra}</p>'
            f'<button class="botao-critica" type="button" aria-pressed="false">Ocultar atritos e dúvidas</button></div>'
            f'{corpo(t)}{nav}</article>')
    return "".join(out)


def glossario():
    out = []
    for cid, tit, bl, _ in CAPS:
        t = ler(cid)
        if not t:
            continue
        s = secao_md(t, "Termos")
        if not s:
            continue
        out.append(f'<section class="grupo" data-bloco="{bl}"><h3><a href="#cap-{cid}">{cid} {html.escape(tit)}</a></h3>'
                   f'{md2html(s)}</section>')
    return "".join(out)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--conferir", action="store_true")
    args = parser.parse_args()
    destino = BASE.parent / "index.html"
    atual = destino.read_text(encoding="utf-8") if destino.exists() else ""
    publicados = set(re.findall(r'<article class="vista capitulo" id="cap-([^"]+)"', atual))
    fontes = {p.stem for p in CAPS_DIR.glob("*.md")}
    divergentes = (publicados - fontes) | (fontes - set(IDS))
    if divergentes:
        raise SystemExit(f"Capítulos publicados ausentes ou fora do índice: {sorted(divergentes)}")
    for cid in fontes:
        if not ler(cid).strip():
            raise SystemExit(f"Capítulo vazio: {cid}")
    tpl = (BASE / "pagina.html.in").read_text(encoding="utf-8")
    n_escritos = sum(1 for cid in IDS if ler(cid))
    blocos = {
        "PLANTA": planta_svg(),
        "LEGENDA": legenda(),
        "INDICE": indice(),
        "CAPITULOS": capitulos(),
        "GLOSSARIO": glossario(),
        "PROGRESSO": f"{n_escritos} de {len(CAPS)} capítulos escritos",
    }
    pagina = re.sub(r"\{\{(\w+)\}\}", lambda m: blocos[m[1]], tpl)
    if args.conferir:
        if atual != pagina:
            raise SystemExit(f"HTML diferente das fontes: {destino}")
        print(f"{n_escritos} capítulos de Kant conferidos.")
        return
    destino.write_bytes(pagina.encode("utf-8"))
    print(f"{n_escritos} capítulos em {destino}")


if __name__ == "__main__":
    main()
