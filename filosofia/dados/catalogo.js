/* Lê as linhas de filosofos.js para os dois mapas. As coordenadas e as
   relações de cada visualização são calculadas na página que as utiliza. */
const CatalogoFilosofico = (() => {
  const escolas = Object.fromEntries(ESCOLAS.map(([id, nome, per, fam, y, desc]) =>
    [id, { id, nome, per, fam, y, desc }]
  ));

  function anoTxt(ano) {
    return ano < 0 ? `${-ano} a.C.` : String(ano);
  }

  function datasDe(inicio, fim, aproximado) {
    const prefixo = aproximado ? 'c. ' : '';
    if (fim == null) return `n. ${prefixo}${anoTxt(inicio)}`;
    if (inicio < 0 && fim < 0) return `${prefixo}${-inicio}–${-fim} a.C.`;
    if (inicio < 0 && fim > 0) return `${prefixo}${anoTxt(inicio)}–${fim} d.C.`;
    return `${prefixo}${inicio}–${fim}`;
  }

  const autores = FILOS.map(([id, nome, b, d, esc, areas, ap, obras, nota, per]) => ({
    id, nome, b, d, esc, areas,
    ap: Boolean(ap),
    obras: obras ? obras.split('; ') : [],
    nota: nota || '',
    per: per || escolas[esc]?.per,
    dt: datasDe(b, d, ap),
    pag: PAGINAS[id] || null
  }));

  return { escolas, autores, anoTxt };
})();
