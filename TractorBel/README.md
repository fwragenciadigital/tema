# TractorBel 2026 · FWR Agência Digital

**Plataforma:** Loja Integrada. **Projeto:** `TractorBel` na Vercel/GitHub. **Versão:** 1.14.0.

## Estrutura
- `tractorbel.js`: adaptação DOM-first da LI (topo, home, rodapé, vitrines com produtos reais, menu e carrinho lateral).
- `tractorbel.css`: identidade visual preto/amarelo, mobile-first em pontos críticos, layout fluido.
- Imagens do layout: mantidas no CDN `https://cdn.awsli.com.br/901/901888/arquivos/`, com nomes e extensões do ZIP original. Os **8 recortes novos das marcas** ficam temporariamente em `/assets/marcas/*.png` na Vercel até serem enviados ao CDN da Loja Integrada.
- `INTEGRACAO-LOJA-INTEGRADA.html`: settings editáveis e carregamento externo (HTML personalizado).
- `index.html`: página informativa de distribuição, não é uma loja paralela.

## Instalação segura
1. Publique **primeiro a versão de teste** do código de integração no campo HTML do rodapé da Loja Integrada. Se a loja tiver HTML do cabeçalho, recomenda-se colocar o `<link rel="stylesheet">` lá para diminuir FOUC/CLS.
2. Mantenha `geral.publicarNaLoja: false`, de modo que a loja pública não mude.
3. Acesse `https://www.lojatractorbel.com.br/?tractorbel_preview=1`, verificando **home, menu, busca, login, carrinho, footer, vitrines e mobile**.
4. No DevTools, confira `TractorBel2026.diagnostico()` e eventuais avisos.
5. Após homologação, altere `geral.publicarNaLoja: true`. Essa decisão pode ser revertida em segundos.
6. Para desabilitar: `geral.ativo: false` ou remover as duas tags `<link>` e `<script>`.

## Atualizações PDP v1.9.0 — Pix prioritário e informação em contexto (16/11/2026)

A página de produto replica a **hierarquia visual** da referência aprovada pelo cliente, com regras comerciais estritamente dependentes do DOM nativo da Loja Integrada.

- **Galeria esquerda:** foto principal real em área grande, zoom acessível, miniaturas apenas se a LI tiver mais de uma imagem.
- **Compra direita:** breadcrumb, H1 e SKU nativos; bloco de **Pix como preço principal** (lido de `.preco-produto .desconto-a-vista strong` somente quando a mensagem menciona Pix); preço usual/antigo subordinados. Não existe desconto fabricado. A economia só é mostrada quando a subtração entre o preço normal e o Pix lidos do DOM é válida e positiva.
- **Interações de preço:** o JS acompanha mudanças no preço/variações nativas; quando não há Pix real, deixa a precificação original normal visível. A barra fixa mobile lê Pix real, se disponível.
- **Compra nativa:** único botão original da plataforma preservado; o atalho mobile busca o botão atual para preservar atualizações de variação. Nenhum fluxo paralelo de estoque, parcelamento, frete ou checkout.
- **Informações rápidas abaixo de Comprar:** envio nacional com cálculo pelo CEP, ambiente de compra seguro e orientação especializada, seguidos por acordeões nativos `<details>` de descrição/especificações, envio, condições de pagamento e contato. O resumo e as características são extraídos **da descrição realmente cadastrada**, não de conteúdo gerado ou texto sem origem.
- **Entrega e frete:** atalho desloca para o formulário oficial `#formCalcularCep`, mantendo os eventos e cálculo real da Loja Integrada. Sem previsão fixa de entrega, frete grátis ou prazo inventado.
- **Pagamento:** atalho expande a relação de meios de pagamento já cadastrada no HTML, preservando o `id` original do acordeão nativo. Não são inventadas parcelas sem juros.
- **Suporte:** contato no WhatsApp da TractorBel publicado no próprio site.
- **Mobile:** galeria em coluna, depois bloco Pix/compra, informações compactas, descrição completa abaixo e botão fixo no rodapé somente quando comprar saiu da área visível.
- **Configuração:** `produto: { ativo:true, compraFixaMobile:true, pixEmDestaque:true, resumoRapido:true }` diretamente no `tractorbel.js` (pode ser sobrescrita por `window.TractorBelSettings`).
- **Fallback:** se o tema mudar e a grade principal não corresponder aos seletores testados, não modifica o layout nativo.

**Qualidade:** testes locais com Chromium em 320, 375, 390, 430, 768, 900, 1024, 1440 e 1920 px; assertivas sobre preços, economia no Pix, tabs, frete, pagamentos, checkout nativo, no-Pix, atualização de preço e ausência de overflow. Ver `QA-PDP-V19.md`. Validação visual de produção deve ser realizada na própria loja com `?tractorbel_preview=1`.

---

## Atualizações v1.7 — Sequência visual aprovada (16/11/2026)
- **Removido `tb26-hero` da home**: a seção e a imagem do banner de 50.000 itens não são mais montadas; o arquivo `fullbanner.jpg` permanece mapeado no CDN para eventual uso futuro, sem carregamento desnecessário.
- **Três componentes independentes:** `.tb26-brands`, `.tb26-benefits` e `.tb26-institutional-banner` são agrupados numa moldura visual `.tb26-intro` com gradiente cinza/preto contínuo; não são fundidos em uma imagem única. Cada componente pode ser ativado/desativado em `defaults.marcas.ativo`, `defaults.beneficios.ativo` e `defaults.institucional.ativo` dentro do `tractorbel.js`.
- **Marcas individuais:** 8 logos visíveis no desktop ≥1200 px (como no layout aprovado), 5 no tablet, **3 por visão e por rolagem no mobile**. Os botões são ocultos automaticamente quando não há mais conteúdo a rolar. Cada marca tem `ativo`, `imagem`, `nome` em `defaults.marcas.itens`.
- **Benefícios individuais:** quatro entradas com ícone vetorial e texto, cada uma com `ativo` e `texto` em `defaults.beneficios.itens` (sem criar blocos vazios quando ocultos).
- **Card institucional:** `vendedores.jpg` é uma imagem de fundo SEM texto; o conteúdo agora é HTML real e acessível sobreposto, com título amarelo e parágrafo branco, conforme arte aprovada. Personalize em `defaults.institucional` os campos `titulo`, `textoAntes`, `destaque` e `textoDepois`. Nenhuma edição da imagem é necessária.
- **Responsividade:** banner institucional mantém texto e foto legíveis em 320/390 px, com sobreposição escura mobile; correção específica de aspect-ratio no tablet para evitar overflow horizontal. Mantém o fade-in e o respeito a movimento reduzido.
- **Mesmo JS/CSS:** a Vercel continua servindo `tractorbel.js` e `tractorbel.css` nas URLs anteriores. Testar em `?tractorbel_preview=1`; produção só com `geral.publicarNaLoja=true`.

## Atualizações v1.6 — Marcas individuais + topo limpo (16/11/2026)
- O header customizado utiliza `#cabecalho .logo img` diretamente do painel Loja Integrada, com link e texto alternativo do logo original; se a imagem falhar, exibe texto em vez de uma figura quebrada.
- Ao ativar o header customizado, oculta **somente** a antiga faixa `#bar-top`, a barra `.barra-inicial`, o placeholder de carregamento `#full-page-loading` e o cabeçalho nativo. Com `geral.publicarNaLoja=false` a loja pública permanece intocada.
- No lugar da imagem horizontal de marcas foram inseridos **8 PNGs transparentes individuais**, recortados sem alterar os logos CAT, SANY, XCMG, Komatsu, Volvo, CASE, Randon e John Deere.
- Carousel responsivo: 6 marcas visíveis no desktop, 5 no tablet, 3 no mobile. As setas movem conjuntos de três no mobile; a rolagem touch usa `scroll-snap` de três em três. `prefers-reduced-motion` é respeitado.
- No momento, os recortes novos estão hospedados em `https://tractorbel-2026.vercel.app/assets/marcas/`. Para migrá-los à Loja Integrada, envie os 8 PNGs para o CDN e atualize **somente** `defaults.marcas.imagensBase` em `tractorbel.js`; não será necessário criar outra estrutura de carrossel.
- Exibe nomes das marcas como texto de segurança se uma imagem não carregar; não inventa links de categorias de marca inexistentes no painel.
- `tractorbel.js` e `tractorbel.css` permanecem com os mesmos endereços fixos da Vercel. O HTML de integração não precisa ser editado para aplicar a versão.

## Movimentos e transições (v1.2)
- Fade-in progressivo ao rolar a home: títulos, cards, banners internos, vitrines e rodapé.
- Usa `IntersectionObserver` para animar **uma única vez** a entrada na tela, sem loop nem listener de scroll; a hero principal não é animada (preserva LCP).
- Entrada via `opacity` e `transform`, sem ocupar/remover espaço nem alterar layout (CLS).
- Miniaturas carregadas via requisição assíncrona também recebem fade-in.
- Cartões possuem hover discreto (zoom de produto, brilho do CTA e realce), apenas em dispositivos com mouse.
- Suporta `prefers-reduced-motion` e fallback para navegadores sem `IntersectionObserver`: conteúdos ficam visíveis.
- As configurações padrão de `movimento` já estão em `tractorbel.js`, incluindo `ativo`, `fadeIn`, `hover`, `duracao` (ms), `distancia` (px) e `intervalo` (ms). Não é necessário colar as configurações no HTML. Ajustes podem ser feitos direto no JS. A configuração legada via `window.TractorBelSettings` continua aceita se necessário.

## Correções de experiência v1.4 (13/11/2026)
- **Header sticky:** `position:sticky; top:0`; soma sombra após iniciar o scroll, sem alterar altura ou provocar deslocamento (CLS). `overflow-x:clip` evita quebrar sticky no `body`.
- **Subcategorias 100% do painel:** árvore lida de `#cabecalho .menu.superior ul.nivel-um > li`, com níveis 2 e 3, mantendo os links registrados na Loja Integrada. Mega menu com rolagem no desktop; submenu expansível no mobile; teclado e Escape.
- **Carrinho:** leitura priorizada de `.carrino-total strong` (grafia real no tema LI), depois demais seletores; subtotal calculado apenas quando todas as linhas têm preço e quantidade reais, marcado como *estimado*. O subtotal fica fixo junto do CTA do drawer.
- **Parcelamento:** procura expressões explícitas da LI no minicarrinho ou no resumo do pedido. Nunca deduz número de parcelas a partir de mensagens publicitárias. Quando uma regra *sem juros* tiver sido validada no painel, pode-se informar o limite em `carrinho.parcelamento` para calcular o valor correto; sem regra conhecida, exibe instrução para consultar condições no carrinho nativo.
- **Fidelidade visual:** benefícios usam SVGs equivalentes aos ícones de entrega, cartão, desconto e compra segura. Rodapé lê selos, bandeiras e redes sociais diretamente do HTML nativo quando presentes.
- **Vitrine Peças Mais Vendidas:** somente usa esse nome se existir a seção nativa correspondente. Sem fonte real, apresenta `PEÇAS EM DESTAQUE` (não atribui falsamente popularidade a lançamentos).
- **Performance:** categoria Miniaturas consultada apenas quando o módulo estiver próximo do viewport, evitando pageviews adicionais desnecessárias no carregamento inicial.

### Configuração *opcional* de parcelamento
A loja atualmente divulga parcelamento, mas o HTML público consultado **não expôs o número máximo de parcelas e os juros aplicáveis ao total do carrinho**. Para exibir um valor calculado em todos os casos, após verificar no painel Pagali/intermediador a condição vigente, altere **diretamente no JS**:

```javascript
carrinho: {
  ativo: true,
  parcelamento: {
    maximo: null,       // substituir pelo limite confirmado (ex.: 3/6/10 somente se for REAL)
    semJuros: null,     // informar true apenas se for sem juros na quantidade acima
    minimoParcela: null // informar valor mínimo por parcela, se a loja exigir
  }
}
```

Enquanto estiver `null`, o drawer só mostra número e valor de parcelas quando a loja disponibiliza os dados no seu próprio HTML; caso contrário, mostra `Confira as opções de parcelamento no carrinho` sem prometer valores falsos.

## Carrinho lateral (v1.4)
- Clique em `tb26-icon tb26-cart` abre um painel à direita com identidade TractorBel.
- Utiliza primeiro os dados do minicarrinho **nativo** (`.carrinho-interno-ajax` e `.carrinho-interno`); conserva os nós nativos e seus eventos, sem criar pedido ou precificar produtos.
- Se o carrinho nativo indicar itens mas não fornecer linhas, faz uma consulta sob demanda **somente ao abrir** a página oficial `/carrinho/index` para tentar recuperar os dados. A LI alerta que esse tipo de requisição pode contabilizar uma visualização extra. Não consulta automaticamente no carregamento.
- Nunca exibe placeholders de preço ou fabrica total. Se as linhas não puderem ser recuperadas, oferece botão seguro para abrir o carrinho oficial.
- Carrega nome, imagem, quantidade e preço da origem real, com total priorizado da Loja Integrada (ou estimado com preço unitário e quantidade realmente presentes). Frete e cupons permanecem no fluxo oficial.
- O botão conduz à rota nativa do carrinho. O drawer não altera itens, quantidades, pagamentos, cupons ou checkout.
- `MutationObserver` observa as atualizações da miniárea nativa, para atualizar a badge/itens enquanto aberto. Fechamento via clique fora, botão × ou Escape; foco e scroll são restaurados; possui suporte mobile e redução de movimento.
- Padrão ativo em `defaults.carrinho.ativo`, dentro do JS; desative em `window.TractorBelSettings.carrinho.ativo=false` se precisar.

## Produtos e preços
O JS lê produtos já renderizados pela LI (`#corpo .listagem-item`) e miniaturas na página da categoria via `fetch('/miniaturas')` no mesmo domínio. As informações comerciais não são calculadas, replicadas via API externa nem inventadas. Se a página de miniaturas estiver indisponível ou não expuser preços, aparece um link para a categoria, em vez de uma vitrine com preços simulados. Os botões direcionam à página real do produto, preservando seleções de variação e checkout nativo.

## Atenções antes de publicar
- A página usa **DOM da Loja Integrada**: os seletores de seu tema devem ser verificados no navegador real. Este projeto não acessou o painel administrativo.
- Valide as URLs institucionais (`/pagina/...`) e as redes sociais em `conteudo` no snippet; são opcionais e podem variar por loja.
- A prova de funcionamento em produção exige testes de desktop/mobile e carregamento real do JS/CSS na loja.
- **Imagens já na Loja Integrada:** o JS contém a constante `ASSET_CDN_BASE` e `ASSET_FILES` com todos os 20 nomes originais (`.png`/`.jpg`). O HTML antigo com `imagensBase` da Vercel é ignorado a favor do CDN oficial. Para corrigir algum nome renomeado pelo painel, edite o mapeamento no JS. Os três fundos antes fixos no CSS também usam o CDN oficial por variáveis configuradas pelo JS. Depois da homologação, basta hospedar os arquivos JS/CSS na própria Loja Integrada e alterar os dois links de carregamento.
- Os arquivos permanecem com nomes e URLs **fixos** `tractorbel.js` e `tractorbel.css`, conforme acordado. O CDN permite revalidação periódica (cache de 300 segundos); em atualizações, aguarde a expiração do cache quando necessário.

## Qualidade
- JavaScript sem dependências, sem CSS global da LI reescrito; navegabilidade via links nativos.
- `loading="lazy"`, dimensões de imagens, layout reservado, preferência por movimento reduzido.
- O design original foi aprovado para desktop; comportamento mobile é interpretação responsiva a homologar.

## Mapeamento de imagens da Loja Integrada
O projeto usa o prefixo `https://cdn.awsli.com.br/901/901888/arquivos/`. Os nomes padrão foram deduzidos do ZIP original; a URL `vendedores.jpg` foi a única confirmada pelo cliente. Se o painel tiver renomeado um arquivo, corrija somente o valor correspondente de `ASSET_FILES` no JS. Para os três arquivos `Novo Projeto (...)`, o JS testa também os aliases normalizados.

## PDP Premium — v1.8.0 (16/11/2026)

Foi adicionado o módulo `mountProductPage()` no `tractorbel.js`, habilitado por `produto: { ativo: true, compraFixaMobile: true }` no objeto `defaults`. Ele funciona nas páginas com `body.pagina-produto` e somente quando a prévia/ativação geral autoriza, sem afetar a home.

- Visual: duas colunas no desktop, imagem ampliada com zoom e miniaturas quando existirem, breadcrumbs no topo, H1/SKU, preço real, Pix, disponibilidade, CTA e área de descrição.
- Funcionalidade: carrinho, preço, Pix, estoque, formas de pagamento, frete e variações permanecem nativos. A barra fixa de compra no celular aciona o mesmo botão da Loja Integrada; não há requisição ou checkout paralelo.
- Performance: estilos escopados em `.tb26-with-pdp`, nenhum layout shift introduzido por blocos fabricados, nenhuma imagem externa inventada; fundos da home não são carregados em PDP.
- Ao haver somente uma foto do produto, nenhum carrossel de miniaturas falso é criado.
- Formas de pagamento dobráveis utilizam a lista original `.parcelas-produto > ul.accordion`; o CEP nativo permanece disponível.
- Para desligar o módulo no código: `produto: { ativo: false }` ou sobrescrever `window.TractorBelSettings.produto.ativo = false` **antes** do script carregar.
- **Não** foi configurado número de parcelas sem juros, pois a página consultada só apresenta valores por método de pagamento.

Veja `QA-PDP-V18.md` e `tests/qa-pdp-v18.py`. Homologar com o carrinho e a validação real da Loja Integrada antes da liberação geral.


## v1.10.0 — Informações importantes responsivas

- Desktop/tablet (a partir de 768 px): o bloco **Informações importantes** aparece na coluna da galeria, imediatamente abaixo das miniaturas (ou da foto principal quando o produto tem uma imagem só).
- Mobile (até 767 px): o **mesmo bloco**, sem duplicação, permanece abaixo do botão Comprar e antes dos acordéons de descrição/envio/pagamento/atendimento.
- Reposicionamento automático em mudanças de orientação ou redimensionamento usando `matchMedia`.
- Sem mudanças no Pix, frete, parcelamento, checkout ou demais componentes da PDP.
- JS/CSS continuam em `https://tractorbel-2026.vercel.app/tractorbel.js` e `.../tractorbel.css` (sem sufixos de versão nos links).

## v1.11.0 — Cards de categoria e busca (16/11/2026)

- O JavaScript monta somente um aprimoramento visual do `#listagemProdutos` nativo da Loja Integrada para `body.pagina-categoria`, `body.pagina-busca`, `body.pagina-marca` e `body.pagina-tag`. Não altera a página do produto, homepage ou checkout.
- Mantém imagens, nomes, preço, Pix, link de produto, paginação, filtros e ordenação nativos. Quando a ação original abre o produto, o botão apresenta **VER PRODUTO**; se a ação original for compra direta, apresenta **COMPRAR**. Não são criados descontos nem valores fictícios.
- Cards brancos, imagem proporcional, título com duas linhas, preços alinhados, tarja amarela com corte diagonal, borda diagonal inferior e animações leves com preferência de movimento reduzido respeitada.
- Grade responsiva: 5 por linha (>= 1700 px), 4 (1200–1699), 3 (900–1199), 2 (360–899) e 1 (< 360 px). Limite de colunas determinado pelo CSS, sem substituição do HTML gerado pela plataforma.
- Renderização dinâmica observada via `MutationObserver` somente dentro da vitrine nativa; novos cards obtêm automaticamente o tratamento visual.
- Configuração opcional no JS: `catalogo: { ativo: true, animacao: true }`.
- Código publicado **nos mesmos endereços** `tractorbel.js` e `tractorbel.css`; cache gerenciado pelo servidor. Ativação geral da loja permanece sob `geral.publicarNaLoja`.
- QA com Chromium: páginas `pagina-categoria` e `pagina-busca`, larguras 320, 375, 390, 768, 900, 1024, 1200, 1440 e 1920 px; preços/PIX/links, paginação, atualizações dinâmicas e ausência de overflow.


## Atualização v1.12.0 — Categoria e busca: 4 cards por linha (16/11/2026)

- **Correção estrutural:** substituição da regra que forçava cinco colunas no catálogo. Agora são quatro por linha a partir de 1200 px de viewport (com a coluna de categorias/filtros preservada), três entre 900 e 1199 px, duas entre 360 e 899 px e uma abaixo de 360 px.
- **Correção dos preços cortados:** removido o `white-space:nowrap` forçado; fontes redimensionadas e preservados os valores nativos de preço, desconto e Pix. Nenhum cálculo ou preço é criado no JS.
- **Visual revisado:** imagem `object-fit:contain`, área de imagem ligeiramente mais horizontal, títulos limitados a duas linhas, espaçamento e alinhamento de preços, CTA amarelo com corte diagonal e cartões com altura consistente.
- **Comportamento nativo preservado:** ordenação, categorias, filtros, paginação, URL original do produto e carregamento dinâmico. CSS estritamente escopado a `.tb26-with-catalog #listagemProdutos.tb26-catalog`, sem alterar a home/PDP.
- **Links fixos com revalidação:** JS e CSS na Vercel continuam nos mesmos URLs; `Cache-Control: public,max-age=0,must-revalidate` evita retenção prolongada de versões antigas. Imagens usam cache imutável.
- **QA:** teste automatizado em páginas de categoria e busca, incluindo resoluções 320, 375, 390, 768, 900, 1024, 1200, 1440, 1920 px. Teste local com DOM simulado da LI, homologação visual na loja real ainda recomendada.


## Versao 1.13 — Cards iguais a vitrine
- Grid de quatro cards no desktop com barra lateral; 3 tablet, 2 mobile e 1 ate 359px.
- Fundo da foto neutro, titulo limitado a duas linhas, preco e Pix alinhados e CTA amarelo com diagonal.
- Os elementos de favorito, selo e botoes redundantes sao ocultados sem remover dados/funcionalidades do DOM da Loja Integrada.
- JS e CSS continuam no mesmo endereco Vercel e o modo preview continua inalterado.


## v1.14 — Barra `#resumo-produto` redesenhada

- Reaproveita a barra nativa `#resumo-produto` criada pelo script antigo da loja (`fwrnewnovo1.min.js`). Não cria preço ou checkout paralelo.
- Identidade premium preta/amarela: miniatura real, título do produto, Pix real mais evidente, preço normal subordinado e botão nativo COMPRAR.
- Ativa apenas em páginas de produto com o preview TractorBel ou liberação geral; o JS aguarda a inserção tardia de `#resumo-produto` por `MutationObserver`.
- O cabeçalho e o menu não são afetados; a barra aparece ao rolar mais de 500 px, sem ficar parcialmente visível quando escondida.
- Mobile/tablet mantém o botão fixo próprio da PDP, agora com a mesma linguagem visual e preço Pix real.
- A imagem da barra segue a imagem principal quando a variação troca de `src`/`srcset`. A compra é feita exclusivamente pelo link nativo já cadastrado.

## v1.15 — Carrinho responsivo da Loja Integrada

Nova camada visual exclusiva para `.pagina-carrinho` baseada na estrutura nativa da loja. Preserva formulário de checkout, quantidades, remoção de itens, frete, cupons, preços, desconto Pix e avisos comerciais. O bloco lateral exibe valores **copiados** do DOM da Loja Integrada. Estilos em `tractorbel.css`; inicialização em `mountCartPage()` no `tractorbel.js`. Configuração: `paginaCarrinho: { ativo: true }`. Sem mudanças nos links da Vercel. QA: `QA-CARRINHO-V115.md`.
