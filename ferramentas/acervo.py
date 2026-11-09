"""Confere os endereços e identificadores publicados e registra ampliações."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
from urllib.parse import unquote, urlsplit


RAIZ = Path(__file__).resolve().parents[1]
INVENTARIO = Path(__file__).with_name("acervo.tsv")


class Pagina(HTMLParser):
    def __init__(self):
        super().__init__()
        self.capitulos = []
        self.recursos = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        atributos = dict(attrs)
        if tag == "article" and "id" in atributos:
            self.capitulos.append(atributos["id"])
        if tag == "script" and atributos.get("src"):
            self.scripts.append(atributos["src"])
        for chave in ("href", "src"):
            if atributos.get(chave):
                self.recursos.append(atributos[chave])


def conferir_recursos(pagina, recursos):
    for url in recursos:
        ref = urlsplit(url)
        if ref.scheme or ref.netloc or not ref.path:
            continue
        caminho = unquote(ref.path)
        if caminho.startswith("/ariadne/"):
            alvo = RAIZ / caminho[len("/ariadne/"):]
        else:
            alvo = pagina.parent / caminho
        if alvo.is_dir():
            alvo = alvo / "index.html"
        if not alvo.is_file():
            raise SystemExit(f"{pagina.relative_to(RAIZ)}: recurso ausente: {url}")


def inventariar():
    grupos = {"pagina": [], "capitulo": []}
    scripts_processos = []
    for arquivo in RAIZ.rglob("*.html"):
        relativo = arquivo.relative_to(RAIZ)
        if any(p.startswith(".") or p == "node_modules" for p in relativo.parts):
            continue
        pagina = Pagina()
        pagina.feed(arquivo.read_text(encoding="utf-8"))
        pagina.close()
        conferir_recursos(arquivo, pagina.recursos)
        grupos["pagina"].append(relativo.as_posix())
        grupos["capitulo"].extend(f"{relativo.as_posix()}#{c}" for c in pagina.capitulos)
        if relativo.as_posix() == "direito/mapas-dos-processos/index.html":
            scripts_processos = [(relativo.parent / s).as_posix() for s in pagina.scripts
                                if s.startswith("dados/")]
    dados = subprocess.run(["node", str(Path(__file__).with_name("dados.mjs")), *scripts_processos],
                           stdout=subprocess.PIPE, check=True)
    grupos.update(json.loads(dados.stdout))
    registros = set()
    for grupo, ids in grupos.items():
        for identificador in ids:
            registro = f"{grupo}\t{identificador}"
            if registro in registros:
                raise SystemExit(f"Identificador repetido: {registro}")
            registros.add(registro)
    return registros


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registrar", action="store_true", help="registra novos identificadores")
    parser.add_argument("--base", help="também protege os registros presentes nesta revisão Git")
    args = parser.parse_args()
    anteriores = set(INVENTARIO.read_text(encoding="utf-8").splitlines())
    protegidos = anteriores.copy()
    if args.base:
        arquivo = INVENTARIO.relative_to(RAIZ).as_posix()
        entrada = subprocess.check_output(["git", "ls-tree", args.base, "--", arquivo], cwd=RAIZ)
        if entrada:  # A primeira versão do projeto ainda não tinha um inventário.
            referencia = subprocess.check_output(["git", "show", f"{args.base}:{arquivo}"],
                                                  cwd=RAIZ, encoding="utf-8")
            protegidos.update(referencia.splitlines())
    atuais = inventariar()
    ausentes = protegidos - atuais
    if ausentes:
        raise SystemExit("Desapareceram do acervo:\n" + "\n".join(sorted(ausentes)))
    if atuais != anteriores:
        if not args.registrar:
            raise SystemExit("Novos registros. Confira e inclua com --registrar:\n" +
                             "\n".join(sorted(atuais - anteriores)))
        INVENTARIO.write_text("\n".join(sorted(atuais)) + "\n", encoding="utf-8", newline="\n")
    print(f"Acervo conferido: {len(atuais)} identificadores.")


if __name__ == "__main__":
    main()
