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
  await expect(page.locator('ul.relations')).toContainText('processa');
});

test('relações têm direção: setas chegam ao CP e saem dele para a CLT', async ({ page }) => {
  await page.goto('/#/cp');
  await expect(page.locator('#view-main path.relation[marker-end]')).toHaveCount(8);
  await expect(page.locator('#view-main path.relation.in')).toHaveCount(7);
  await expect(page.locator('#view-main path.relation.out')).toHaveCount(1);
  await expect(page.locator('ul.relations')).toContainText('fundamento: arts. 337-E a 337-P do CP');
});

test('relação some antes da vigência dos dois nós', async ({ page }) => {
  await page.goto('/#/cf/titulo-iii/cap-vii');
  await expect(page.locator('#view-main path.relation')).toHaveCount(2);
  await page.goto('/#/cf/titulo-iii/cap-vii?ano=1990');
  await expect(page.locator('#tl-year')).toHaveText('1990');
  await expect(page.locator('#view-main path.relation')).toHaveCount(0);
  await expect(page.locator('ul.relations')).toHaveCount(0);
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
  await page.getByRole('link', { name: 'Marcar estudado' }).click();
  await expect(page.getByRole('link', { name: '✓ Estudado' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: '✓ Estudado' })).toBeVisible();
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
