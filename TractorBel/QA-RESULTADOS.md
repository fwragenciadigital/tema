# TractorBel 2026 v1.7 — Verificações locais

- Testado em Chromium headless nas larguras **320, 375, 390, 767, 768, 900, 1200, 1440 e 1920 px**.
- Nenhum elemento `.tb26-hero` é montado.
- A sequência exibe, quando ativos: `.tb26-brands`, `.tb26-benefits` (4 itens) e `.tb26-institutional-banner`.
- Os 8 logos aparecem na faixa de marcas: 3 visíveis no mobile, 5 no tablet e 8 no desktop.
- A imagem de fundo institucional abre com largura natural 1719 px; o título e o parágrafo são elementos HTML visíveis.
- Os textos ficam contidos no card e a seção introdutória não cria overflow horizontal nos tamanhos testados.
- As opções de controle de visibilidade e texto foram testadas com configurações personalizadas.

**Limite de validação:** estes são testes locais com a imagem original e uma estrutura simulada do HTML da Loja Integrada, não um teste de compra/checkout no navegador de um cliente. O domínio público segue protegido pela flag `geral.publicarNaLoja`.