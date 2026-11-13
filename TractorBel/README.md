# TractorBel 2026 · FWR Agência Digital

**Plataforma:** Loja Integrada. **Projeto:** `TractorBel` na Vercel/GitHub. **Versão:** 1.1.0.

## Estrutura
- `tractorbel.js`: adaptação DOM-first da LI (topo, home, rodapé, vitrines com produtos reais e menu).
- `tractorbel.css`: identidade visual preto/amarelo, mobile-first em pontos críticos, layout fluido.
- `assets/`: imagens originais aprovadas convertidas para WebP e com proporção reservada.
- `INTEGRACAO-LOJA-INTEGRADA.html`: settings editáveis e carregamento externo (HTML personalizado).
- `index.html`: página informativa de distribuição, não é uma loja paralela.

## Instalação segura
1. Publique **primeiro a versão de teste** do código de integração no campo HTML do rodapé da Loja Integrada. Se a loja tiver HTML do cabeçalho, recomenda-se colocar o `<link rel="stylesheet">` lá para diminuir FOUC/CLS.
2. Mantenha `geral.publicarNaLoja: false`, de modo que a loja pública não mude.
3. Acesse `https://www.lojatractorbel.com.br/?tractorbel_preview=1`, verificando **home, menu, busca, login, carrinho, footer, vitrines e mobile**.
4. No DevTools, confira `TractorBel2026.diagnostico()` e eventuais avisos.
5. Após homologação, altere `geral.publicarNaLoja: true`. Essa decisão pode ser revertida em segundos.
6. Para desabilitar: `geral.ativo: false` ou remover as duas tags `<link>` e `<script>`.

## Movimentos e transições (v1.1)
- Fade-in progressivo ao rolar a home: títulos, cards, banners internos, vitrines e rodapé.
- Usa `IntersectionObserver` para animar **uma única vez** a entrada na tela, sem loop nem listener de scroll; a hero principal não é animada (preserva LCP).
- Entrada via `opacity` e `transform`, sem ocupar/remover espaço nem alterar layout (CLS).
- Miniaturas carregadas via requisição assíncrona também recebem fade-in.
- Cartões possuem hover discreto (zoom de produto, brilho do CTA e realce), apenas em dispositivos com mouse.
- Suporta `prefers-reduced-motion` e fallback para navegadores sem `IntersectionObserver`: conteúdos ficam visíveis.
- Em `window.TractorBelSettings.movimento`, ajuste: `ativo`, `fadeIn`, `hover`, `duracao` (ms), `distancia` (px) e `intervalo` (ms). Para desligar todo movimento: `movimento: { ativo: false }`.

## Produtos e preços
O JS lê produtos já renderizados pela LI (`#corpo .listagem-item`) e miniaturas na página da categoria via `fetch('/miniaturas')` no mesmo domínio. As informações comerciais não são calculadas, replicadas via API externa nem inventadas. Se a página de miniaturas estiver indisponível ou não expuser preços, aparece um link para a categoria, em vez de uma vitrine com preços simulados. Os botões direcionam à página real do produto, preservando seleções de variação e checkout nativo.

## Atenções antes de publicar
- A página usa **DOM da Loja Integrada**: os seletores de seu tema devem ser verificados no navegador real. Este projeto não acessou o painel administrativo.
- Valide as URLs institucionais (`/pagina/...`) e as redes sociais em `conteudo` no snippet; são opcionais e podem variar por loja.
- A prova de funcionamento em produção exige testes de desktop/mobile e carregamento real do JS/CSS na loja.
- Para migração dos assets para LI, suba `assets/*.webp`, ajuste `imagensBase` no snippet e **três URLs de fundo** em `tractorbel.css`: `fundo-destaques.webp`, `novo-projeto-5.webp`, `novo-projeto-6.webp`. Depois envie `tractorbel.js` e `tractorbel.css` para a mídia da LI e substitua os dois endereços do snippet.
- Recomendamos versionar arquivos no próximo ciclo (`tractorbel.v1.0.1.js/css`) para permitir cache longo e rollback.

## Qualidade
- JavaScript sem dependências, sem CSS global da LI reescrito; navegabilidade via links nativos.
- `loading="lazy"`, dimensões de imagens, layout reservado, preferência por movimento reduzido.
- O design original foi aprovado para desktop; comportamento mobile é interpretação responsiva a homologar.