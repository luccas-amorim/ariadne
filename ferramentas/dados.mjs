/* Lê somente os scripts de dados usados pelas páginas. O inventário recebe
   os mesmos registros que o navegador, inclusive os acrescentados em JS. */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function ler(arquivos, expressao) {
  const contexto = vm.createContext({ console: {
    warn(...args) { throw new Error(args.join(' ')); }
  } });
  for (const arquivo of arquivos) {
    const codigo = readFileSync(new URL('../' + arquivo, import.meta.url), 'utf8');
    vm.runInContext(codigo, contexto, { filename: arquivo });
  }
  return vm.runInContext(expressao, contexto);
}

const filosofia = ler(['filosofia/dados/filosofos.js', 'filosofia/problemas/dados.js'], `({
  autor: FILOS.map(f => f[0]),
  escola: ESCOLAS.map(e => e[0]),
  influencia: REL.trim().split(/\\s+/),
  problema: PROBLEMAS.map(p => p.id),
  subproblema: SUBPROBLEMAS.map(s => s.id),
  posicao: POSICOES.map(p => p.id),
  relacao: POSICOES.flatMap(p => p.relacoes.map(([tipo, alvo]) => p.id + '/' + tipo + '/' + alvo))
})`);

const direito = ler(['filosofia/filosofia-do-direito/dados.js'], `({
  era: ERAS.map(e => e.id),
  "autor-filosofia-do-direito": ERAS.flatMap(e => e.autores.map(a => a.id)),
  tema: TEMAS.map(t => t.id)
})`);

const atlas = ler(['direito/tribunais-internacionais/geo.js', 'direito/tribunais-internacionais/dados.js'],
  '({ T, FAM, ST, CITY, CITY2, N26, nomes: GEO.names, mundo: GEO.world.pts, europa: GEO.eur.pts })');
const tribunais = {
  tribunal: atlas.T.map(t => t.id),
  "familia-tribunal": Object.keys(atlas.FAM),
  "noticia-tribunal-2026": Object.keys(atlas.N26)
};
const idsTribunais = new Set(tribunais.tribunal);
for (const id of [...Object.keys(atlas.CITY), ...Object.keys(atlas.CITY2), ...tribunais["noticia-tribunal-2026"]]) {
  if (!idsTribunais.has(id)) throw new Error(`Atlas: referência a tribunal ausente: ${id}`);
}
for (const t of atlas.T) {
  if (!atlas.FAM[t.f] || !atlas.ST[t.st]) throw new Error(`Atlas: família ou situação inválida: ${t.id}`);
  const sedes = [atlas.CITY[t.id]];
  if (atlas.CITY2[t.id]) sedes.push(atlas.CITY2[t.id]);
  for (const sede of sedes) {
    if (!atlas.nomes[sede] || !(atlas.mundo[sede] || atlas.europa[sede])) {
      throw new Error(`Atlas: sede sem nome ou posição no mapa: ${t.id} (${sede})`);
    }
  }
}

const processos = ler(process.argv.slice(2), `({
  rito: Object.keys(MAPS),
  estacao: Object.values(MAPS).flatMap(m => m.st.map(s => m.key + '/' + s.id))
})`);

process.stdout.write(JSON.stringify({ ...filosofia, ...direito, ...tribunais, ...processos }));
