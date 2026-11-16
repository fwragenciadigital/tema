# TractorBel — QA v1.13 (cards de categoria e busca)

## Escopo
- 4 produtos por linha no desktop com sidebar; 3 em tablet; 2 no mobile; 1 abaixo de 360px.
- Vitrine fiel à referência: imagem dominante, título de duas linhas, preço e Pix alinhados, CTA amarelo no rodapé, canto chanfrado.
- Selos marrons, ações redundantes, favoritos e overlays de terceiros ocultados visualmente em cards personalizados, sem remover dados ou handlers nativos da LI.
- Preços, promoções, links, checkout, filtro, ordenação e paginação são mantidos pela plataforma.

## Testes automatizados realizados
- Chromium local, páginas simuladas de categoria e busca (não são o tema público ao vivo).
- Resoluções 1920, 1440, 1200, 1024, 900, 768, 390, 375 e 320px, duas páginas, 18 verificações de viewport.
- Validação de quantidades de colunas, ausência de scroll horizontal, preço totalmente dentro do card, link do produto preservado, CTA visível e abaixo do preço, selo, coração e ação nativa conflitantes ocultos, item novo inserido dinamicamente, ausência de erros JavaScript.
- Capturas: `tests/catalogo-v113-1440.png`, `tests/catalogo-v113-390.png`, `tests/catalogo-v113-1920.png`, `tests/catalogo-v113-320.png`.

## Pendente de homologação
- Conferir a página real em modo preview com extensões e estilos nativos ativos, especialmente em cards com variantes, sem preço e promoções excepcionais.
- Nenhum arquivo do HTML da Loja Integrada precisa ser alterado: o JS e CSS usam as mesmas URLs da Vercel.