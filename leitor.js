/* Leitor dos cadernos divididos em capítulos. Os links do índice e da régua
   apontam para o id do artigo, inclusive no prólogo e no epílogo. */
(() => {
  const script = document.currentScript;
  const { prefixo, obra } = script.dataset;
  const indice = document.getElementById('indice');
  const leitura = document.getElementById('leitura');
  const onde = document.getElementById('onde');
  const capitulos = leitura.querySelectorAll('article.cap');
  const segmentos = leitura.querySelectorAll('.regua.mini .seg');
  const tituloIndice = document.title;
  let ultimo = null;

  function voltarAoIndice() {
    leitura.hidden = true;
    indice.hidden = false;
    document.title = tituloIndice;
    if (!ultimo) {
      window.scrollTo(0, 0);
      return;
    }
    const link = indice.querySelector(`.item a[href="#${ultimo.id}"]`);
    if (!link) return;
    if (script.hasAttribute('data-centralizar-na-janela')) {
      const rect = link.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top + (rect.height - window.innerHeight) / 2);
    } else {
      link.scrollIntoView({ block: 'center' });
    }
    link.focus({ preventScroll: true });
  }

  function navegar() {
    const id = location.hash.slice(1);
    const capitulo = id.startsWith(prefixo) ? document.getElementById(id) : null;
    if (!capitulo?.matches('article.cap')) {
      if (id.startsWith(prefixo) && /^\d+$/.test(id.slice(prefixo.length))) {
        location.hash = '';
        return;
      }
      voltarAoIndice();
      return;
    }
    for (const artigo of capitulos) artigo.hidden = artigo !== capitulo;
    for (const segmento of segmentos) {
      segmento.classList.toggle('atual', segmento.hash === location.hash);
    }
    onde.textContent = capitulo.querySelector('.rot').textContent;
    document.title = capitulo.querySelector('h2').textContent + ' — ' + obra;
    indice.hidden = true;
    leitura.hidden = false;
    ultimo = capitulo;
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', navegar);
  navegar();
})();
