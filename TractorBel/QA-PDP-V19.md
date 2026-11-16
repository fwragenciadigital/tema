# TractorBel · QA PDP v1.9 · 16/11/2026

## Cobertura (Chromium local, HTML com seletores reais da LI)

- 320, 375, 390, 430, 768, 900, 1024, 1440 e 1920 px: **9/9 aprovados**, sem erro JS nem overflow.
- Pix de R$ 5.820,00 para produto com R$ 6.000,00 normal: destaque e economia de R$ 180,00 confirmados. O valor é lido do HTML, nunca hardcoded.
- Mudança nativa para R$ 5.500,00: atualização do valor principal e economia em tempo de execução.
- Produto sem preço Pix no HTML: display Pix oculto, preço normal preservado.
- 4 painéis (`<details>`) com título e conteúdo extraído do DOM; resumo usa descrição nativa e especificações listadas, quando disponíveis.
- Formulário `#formCalcularCep` original: 1 unidade; link rápido foca o campo real.
- Pagamentos: `#formas-pagamento-lista-398845017` preservado; acionamento automático do disclosure abre o conteúdo real.
- Compra original: 1 botão nativo; atalho mobile aciona o botão, sem requisição própria.
- Galeria: imagem única não cria miniaturas duplicadas; zoom preservado da v1.8.
- A11y: `<details>/<summary>`, botões com type=button, foco para CEP, zoom com escape, `prefers-reduced-motion` respeitado.

## Limites de homologação

Os testes de interação foram realizados com fixture baseada no HTML real examinado, mas sem autenticação no painel e **sem compra final real**. Inspecionar visualmente a prévia na Loja Integrada, incluindo outro produto com variações, antes de tornar público. A lista e número máximo de parcelas sem juros não foram inferidos.

## Capturas

- `tests/pdp-v19-390.png` — mobile 390 px
- `tests/pdp-v19-768.png` — tablet
- `tests/pdp-v19-1440.png` — desktop 1440 px
- `tests/qa-pdp-v19.py` — execução reproduzível dos testes