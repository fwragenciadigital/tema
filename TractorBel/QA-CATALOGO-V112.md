# TractorBel 2026 — QA Categoria/Busca v1.12.0

**Causa raiz:** na v1.11 a listagem utilizava cinco colunas a partir de 1700 px, apesar da barra lateral de categorias. Os valores tinham `white-space:nowrap !important` e fonte ampla, causando corte de preços.

## Correções

- Desktop a partir de 1200 px: **quatro cards** por linha na listagem, respeitando o espaço ocupado pelos filtros.
- Desktop/tablet 900–1199 px: três cards. 360–899 px: dois cards. Abaixo de 360 px: um card.
- Fonte proporcional, preço sem truncamento, Pix real preservado, título limitado a duas linhas, imagens com `object-fit:contain`, botão diagonal amarelo.
- JS altera apenas a ativação visual e animação do catálogo, mantendo preço, filtros, links e paginação nativos.
- Cache de JS/CSS passa a revalidar os links fixos.

## Resultado dos testes automatizados

Categoria e Busca: ambas testadas em Chromium com DOM representativo da Loja Integrada, viewport 320, 375, 390, 768, 900, 1024, 1200, 1440 e 1920 px (18 cenários). Verificações: número de colunas, ausência de overflow horizontal, ausência de recorte do valor, botões/URLs reais preservados, carregamento de produto inserido dinamicamente, sem erros JS.

**Todos os cenários passaram.**

**Limite do teste:** os cenários são locais e usam uma estrutura de DOM equivalente à capturada da loja e imagens ilustrativas, não uma sessão real autenticada da Loja Integrada. Conferir a página pública em modo de prévia para homologação final.