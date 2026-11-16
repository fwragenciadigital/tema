# TractorBel v1.14 — QA: resumo-produto

## Verificação da fonte
- A Loja Integrada entrega `.acoes-flutuante` no HTML do produto.
- O script antigo `fwrnewnovo1.min.js` transforma o elemento em `#resumo-produto > .conteiner > .produto-flutuante`.
- Os preços, Pix, estoque e link `carrinho/produto/.../adicionar` permanecem nativos.

## Alterações
- Desktop: barra nativa com fundo grafite, detalhe amarelo, imagem/thumb real, título e Pix em destaque.
- A barra é ocultada por transformação total quando scroll <= 500 px e aparece após 500 px.
- Tablet (768-991): versão compacta da mesma barra nativa.
- Mobile (<=767): a barra nativa permanece oculta e o atalho TractorBel usa o mesmo visual.
- Produto sem Pix: preço padrão vira principal.
- Alterações posteriores de imagem são acompanhadas por observador do atributo src/srcset.

## Testes executados
`python tests/qa-sticky-v114.py` — fixture offline simulando inserção tardia de `#resumo-produto`; Chromium headless com larguras 320, 390, 768, 900, 1024 e 1440 px.

Verificado: inserção assíncrona, ausência de erros JS, visibilidade por scroll, preços nativos, imagem e título, href do CTA preservado, coluna mobile e overflow horizontal.

**Pendente para homologação:** teste manual no site real com o script antigo e todos os scripts de terceiros carregados, inclusive carrinho/variações.
