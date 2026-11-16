# QA TractorBel — Catálogo v1.11.0

Fonte estrutural: HTML da categoria `/pecas-novas?tractorbel_preview=1` e da busca `/buscar?q=lamina&tractorbel_preview=1`, conferidos em 16/11/2026. Ambos usam `#listagemProdutos`, `.listagem-linha`, `.listagem-item`, `.imagem-produto`, `.info-produto`, `.preco-produto`, `.desconto-a-vista` e CTA nativo.

Referência visual: captura aprovada enviada pelo cliente com 5 cards horizontais, fundos claros, preço e Pix, CTA amarelo com corte diagonal.

## Testes locais Chromium

- Categoria e busca simuladas com a estrutura HTML nativa, oito produtos e duas linhas: PASSOU.
- Layout: 1920 px (5 colunas), 1440/1200 (4), 1024/900 (3), 768/390/375 (2), 320 (1): PASSOU.
- Nenhum transbordamento horizontal: PASSOU.
- Valor normal e valor Pix existentes no HTML preservados sem cálculo paralelo: PASSOU.
- CTA usa a URL original de detalhes: PASSOU.
- Paginação preservada: PASSOU.
- Novos cards após inserção dinâmica: PASSOU.
- Zero erros JS durante os testes locais: PASSOU.

## Homologação necessária na loja

Verificar o resultado na sessão com `tractorbel_preview=1`, especialmente temas e scripts de terceiros que alteram cards após o carregamento. Os testes de navegador ocorreram em fixture local com estrutura extraída do HTML público, não em navegador autenticado da loja. A ativação pública segue desligada.