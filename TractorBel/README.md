# TractorBel 2026 · FWR Agência Digital

**Plataforma:** Loja Integrada. **Projeto:** `TractorBel` na Vercel/GitHub. **Versão:** 1.2.0.

## Estrutura
- `tractorbel.js`: adaptação DOM-first da LI (topo, home, rodapé, vitrines com produtos reais e menu).
- `tractorbel.css`: identidade visual preto/amarelo, mobile-first em pontos críticos, layout fluido.
- Imagens: carregadas diretamente de `https://cdn.awsli.com.br/901/901888/arquivos/`, com nomes e extensões do ZIP original. Não dependem mais da Vercel.
- `INTEGRACAO-LOJA-INTEGRADA.html`: settings editáveis e carregamento externo (HTML personalizado).
- `index.html`: página informativa de distribuição, não é uma loja paralela.

## Instalação segura
1. Publique **primeiro a versão de teste** do código de integração no campo HTML do rodapé da Loja Integrada. Se a loja tiver HTML do cabeçalho, recomenda-se colocar o `<link rel="stylesheet">` lá para diminuir FOUC/CLS.
2. Mantenha `geral.publicarNaLoja: false`, de modo que a loja pública não mude.
3. Acesse `https://www.lojatractorbel.com.br/?tractorbel_preview=1`, verificando **home, menu, busca, login, carrinho, footer, vitrines e mobile**.
4. No DevTools, confira `TractorBel2026.diagnostico()` e eventuais avisos.
5. Após homologação, altere `geral.publicarNaLoja: true`. Essa decisão pode ser revertida em segundos.
6. Para desabilitar: `geral.ativo: false` ou remover as duas tags `<link>` e `<script>`.

## Movimentos e transições (v1.2)
- Fade-in progressivo ao rolar a home: títulos, cards, banners internos, vitrines e rodapé.
- Usa `IntersectionObserver` para animar **uma única vez** a entrada na tela, sem loop nem listener de scroll; a hero principal não é animada (preserva LCP).
- Entrada via `opacity` e `transform`, sem ocupar/remover espaço nem alterar layout (CLS).
- Miniaturas carregadas via requisição assíncrona também recebem fade-in.
- Cartões possuem hover discreto (zoom de produto, brilho do CTA e realce), apenas em dispositivos com mouse.
- Suporta `prefers-reduced-motion` e fallback para navegadores sem `IntersectionObserver`: conteúdos ficam visíveis.
- As configurações padrão de `movimento` já estão em `tractorbel.js`, incluindo `ativo`, `fadeIn`, `hover`, `duracao` (ms), `distancia` (px) e `intervalo` (ms). Não é necessário colar as configurações no HTML. Ajustes podem ser feitos direto no JS. A configuração legada via `window.TractorBelSettings` continua aceita se necessário.

## Produtos e preços
O JS lê produtos já renderizados pela LI (`#corpo .listagem-item`) e miniaturas na página da categoria via `fetch('/miniaturas')` no mesmo domínio. As informações comerciais não são calculadas, replicadas via API externa nem inventadas. Se a página de miniaturas estiver indisponível ou não expuser preços, aparece um link para a categoria, em vez de uma vitrine com preços simulados. Os botões direcionam à página real do produto, preservando seleções de variação e checkout nativo.

## Atenções antes de publicar
- A página usa **DOM da Loja Integrada**: os seletores de seu tema devem ser verificados no navegador real. Este projeto não acessou o painel administrativo.
- Valide as URLs institucionais (`/pagina/...`) e as redes sociais em `conteudo` no snippet; são opcionais e podem variar por loja.
- A prova de funcionamento em produção exige testes de desktop/mobile e carregamento real do JS/CSS na loja.
- **Imagens já na Loja Integrada:** o JS contém a constante `ASSET_CDN_BASE` e `ASSET_FILES` com todos os 20 nomes originais (`.png`/`.jpg`). O HTML antigo com `imagensBase` da Vercel é ignorado a favor do CDN oficial. Para corrigir algum nome renomeado pelo painel, edite o mapeamento no JS. Os três fundos antes fixos no CSS também usam o CDN oficial por variáveis configuradas pelo JS. Depois da homologação, basta hospedar os arquivos JS/CSS na própria Loja Integrada e alterar os dois links de carregamento.
- Recomendamos versionar arquivos no próximo ciclo (`tractorbel.v1.0.1.js/css`) para permitir cache longo e rollback.

## Qualidade
- JavaScript sem dependências, sem CSS global da LI reescrito; navegabilidade via links nativos.
- `loading="lazy"`, dimensões de imagens, layout reservado, preferência por movimento reduzido.
- O design original foi aprovado para desktop; comportamento mobile é interpretação responsiva a homologar.

## Mapeamento de imagens da Loja Integrada
O projeto usa o prefixo `https://cdn.awsli.com.br/901/901888/arquivos/`. Os nomes padrão foram deduzidos do ZIP original; a URL `vendedores.jpg` foi a única confirmada pelo cliente. Se o painel tiver renomeado um arquivo, corrija somente o valor correspondente de `ASSET_FILES` no JS. Para os três arquivos `Novo Projeto (...)`, o JS testa também os aliases normalizados.