#!/usr/bin/env node
/**
 * Camada de dispositivos (experimental): lê o HTML compilado de um diploma, salvo localmente
 * a partir do Planalto, e emite docs/data/dispositivos/<id>.json com artigos, parágrafos,
 * incisos e alíneas de uma faixa de artigos. Não guarda o texto da lei: só ponteiros
 * (chave, pai, URN, remissões explícitas) e o hash de cada trecho, para detectar mudanças.
 * Não busca nada na rede: o arquivo de entrada é baixado à mão.
 *
 *   node scripts/extract-dispositivos.js <arquivo.htm> [--diploma cc] [--de 927] [--ate 954]
 *        [--pai cc/parte-especial/livro-i/titulo-ix] [--saida docs/data/dispositivos/cc.json]
 *
 * Padrão (prova de conceito): Código Civil, Título IX da Parte Especial, arts. 927 a 954.
 * Os fragmentos de URN seguem o padrão de identificadores do LexML (art, par, par1u, cpt,
 * inc, ali) e saem marcados como gerados, sem conferência um a um.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const input = args.find(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'));
if (!input) {
  console.error('Uso: node scripts/extract-dispositivos.js <arquivo.htm> [--diploma cc] [--de 927] [--ate 954] [--pai chave] [--saida arquivo.json]');
  process.exit(1);
}
const diplomaId = opt('diploma', 'cc');
const from = +opt('de', 927), to = +opt('ate', 954);
const parentKey = opt('pai', 'cc/parte-especial/livro-i/titulo-ix');
const outFile = path.resolve(ROOT, opt('saida', `docs/data/dispositivos/${diplomaId}.json`));
const doc = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'data', `${diplomaId}.json`), 'utf8'));

// ---------- HTML → parágrafos de texto ----------
const ENTITIES = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ordm: 'º', ordf: 'ª', sect: '§', ndash: '–', mdash: '—', laquo: '«', raquo: '»', deg: '°' };
const decode = s => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? (m.normalize ? m : m));
function readHtml(file) {
  const raw = fs.readFileSync(file);
  const utf8 = raw.toString('utf8');
  // o Planalto publica em windows-1252; se o UTF-8 trouxer caracteres de substituição, relê
  const html = utf8.includes('�') ? new TextDecoder('windows-1252').decode(raw) : utf8;
  return html
    .replace(/<(strike|s|del)\b[\s\S]*?<\/\1>/gi, ' ')   // redações revogadas, riscadas
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
}
function paragraphs(html) {
  return html.split(/<p\b[^>]*>/i).slice(1)
    .map(chunk => decode(chunk.split(/<\/p>/i)[0].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')))
    .map(t => t.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
/** Texto normativo sem as notas editoriais do Planalto (Vide, Incluído, Redação dada…). */
const clean = t => t.replace(/\((?:Vide|Inclu[íi]d[oa]|Reda[çc][ãa]o dada|Revogad[oa]|Vig[êe]ncia|Acrescentad[oa]|Renumerad[oa])[^)]*\)/gi, ' ').replace(/\s+/g, ' ').trim();
const hash = t => 'sha256:' + crypto.createHash('sha256').update(t.normalize('NFC')).digest('hex').slice(0, 16);

// ---------- remissões explícitas ----------
const ROMAN = { I: 1, V: 5, X: 10, L: 50, C: 100 };
const romanToInt = r => [...r].reduce((acc, ch, i, arr) => acc + (ROMAN[ch] < (ROMAN[arr[i + 1]] || 0) ? -ROMAN[ch] : ROMAN[ch]), 0);
const artKey = n => `${diplomaId}/art-${String(n).toLowerCase()}`;
const OTHER_LAW = /^\s*,?\s*(?:d[ao]s?\s+)?(?:Lei|Decreto|C[óo]digo\s+de|Constitui[çc][ãa]o|Estatuto|CPC|CPP|CDC|CLT|Consolida[çc][ãa]o)/i;
/** Remissões do trecho a outros dispositivos deste mesmo diploma. */
function remissions(text, currentArt) {
  const out = new Set();
  const notOther = idx => !OTHER_LAW.test(text.slice(idx, idx + 40));
  // "inciso II do art. 188", "incisos I a V do artigo antecedente"
  for (const m of text.matchAll(/incisos?\s+([IVXLC]+)(?:\s+(?:a|e)\s+([IVXLC]+))?\s+do\s+(art\.\s*(\d+(?:-[A-Z])?)|artigo\s+antecedente)/gi)) {
    const art = m[4] || String(currentArt - 1);
    if (m[4] && !notOther(m.index + m[0].length)) continue;
    const a = romanToInt(m[1].toUpperCase()), b = m[2] ? romanToInt(m[2].toUpperCase()) : a;
    for (let k = a; k <= b; k++) out.add(`${artKey(art)}/inc-${toRoman(k).toLowerCase()}`);
  }
  // "parágrafo único do artigo antecedente" / "parágrafo único do art. 942"
  for (const m of text.matchAll(/par[áa]grafo\s+[úu]nico\s+do\s+(art\.\s*(\d+(?:-[A-Z])?)|artigo\s+antecedente)/gi)) {
    const art = m[2] || String(currentArt - 1);
    if (m[2] && !notOther(m.index + m[0].length)) continue;
    out.add(`${artKey(art)}/par-unico`);
  }
  // "art. 188, inciso I"
  for (const m of text.matchAll(/art\.\s*(\d+(?:-[A-Z])?)\s*,\s*inciso\s+([IVXLC]+)/gi)) {
    if (notOther(m.index + m[0].length)) out.add(`${artKey(m[1])}/inc-${m[2].toLowerCase()}`);
  }
  // "art. 186", "arts. 186 e 187", "arts. 932, 933 e 934"
  for (const m of text.matchAll(/\barts?\.\s*((?:\d+(?:-[A-Z])?)(?:\s*(?:,|e|a)\s*\d+(?:-[A-Z])?)*)/gi)) {
    if (!notOther(m.index + m[0].length)) continue;
    const nums = m[1].split(/\s*(?:,|e|a)\s*/).filter(Boolean);
    const isRange = /\d\s+a\s+\d/.test(m[1]) && nums.length === 2;
    const list = isRange ? Array.from({ length: +nums[1] - +nums[0] + 1 }, (_, i) => String(+nums[0] + i)) : nums;
    // remissão mais específica (art. N, inciso X / inciso X do art. N) já registrada: não repete o artigo
    list.forEach(n => { if (![...out].some(k => k.startsWith(artKey(n) + '/'))) out.add(artKey(n)); });
  }
  return [...out].filter(k => k !== artKey(currentArt));
}
function toRoman(n) {
  const t = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; } return s;
}

// ---------- estrutura ----------
function extract(pars) {
  const out = [];
  let art = null, par = null, inc = null, inRange = false;
  const urnBase = doc.urn;
  for (const p of pars) {
    let m;
    if ((m = /^Art\.\s*(\d+)(?:º|o)?(-[A-Z])?\s*[.\-–]/.exec(p))) {
      const n = +m[1];
      if (n > to) break;
      inRange = n >= from;
      if (!inRange) continue;
      const num = `${n}${m[2] || ''}`;
      art = { key: artKey(num), num, frag: `art${num.replace('-', '').toLowerCase()}`, n };
      par = null; inc = null;
      const text = clean(p);
      out.push({ key: art.key, parent: parentKey, kind: 'artigo', num, urn: `${urnBase}!${art.frag}`, remete: remissions(text, n), hash: hash(text) });
      continue;
    }
    if (!inRange || !art) continue;
    const text = clean(p);
    if ((m = /^Par[áa]grafo\s+[úu]nico\b/i.exec(p)) || (m = /^§\s*(\d+)\s*(?:º|o)?/.exec(p))) {
      const unico = !m[1];
      par = { key: `${art.key}/${unico ? 'par-unico' : `par-${m[1]}`}`, frag: `${art.frag}_${unico ? 'par1u' : `par${m[1]}`}` };
      inc = null;
      out.push({ key: par.key, parent: art.key, kind: 'paragrafo', num: unico ? 'único' : m[1], urn: `${urnBase}!${par.frag}`, remete: remissions(text, art.n), hash: hash(text) });
    } else if ((m = /^([IVXLC]+)\s*[-–—]\s/.exec(p))) {
      const holder = par || { key: art.key, frag: `${art.frag}_cpt` };
      inc = { key: `${holder.key}/inc-${m[1].toLowerCase()}`, frag: `${holder.frag}_inc${romanToInt(m[1])}` };
      out.push({ key: inc.key, parent: holder.key, kind: 'inciso', num: m[1], urn: `${urnBase}!${inc.frag}`, remete: remissions(text, art.n), hash: hash(text) });
    } else if ((m = /^([a-z])\)\s/.exec(p)) && inc) {
      const idx = m[1].charCodeAt(0) - 96;
      out.push({ key: `${inc.key}/ali-${m[1]}`, parent: inc.key, kind: 'alinea', num: m[1], urn: `${urnBase}!${inc.frag}_ali${idx}`, remete: remissions(text, art.n), hash: hash(text) });
    }
  }
  return out;
}

const items = extract(paragraphs(readHtml(input)));
if (!items.length) { console.error(`Nenhum dispositivo entre os arts. ${from} e ${to} em ${input}.`); process.exit(1); }
const result = {
  $schema: '../schema.json#/definitions/dispositivos',
  description: 'Camada experimental, gerada por scripts/extract-dispositivos.js a partir do texto compilado do Planalto. Sem o texto da lei: só a estrutura, a URN, as remissões explícitas e o hash de cada trecho (sem as notas editoriais). Os fragmentos de URN seguem o padrão do LexML e não foram conferidos um a um.',
  diploma: diplomaId,
  status: 'gerado',
  source: doc.source,
  scope: [parentKey],
  range: `Arts. ${from} a ${to}`,
  dispositivos: items
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n');
const byKind = items.reduce((a, d) => ({ ...a, [d.kind]: (a[d.kind] || 0) + 1 }), {});
console.log(`${path.relative(ROOT, outFile)}: ${items.length} dispositivos (${Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(', ')}), ${items.filter(d => d.remete.length).length} com remissão.`);
