# Árvores Jurídicas BR 🌳⚖️

Uma iniciativa com o objetivo de descomplicar e facilitar a visualização da estrutura dos grandes diplomas legais do Brasil.

Visualização interativa e hierárquica da legislação brasileira em formato de árvore. Navegue pela macroestrutura dos principais Códigos do Brasil (Civil, Processo Civil, Penal, Processo Penal) e da Constituição Federal de forma visual, intuitiva e fluida.

## 📌 Sobre o Projeto

Este projeto nasceu com o objetivo de facilitar o mapeamento mental e a compreensão da vasta e complexa estrutura das leis brasileiras. Utilizando a biblioteca D3.js, transformamos textos densos e lineares em uma árvore expansível, permitindo que o usuário compreenda exatamente onde um determinado Título, Capítulo ou Artigo se encontra dentro do "todo" da lei.

### Códigos Disponíveis:
- [x] Constituição da República Federativa do Brasil de 1988
- [x] Código Civil (Lei nº 10.406/2002)
- [x] Código de Processo Civil (Lei nº 13.105/2015)
- [x] Código Penal (Decreto-Lei nº 2.848/1940)
- [x] Código de Processo Penal (Decreto-Lei nº 3.689/1941)

## 🚀 Como Usar

A aplicação roda 100% no navegador (Client-side), sem necessidade de banco de dados ou backend complexo em sua versão inicial.

**Acesse a página do projeto via GitHub Pages:** [Árvores Jurídicas BR](https://luccas-amorim.github.io/lex-tree-br/)

* **Navegação:** Utilize o mouse para arrastar *(pan)* a visualização.
* **Zoom:** Utilize o scroll do mouse ou o gesto de pinça no trackpad para dar zoom.
* **Interação:** Clique nos nós (retângulos) para expandir ou recolher Livros, Títulos e Capítulos.
* **Leitura:** Leia o conteúdo correspondente ao nó selecionado no painel inferior da tela.

## 🛤️ Próximos Passos (Roadmap)

Vislumbramos um grande potencial de evolução e escala para este projeto. Algumas das melhorias de alto nível planejadas incluem:

* **Integração Dinâmica via API:** Implementação de atualização em tempo real consumindo dados oficiais (como a API de Dados Abertos da Câmara/Senado/Planalto) para manter as redações sempre vigentes.
* **Novos Diplomas:** Adição de outros grandes códigos e consolidações (CLT, CTN, CDC, ECA, etc.).
* **Relações Inter-normativas:** Implementação de links visuais e indicações de relação entre títulos/códigos de um diploma com outro (ex: visualização rápida de como um instituto de direito material do Código Civil é processado no CPC).
* **Mecanismo de Busca:** Ferramenta de pesquisa para localizar institutos específicos instantaneamente, expandindo a árvore de forma autônoma até o resultado.

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3 / JavaScript** (Vanilla)
* **Tailwind CSS** - Para estilização da interface e tipografia.
* **D3.js (Data-Driven Documents)** - Para a renderização matemática e animada do SVG da árvore.

## 🤝 Como Contribuir

Contribuições são muito bem-vindas, especialmente para ajudar a mapear as estruturas de novos códigos ou implementar os próximos passos do roadmap!

1. Faça um Fork do projeto
2. Crie uma branch para a sua feature:
   ```bash
   git checkout -b feature/MapeamentoNovoCodigo
   ```
   
3. Faça o commit das suas alterações:
   ```bash
   git commit -m 'Adiciona estrutura do Código X'
   ```

4. Faça o push para a branch:
   ```bash
   git push origin feature/MapeamentoNovoCodigo
   ```

## 🙏 Créditos e Inspiração

A idealização e a interface gráfica deste projeto foram fortemente inspiradas na excelente [Tractatus' Tree](https://pbellon.github.io/tractatus-tree/#/), criada por pbellon. Fica aqui o nosso agradecimento especial ao autor pela brilhante ideia de usar árvores interativas para explorar a fundo textos complexos.

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` no repositório para obter mais detalhes.
