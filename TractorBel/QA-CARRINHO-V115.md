# TractorBel v1.15 — Carrinho Loja Integrada

## Origem dos dados

Página pública inspecionada em 17/11/2026: `/carrinho/index?tractorbel_preview=1`.
A inspeção foi realizada em sessão HTTP de teste, com carrinho vazio e com um item.
Estrutura identificada: `#corpo .finalizar-compra`, `table.tabela-carrinho`, `tr[data-produto-id]`, `.quantidade`, `form#formCalcularFrete`, `#usarCupom`, `.valor-subtotal`, `.valor-total`, `.valores-descontos .descontos.avista`, `form[action*="/checkout/redirect/"]`.

## Implementação

- Desktop: 2 colunas, lista de produtos/frete/cupom e resumo fixável.
- Mobile/tablet: 1 coluna, cartões e controles acessíveis.
- Total e Pix são apenas **espelhados dos valores nativos**, sem precificação própria.
- Original `form[action*="/checkout/redirect/"]` preservado; nenhum checkout duplicado.
- Funções nativas preservadas: atualizar quantidade, aumentar/diminuir, remover, calcular frete, cupom, continuar comprando, checkout, avisos de valor mínimo.
- Carrinho vazio com apresentação simplificada.
- Tema customizado montado apenas quando `tractorbel_preview=1` ou `publicarNaLoja=true`.

## QA (fixture DOM local, não homologação em sessão real)

- `node --check` do JavaScript passou.
- Playwright/Chromium: 320, 360, 390, 430, 768, 900, 1024, 1440, 1920 px, sem overflow horizontal.
- Carrinho vazio testado em 320, 390, 768, 1440 px.
- Ações originais conferidas nos mesmos nós DOM: checkout, frete, cupom, quantidade +, excluir.
- Mudança de total e Pix refletida no resumo via MutationObserver.
- Falta homologar no tema ativo com login, múltiplos itens, variações, cálculo de frete real, cupons aplicados e finalização até a etapa permitida.
