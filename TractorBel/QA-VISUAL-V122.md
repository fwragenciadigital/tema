# TractorBel — QA de layout v1.22.0 (19/11/2026)

## Implementacao
- JS principal: ASSET_FILES['bg-miniaturas.webp'] agora corresponde ao arquivo fornecido pelo cliente no CDN, trator.jpg.
- CSS principal: fundo institucional e logo atualizados conforme valores fornecidos, com media query separada para mobile <=767px.
- checkout-preview.html: modelo demonstrativo responsivo com identificacao e pagamento à esquerda, resumo dos itens à direita, sem formularios ativos.
- checkout-native.css: CSS visual preparado; **nao instalado** na pagina de checkout da Loja Integrada.

## Smoke tests LOCAIS de layout (fixture ilustrativa)

Validados via Chromium com Playwright em uma fixture local que reproduz a grade e a secao institucional, **nao na pagina da LI nem sobre o arquivo exato servido pela Vercel**:

| Largura | Contexto | Resultado |
| --- | --- | --- |
| 1440px | desktop | PASS — 2 colunas, sem overflow |
| 1366px | desktop | PASS — 2 colunas, sem overflow |
| 1280px | desktop | PASS — 2 colunas, sem overflow |
| 767px | viewport responsivo | PASS — 1 coluna, sem overflow |
| 767px | emulacao mobile, touch, DPR 2 | PASS — 1 coluna, sem overflow |
| 390px | mobile touch DPR 2 | PASS — 1 coluna, sem overflow |

Arquivo local de teste: /mnt/data/tractorbel-qa-layout-local.py (nao versionado).
Script versionado de teste sobre o preview Vercel: tests/qa-checkout-visual-v122.py. Esse segundo teste deve ser executado em um ambiente com acesso de rede ao projeto.

## Validacoes adicionais sobre arquivos GitHub
- Sintaxe do JS principal: PASS.
- Contagem de chaves CSS: PASS.
- Fonte trator.jpg no mapeamento: PASS.
- Proporcao desktop 65%, 26%, 90%, margens e sombra institucional: PASS.
- Controle de largura --tb26-width 1760px: PASS.
- Preview sem formularios de envio: PASS.

## Pendente de homologacao
- Realizar uma compra simulada (sem pagamento) em sessao de navegador autenticada/autorizada com produto no carrinho.
- Inspecionar classes reais do checkout e verificar se ha editor de CSS oficial especifico, bem como validar funcionalidade real de frete, CEP, documento, radio, Pix, cartao, cupom, mensagens de erro, selos, CTA e etapas.
- Validar a loja real nas larguras 1440/1366/1280/767 duplo; os passes locais de fixture NAO substituem essa validacao.
- A rota /checkout nao carrega o JS ou CSS geral injetado em Visual > Incluir Codigo HTML, conforme documentacao oficial. Nao publicar o checkout alternativo como formulario real.
