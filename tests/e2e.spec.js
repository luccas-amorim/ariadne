// Testes de interface: abrir, expandir, focar, buscar, comparar, estudar, 3D, tema e lista.
// Rodar: npm run test:install (uma vez) e npm test. O servidor estático sobe sozinho.
const { test, expect } = require('@playwright/test');

const nodes = page => page.locator('#view-main g.node');
const nodeByKey = (page, key) => page.locator(`#view-main g.node[data-key="${key}"]`);

test.beforeEach(async ({ page }) => {
  page.on('pageerror', e => { throw e; });
});

test('abre o mapa com a Constituição ao centro e os ramos', async ({ page }) => {
  await page.goto('/#/');
  await expect(nodeByKey(page, 'cf')).toBeVisible();
  await expect(nodeByKey(page, 'privado')).toBeVisible();
  await expect(nodeByKey(page, 'penal')).toBeVisible();
  await expect(page.locator('#content-panel h2')).toHaveText('Mapa do ordenamento');
  await expect(page.locator('#filter-count')).toHaveText('12');
});

test('clicar em um diploma expande no próprio mapa e atualiza URL, trilha e painel', async ({ page }) => {
  await page.goto('/#/');
  await nodeByKey(page, 'cc').click();
  await expect(page).toHaveURL(/#\/cc$/);
  await expect(nodeByKey(page, 'cc/parte-geral')).toBeVisible();
  await expect(page.locator('#breadcrumb')).toContainText('CC');
  await expect(page.locator('#content-panel h2')).toHaveText('Código Civil');
  // o nó central continua presente: nada trocou de tela
  await expect(nodeByKey(page, 'cf')).toBeVisible();
});

test('link profundo expande os ancestrais e desenha relações internormativas', async ({ page }) => {
  await page.goto('/#/cpc/parte-especial/livro-i');
  await expect(nodeByKey(page, 'cpc/parte-especial/livro-i')).toBeVisible();
  await expect(page.locator('#content-panel h2')).toContainText('Livro I');
  await expect(page.locator('#view-main path.relation').first()).toBeVisible();
  await expect(page.locator('#tabpanel-relacoes')).toContainText('processa');
});

test('relações têm direção: setas chegam ao CP e saem dele para a CLT', async ({ page }) => {
  await page.goto('/#/cp');
  await expect(page.locator('#view-main path.relation[marker-end]')).toHaveCount(8);
  await expect(page.locator('#view-main path.relation.in')).toHaveCount(7);
  await expect(page.locator('#view-main path.relation.out')).toHaveCount(1);
  await expect(page.locator('#tabpanel-relacoes')).toContainText('fundamento: arts. 337-E a 337-P do CP');
});

test('relação some antes da vigência dos dois nós', async ({ page }) => {
  await page.goto('/#/cf/titulo-iii/cap-vii');
  await expect(page.locator('#view-main path.relation')).toHaveCount(2);
  await page.goto('/#/cf/titulo-iii/cap-vii?ano=1990');
  await expect(page.locator('#tl-year')).toHaveText('1990');
  await expect(page.locator('#view-main path.relation')).toHaveCount(0);
  await expect(page.locator('#tabpanel-relacoes .rel-card')).toHaveCount(0);
});

test('botão Relações oculta e reexibe as linhas, e a escolha persiste', async ({ page }) => {
  await page.goto('/#/cpc/parte-especial/livro-i');
  await expect(page.locator('#view-main path.relation').first()).toBeVisible();
  await page.click('#btn-relations');
  await expect(page.locator('#view-main path.relation')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#btn-relations')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#view-main path.relation')).toHaveCount(0);
  await page.locator('body').press('x');
  await expect(page.locator('#view-main path.relation').first()).toBeVisible();
});

test('foco gera um radial especializado com o diploma ao centro', async ({ page }) => {
  await page.goto('/#/cc?foco=cc');
  await expect(nodeByKey(page, 'cc')).toBeVisible();
  await expect(nodeByKey(page, 'cf')).toHaveCount(0);
  await expect(page.locator('#breadcrumb')).toContainText('Foco: CC');
  await page.getByRole('link', { name: 'Ver no mapa completo' }).click();
  await expect(nodeByKey(page, 'cf')).toBeVisible();
});

test('filtro de diplomas remove ramos sem diploma visível', async ({ page }) => {
  await page.goto('/#/?d=cc,cp&p=0');
  await expect(nodeByKey(page, 'privado')).toBeVisible();
  await expect(nodeByKey(page, 'social')).toHaveCount(0);
  await expect(page.locator('#filter-count')).toHaveText('2');
});

test('busca encontra um capítulo e navega até ele', async ({ page }) => {
  await page.goto('/#/');
  await page.fill('#search', 'usucapiao');
  await expect(page.locator('#search-results li').first()).toBeVisible();
  await page.locator('#search-results a').first().click();
  await expect(page).toHaveURL(/#\/cf\/titulo-vii\/cap-ii/);
  await expect(page.locator('#content-panel h2')).toContainText('Política Urbana');
});

test('colar uma URN LexML ou um IRI na busca abre o nó', async ({ page }) => {
  await page.goto('/#/');
  await expect(nodeByKey(page, 'cf')).toBeVisible();
  await page.fill('#search', 'urn:lex:br:federal:lei:2002-01-10;10406');
  await expect(page.locator('#search-results li')).toHaveCount(1);
  await page.locator('#search').press('Enter');
  await expect(page).toHaveURL(/#\/cc$/);
  await expect(page.locator('#content-panel h2')).toHaveText('Código Civil');
  // fragmento sem correspondência verificada cai no diploma
  await page.fill('#search', 'urn:lex:br:federal:decreto.lei:1940-12-07;2848!art121');
  await page.locator('#search').press('Enter');
  await expect(page).toHaveURL(/#\/cp$/);
  await page.fill('#search', 'https://luccas-amorim.github.io/ariadne/id/cc/parte-geral/livro-i');
  await page.locator('#search').press('Enter');
  await expect(page).toHaveURL(/#\/cc\/parte-geral\/livro-i$/);
  await page.fill('#search', 'urn:lex:br:federal:lei:1999-01-30;99999');
  await expect(page.locator('#search-results')).toContainText('Identificador não encontrado');
});

test('expandir tudo abre todas as divisões e recolher volta ao início', async ({ page }) => {
  await page.goto('/#/cp');
  await page.click('#ctl-grow');
  await expect(page.locator('#ctl-grow')).toBeDisabled({ timeout: 15000 });
  await expect(nodeByKey(page, 'cp/parte-especial/titulo-i')).toBeVisible();
  await page.click('#ctl-collapse');
  await expect(page).toHaveURL(/#\/$/);
  await expect(nodeByKey(page, 'cp/parte-especial')).toHaveCount(0);
});

test('modo estudo faz uma pergunta e registra erro na trilha', async ({ page }) => {
  await page.goto('/#/cc');
  await page.click('#btn-study');
  await expect(page.locator('.study-card')).toBeVisible();
  await expect(page.locator('.study-opt')).toHaveCount(4);
  await page.locator('.study-opt').first().click();
  await expect(page.locator('.study-head .chip')).toHaveText(/Certo|Errado/);
  await page.click('#study-stop');
  await expect(page.locator('.study-card')).toHaveCount(0);
});

test('trilha pessoal marca o nó e persiste após recarregar', async ({ page }) => {
  await page.goto('/#/cc/parte-geral/livro-i');
  const studied = page.locator('#node-footer').getByRole('button', { name: 'Estudado' });
  await expect(studied).toHaveAttribute('aria-pressed', 'false');
  await studied.click();
  await expect(studied).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#node-footer').getByRole('button', { name: 'Estudado' })).toHaveAttribute('aria-pressed', 'true');
  await expect(nodeByKey(page, 'cc/parte-geral/livro-i').locator('.trail-mark')).toBeVisible();
});

test('comparação mostra dois radiais focados', async ({ page }) => {
  await page.goto('/#/compare?a=cc&b=cpc');
  await expect(page.locator('#view-compare .pane')).toHaveCount(2);
  await expect(page.locator('#view-compare .pane').nth(0).locator('g.node.center')).toBeVisible();
  await expect(page.locator('#view-compare .pane').nth(1).locator('g.node.center')).toBeVisible();
  await expect(page.locator('#breadcrumb')).toContainText('Comparar');
});

test('lista acessível reflete a árvore e marca o nó atual', async ({ page }) => {
  await page.goto('/#/cc/parte-geral');
  await page.click('#btn-outline');
  await expect(page.locator('#outline [role="tree"]')).toBeVisible();
  await expect(page.locator('#outline a.current')).toContainText('Parte Geral');
});

test('tema alterna e persiste', async ({ page }) => {
  await page.goto('/#/');
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.click('#btn-theme');
  const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(after).not.toBe(before);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(after);
});

test('navegação por teclado percorre irmãos e expande filhos', async ({ page }) => {
  await page.goto('/#/cc/parte-geral');
  await page.locator('body').press('ArrowDown');
  await expect(page).toHaveURL(/#\/cc\/parte-especial$/);
  await page.locator('body').press('ArrowRight');
  await expect(page).toHaveURL(/#\/cc\/parte-especial\/livro-i$/);
});

test('linha do tempo mostra antecessores e oculta diplomas futuros', async ({ page }) => {
  await page.goto('/#/?ano=1975');
  await expect(page.locator('#timeline-bar')).toBeVisible();
  await expect(page.locator('#tl-year')).toHaveText('1975');
  // CF/88 ainda não existe: o centro é a Constituição de 1967
  await expect(nodeByKey(page, 'cf').locator('text.label')).toHaveText('CF/1967');
  // CDC (1990) não aparece; CC aparece como o Código de 1916
  await expect(nodeByKey(page, 'cdc')).toHaveCount(0);
  await expect(nodeByKey(page, 'cc').locator('text.label')).toHaveText('CC/1916');
  await expect(nodeByKey(page, 'cp')).toBeVisible();
  await page.click('#tl-today');
  await expect(page).toHaveURL(/#\/$/);
  await expect(nodeByKey(page, 'cdc')).toBeVisible();
});

test('divisão incluída depois só aparece a partir do seu ano', async ({ page }) => {
  await page.goto('/#/clt?ano=2010');
  await expect(nodeByKey(page, 'clt/titulo-iv-a')).toHaveCount(0);
  await page.goto('/#/clt?ano=2018');
  await expect(nodeByKey(page, 'clt/titulo-iv-a')).toBeVisible();
});

test('percurso guiado navega passo a passo', async ({ page }) => {
  await page.goto('/#/');
  await page.click('#btn-tours');
  await page.click('[data-tour="compra-defeituosa"]');
  await expect(page.locator('#tour-card')).toBeVisible();
  await expect(page.locator('#tour-card .tour-head')).toContainText('passo 1 de');
  await expect(page).toHaveURL(/#\/cf\/titulo-vii\/cap-i/);
  await page.click('#tour-next');
  await expect(page.locator('#tour-card .tour-head')).toContainText('passo 2 de');
  await page.click('#tour-next');
  await expect(page).toHaveURL(/#\/cdc\/titulo-i\/cap-iv/);
  await expect(page.locator('#content-panel h2')).toContainText('Capítulo IV');
  await page.click('#tour-close');
  await expect(page.locator('#tour-card')).toBeHidden();
});

test('modo 3D cria um canvas WebGL quando suportado', async ({ page }) => {
  await page.goto('/#/?m=3d');
  const supported = await page.evaluate(() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } });
  test.skip(!supported, 'WebGL indisponível neste ambiente');
  await expect(page.locator('#view-main canvas')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('#seg-3d')).toHaveAttribute('aria-pressed', 'true');
});

// ---------- Modo aula e tela cheia ----------
const aulaNode = (page, key) => page.locator(`#aula-view g.node[data-key="${key}"]`);

test('modo aula mostra todas as relações agregadas e filtra por tipo', async ({ page }) => {
  await page.goto('/#/aula');
  await expect(page.locator('#aula')).toBeVisible();
  await expect(page.locator('#tree-container')).toBeHidden();
  await expect(page.locator('#aula-count')).toHaveText('12 diplomas · 27 de 27 relações visíveis');
  await page.goto('/#/aula?tipos=processa');
  await expect(page.locator('#aula-count')).toContainText('5 de 27');
  // cpc → cc (×4) e cpp → cp: duas linhas, espessura pela contagem
  await expect(page.locator('#aula-view path.relation')).toHaveCount(2);
  await expect(page.locator('#aula-view path.relation[data-n="4"]')).toHaveCount(1);
  await page.click('#aula-types button[data-type="executa"]');
  await expect(page).toHaveURL(/tipos=processa,executa/);
  await expect(page.locator('#aula-count')).toContainText('7 de 27');
  await page.click('#aula-show');
  await expect(page).toHaveURL(/rel=0/);
  await expect(page.locator('#aula-view path.relation')).toHaveCount(0);
  await expect(page.locator('#aula-count')).toContainText('0 de 27');
});

test('modo aula: clicar num diploma isola suas relações', async ({ page }) => {
  await page.goto('/#/aula');
  await aulaNode(page, 'cp').click();
  await expect(page).toHaveURL(/sel=cp/);
  await expect(page.locator('#aula-foot')).toContainText('recebe 7 · emite 1');
  await expect(page.locator('#aula-foot .aula-card')).toHaveCount(8);
  await expect(page.locator('#aula-view path.relation.hl')).toHaveCount(7);
  await expect(aulaNode(page, 'cc')).toHaveAttribute('opacity', '0.25');
  await expect(aulaNode(page, 'cpp')).toHaveAttribute('opacity', '1');
  await aulaNode(page, 'cp').click();
  await expect(page).not.toHaveURL(/sel=/);
  await expect(page.locator('#aula-foot')).toContainText('Mapa do ordenamento');
  await aulaNode(page, 'cdc').click();
  await page.locator('body').press('Escape');
  await expect(page).not.toHaveURL(/sel=/);
});

test('modo aula: trocar 2D e 3D preserva seleção e tipos', async ({ page }) => {
  await page.goto('/#/aula?tipos=processa,executa&sel=cp');
  await expect(page.locator('#aula-foot')).toContainText('recebe 3 · emite 0');
  await page.click('#aula-3d');
  await expect(page).toHaveURL(/m=3d/);
  await expect(page).toHaveURL(/tipos=processa,executa/);
  await expect(page).toHaveURL(/sel=cp/);
  await expect(page.locator('#aula-foot')).toContainText('recebe 3 · emite 0');
  await page.click('#aula-2d');
  await expect(page).not.toHaveURL(/m=3d/);
  await expect(page).toHaveURL(/sel=cp/);
  await expect(aulaNode(page, 'cp')).toBeVisible();
  await page.goto('/#/aula?m=3d&tipos=processa');
  await expect(page.locator('#aula-count')).toContainText('5 de 27');
  await expect(page.locator('#aula-3d')).toHaveAttribute('aria-pressed', 'true');
  await page.click('.aula-brand');
  await expect(page.locator('#tree-container')).toBeVisible();
  await expect(page.locator('#aula')).toBeHidden();
});

test('tela cheia recusada cai na alternativa e Esc sai', async ({ page }) => {
  await page.addInitScript(() => { Element.prototype.requestFullscreen = () => Promise.reject(new Error('negado')); });
  await page.goto('/#/cc');
  await page.locator('body').press('Shift+F');
  await expect(page.locator('#tree-container')).toHaveClass(/pseudo-fullscreen/);
  await expect(page.locator('#ctl-fullscreen')).toContainText('Sair da tela cheia');
  await page.locator('body').press('Escape');
  await expect(page.locator('#tree-container')).not.toHaveClass(/pseudo-fullscreen/);
  await expect(page).toHaveURL(/#\/cc$/); // Esc saiu da tela cheia sem recolher a árvore
  await page.goto('/#/aula');
  await page.click('#aula-fs');
  await expect(page.locator('#aula')).toHaveClass(/pseudo-fullscreen/);
  await page.locator('body').press('Shift+F');
  await expect(page.locator('#aula')).not.toHaveClass(/pseudo-fullscreen/);
});

// ---------- Painel do nó ----------
test('painel lateral em telas largas e folha inferior no celular', async ({ page }) => {
  await page.goto('/#/cc');
  const panel = page.locator('#reading-panel');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  const tree = await page.locator('#tree-container').boundingBox();
  expect(Math.round(box.width)).toBe(460);
  expect(box.x).toBeGreaterThanOrEqual(tree.x + tree.width - 1);
  await expect(page.locator('#panel-toggle')).toBeHidden();
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(page.locator('#panel-toggle')).toBeVisible();
  const before = (await panel.boundingBox()).height;
  await page.click('#panel-toggle');
  await expect(panel).toHaveClass(/expanded/);
  await expect(page.locator('#panel-toggle')).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => (await panel.boundingBox()).height).toBeGreaterThan(Math.max(before, 0.8 * 800));
});

test('abas do painel: relações em dois grupos, URL e teclado', async ({ page }) => {
  await page.goto('/#/cf/titulo-ii/cap-i');
  await expect(page.locator('#tab-sintese')).toHaveAttribute('aria-selected', 'true');
  await page.click('#tab-relacoes');
  await expect(page).toHaveURL(/aba=relacoes/);
  await expect(page.locator('#tabpanel-relacoes')).toBeVisible();
  await expect(page.locator('#tabpanel-relacoes')).toContainText('Recebe · 2');
  await expect(page.locator('#tabpanel-relacoes')).toContainText('Emite · 0');
  await expect(page.locator('#tabpanel-relacoes .rel-card')).toHaveCount(2);
  // setas percorrem as abas sem mexer na árvore
  await page.locator('#tab-relacoes').press('ArrowRight');
  await expect(page.locator('#tab-historico')).toBeFocused();
  await expect(page.locator('#tab-historico')).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/#\/cf\/titulo-ii\/cap-i\?aba=historico$/);
  // a aba escolhida vale para o próximo nó e sobrevive ao recarregar
  await page.reload();
  await expect(page.locator('#tab-historico')).toHaveAttribute('aria-selected', 'true');
  // cartão de relação leva ao outro nó
  await page.click('#tab-relacoes');
  await page.locator('#tabpanel-relacoes .rel-card').first().click();
  await expect(page).toHaveURL(/#\/cpp\/livro-i\/titulo-ix/);
  await expect(page.locator('#tab-relacoes')).toHaveAttribute('aria-selected', 'true');
});

test('histórico: clicar num ano liga a linha do tempo', async ({ page }) => {
  await page.goto('/#/cdc/titulo-i?aba=historico');
  await expect(page.locator('#tabpanel-historico')).toContainText('Lei 14.181/2021');
  await page.locator('#tabpanel-historico .tl-year', { hasText: '2021' }).click();
  await expect(page).toHaveURL(/ano=2021/);
  await expect(page.locator('#tl-year')).toHaveText('2021');
});

test('aba Dados mostra chave, URN e JSON-LD do nó', async ({ page }) => {
  await page.goto('/#/cc?aba=dados');
  await expect(page.locator('#tabpanel-dados')).toContainText('urn:lex:br:federal:lei:2002-01-10;10406');
  await expect(page.locator('#node-jsonld')).toContainText('"@id": "https://luccas-amorim.github.io/ariadne/id/cc"');
  await expect(page.locator('#node-jsonld')).toContainText('"@type": "Legislation"');
  await page.goto('/#/cc/parte-geral/livro-i?aba=dados');
  await expect(page.locator('#node-jsonld')).toContainText('"isPartOf": "https://luccas-amorim.github.io/ariadne/id/cc/parte-geral"');
  await expect(page.locator('#node-jsonld')).not.toContainText('sameAs');
  await expect(page.locator('#tabpanel-dados')).toContainText('o fragmento desta divisão ainda não foi conferido');
});

// ---------- Vista Grafo ----------
test('grafo: diplomas como nós, matriz com 27 relações e coluna CF com 10', async ({ page }) => {
  await page.goto('/#/');
  await page.click('#mode-grafo');
  await expect(page).toHaveURL(/#\/grafo$/);
  await expect(page.locator('#mode-grafo')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#grafo-stage g.g-node')).toHaveCount(12);
  await expect(page.locator('#grafo-aside [data-total]')).toHaveText('27');
  await expect(page.locator('#grafo-aside .mx-sum[data-col="cf"]')).toHaveText('10');
  await expect(page.locator('#filter-count')).toHaveText('12');
  // célula da matriz lista as relações do par
  await page.click('#grafo-aside button[data-pair="cpc,cc"]');
  await expect(page).toHaveURL(/par=cpc,cc/);
  await expect(page.locator('#grafo-aside .rel-card')).toHaveCount(4);
  await expect(page.locator('#grafo-stage path.g-edge.hl')).toHaveCount(1);
});

test('grafo: selecionar destaca as arestas do nó e o filtro por tipo recalcula', async ({ page }) => {
  await page.goto('/#/grafo');
  await page.locator('#grafo-stage g.g-node[data-key="cp"]').click();
  await expect(page).toHaveURL(/sel=cp/);
  await expect(page.locator('#grafo-aside')).toContainText('Recebe 7 · emite 1');
  await expect(page.locator('#grafo-stage path.g-edge.hl')).toHaveCount(6);
  await expect(page.locator('#grafo-stage path.g-edge.dim')).toHaveCount(14);
  await page.locator('#grafo-aside input[data-type="processa"]').uncheck();
  await expect(page).toHaveURL(/tipos=/);
  await expect(page.locator('#grafo-aside [data-total]')).toHaveText('22');
  await page.locator('body').press('Escape');
  await expect(page).not.toHaveURL(/sel=/);
});

test('grafo por divisão e volta à árvore', async ({ page }) => {
  await page.goto('/#/grafo');
  await page.click('#grafo-divisao');
  await expect(page).toHaveURL(/por=divisao/);
  await expect.poll(() => page.locator('#grafo-stage g.g-node').count()).toBeGreaterThan(30);
  await expect(page.locator('#grafo-stage g.g-node[data-key="cpc/parte-especial/livro-i"]')).toHaveCount(1);
  await page.click('#mode-arvore');
  await expect(page.locator('#tree-container')).toBeVisible();
  await expect(page.locator('#grafo')).toBeHidden();
  await expect(nodeByKey(page, 'cf')).toBeVisible();
});

// ---------- Linha do tempo ----------
test('linha do tempo: faixas, diff entre dois anos e genealogia', async ({ page }) => {
  await page.goto('/#/');
  await page.click('#mode-tempo');
  await expect(page).toHaveURL(/#\/tempo/);
  await page.goto('/#/tempo?a=2016&b=2026');
  await expect(page.locator('#tempo-lanes .tl-lane')).toHaveCount(12);
  const added = page.locator('#tempo-aside [data-group="add"]');
  // as inclusões registradas em history entre 2016 e 2026
  await expect(added).toContainText('CLT › Título II-A');
  await expect(added).toContainText('CC › Parte Especial › Livro III › Título XI');
  await expect(added).toContainText('CDC › Título III › Cap. V');
  await expect(added).toContainText('CP › Parte Especial › Título XII');
  await expect(page.locator('#tempo-aside [data-group="chg"]')).toContainText('EC 132/2023');
  await expect(page.locator('#tempo-aside [data-group="rem"]')).toContainText('Lei 8.666');
  await expect(page.locator('#tempo-aside .gen')).toContainText('CPC/1939');
  await expect(page.locator('#tempo-aside .gen')).toContainText('CPC/1973');
  // trocar A atualiza a URL e o diff
  await page.fill('#tempo-a', '2020');
  await page.locator('#tempo-a').press('Enter');
  await expect(page).toHaveURL(/a=2020&b=2026/);
  await expect(added).not.toContainText('CLT › Título II-A');
  // teclado move a borda da janela
  await page.locator('.tl-handle[data-edge="a"]').focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/a=2019&b=2026/);
  await page.click('.tl-lane-label[data-g="cc"]');
  await expect(page).toHaveURL(/g=cc/);
  await expect(page.locator('#tempo-aside .gen')).toContainText('CC/1916');
});

test('clicar numa faixa abre a árvore em foco no ano A, e o foco obedece ao ano', async ({ page }) => {
  await page.goto('/#/tempo?a=2000&b=2026');
  await page.locator('.tl-track[data-doc="cpc"]').click({ position: { x: 20, y: 17 } });
  await expect(page).toHaveURL(/#\/cpc\?foco=cpc&ano=2000/);
  await expect(nodeByKey(page, 'cpc').locator('text.label')).toHaveText('CPC/1973');
  await expect(page.locator('#content-panel h2')).toContainText('Código de Processo Civil');
  await expect(page.locator('#tl-year')).toHaveText('2000');
});

test('reprodução tem velocidade', async ({ page }) => {
  await page.goto('/#/');
  await page.click('#btn-timeline');
  await page.selectOption('#tl-speed', '2');
  await page.reload();
  await page.click('#btn-timeline');
  await expect(page.locator('#tl-speed')).toHaveValue('2');
});

// ---------- Camada de dados ----------
test('arquivos gerados: edges.csv com 27 relações, JSON-LD e Turtle com licença', async ({ page, request }) => {
  const csv = await (await request.get('/data/edges.csv')).text();
  const lines = csv.trim().split('\n');
  expect(lines[0]).toBe('from,to,type,since,until,status,basis');
  expect(lines).toHaveLength(28);
  const ld = await (await request.get('/data/graph.jsonld')).json();
  expect(ld['@context'].concretiza['@id']).toBe('av:concretiza');
  expect(ld['@graph'][0].license).toBe('https://creativecommons.org/licenses/by/4.0/');
  expect(ld['@graph'].find(n => n['@id'].endsWith('/id/cc')).sameAs).toBe('urn:lex:br:federal:lei:2002-01-10;10406');
  const ttl = await (await request.get('/data/graph.ttl')).text();
  expect(ttl).toContain('CC BY 4.0');
  expect(ttl).toContain('av:sucede');
  const all = await (await request.get('/data/all.json')).json();
  expect(Object.keys(all.diplomas)).toHaveLength(12);
  expect(all.relations).toHaveLength(27);
});

test('vista Dados e subgrafo .ttl do painel', async ({ page }) => {
  await page.goto('/#/');
  await page.click('#mode-dados');
  await expect(page).toHaveURL(/#\/dados$/);
  await expect(page.locator('#dados')).toContainText('Baixar o grafo');
  await expect(page.locator('#dados a[href="data/edges.csv"]')).toBeVisible();
  await expect(page.locator('#dados-ttl')).toContainText('av:executa');
  await expect(page.locator('#dados')).toContainText('urn:lex:br:federal:lei:1984-07-11;7210');
  await page.goto('/#/cc?aba=dados');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#tabpanel-dados [data-ttl]').click()
  ]);
  expect(download.suggestedFilename()).toBe('ariadne-cc.ttl');
  const text = require('fs').readFileSync(await download.path(), 'utf8');
  expect(text).toContain('a av:Relacao');
  expect(text).toContain('<https://luccas-amorim.github.io/ariadne/id/cc/parte-especial/livro-ii> av:concretiza');
});

// ---------- Camada de dispositivos (experimental) ----------
test('dispositivos gerados aparecem na aba Dados, com aviso, fora da árvore', async ({ page }) => {
  await page.goto('/#/cc/parte-especial/livro-i/titulo-ix');
  const action = page.getByRole('button', { name: /Ver dispositivos \(47, gerados\)/ });
  await expect(action).toBeVisible();
  await action.click();
  await expect(page.locator('#tab-dados')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#dispositivos .disp-warn')).toContainText('sem revisão humana');
  await expect(page.locator('#dispositivos .disp-item')).toHaveCount(47);
  await expect(page.locator('#disp-cc_art-927')).toContainText('art. 186');
  await page.locator('#disp-cc_art-933 .disp-ref').first().click();
  await expect(page.locator('#disp-cc_art-932_inc-i')).toHaveClass(/flash/);
  // não entra na árvore principal
  await expect(page.locator('#view-main g.node[data-key^="cc/art-"]')).toHaveCount(0);
  await page.goto('/#/cc/parte-geral?aba=dados');
  await expect(page.locator('#dispositivos')).toHaveCount(0);
});
