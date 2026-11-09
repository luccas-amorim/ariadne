"""Monta ou confere os quatro livros estáticos a partir de suas fontes editoriais."""
import argparse
from pathlib import Path
import re
import subprocess
import sys


RAIZ = Path(__file__).resolve().parents[1]
LIVROS = (
    "filosofia/hegel/logica",
    "filosofia/hegel/direito",
    "historia/ideologias-politicas",
)
CAPITULO = re.compile(r"\{\{capitulo:([a-z0-9-]+)\}\}")


def montar_livro(pasta):
    fontes = pasta / "fontes"
    modelo = (fontes / "pagina.html.in").read_text(encoding="utf-8")
    ordem = CAPITULO.findall(modelo)
    arquivos = {p.name.removesuffix(".html.in"): p for p in
                (fontes / "capitulos").glob("*.html.in")}
    if not ordem or len(ordem) != len(set(ordem)):
        raise ValueError(f"{pasta}: lista de capítulos vazia ou com repetição")
    if set(ordem) != arquivos.keys():
        raise ValueError(f"{pasta}: capítulos ausentes ou fora do modelo: "
                         f"{sorted(set(ordem) ^ arquivos.keys())}")

    def incluir(marca):
        codigo = marca[1]
        arquivo = arquivos[codigo]
        artigo = arquivo.read_text(encoding="utf-8").removesuffix("\n")
        if not re.fullmatch(rf'<article\b[^>]*\bid="{codigo}"[^>]*>.*</article>', artigo, re.S):
            raise ValueError(f"{arquivo}: esperado um artigo com id {codigo}")
        return artigo

    return CAPITULO.sub(incluir, modelo)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--conferir", action="store_true",
                        help="compara as versões publicáveis sem gravar arquivos")
    args = parser.parse_args()
    paginas = {RAIZ / livro / "index.html": montar_livro(RAIZ / livro) for livro in LIVROS}
    desatualizadas = [p for p, html in paginas.items()
                      if not p.exists() or p.read_text(encoding="utf-8") != html]
    if args.conferir and desatualizadas:
        raise SystemExit("HTML diferente das fontes: " +
                         ", ".join(str(p.relative_to(RAIZ)) for p in desatualizadas))

    kant = RAIZ / "filosofia/kant/criticas/fontes/gerar.py"
    comando = [sys.executable, str(kant)]
    if args.conferir:
        comando.append("--conferir")
    subprocess.run(comando, check=True)
    for p in desatualizadas:
        p.write_text(paginas[p], encoding="utf-8", newline="\n")
    print("Quatro livros conferidos." if args.conferir else "Quatro livros atualizados.")


if __name__ == "__main__":
    main()
