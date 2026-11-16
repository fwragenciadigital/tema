# TractorBel — PDP Premium v1.8.0 — QA

Data: 16/11/2026. Página-alvo: `https://www.lojatractorbel.com.br/lamina-bico-de-pato-especial-ultra-resistente-vermelha--3050-mm?tractorbel_preview=1`.

## Verificação no HTML público da Loja Integrada
- Página utiliza `body.pagina-produto`, `#corpo .secao-principal .produto > .row-fluid > .span6` para galeria e dados de compra.
- Galeria: `#imagemProduto`, `#abreZoom`, `.produto-thumbs .miniaturas`; produto-alvo possui **uma** imagem, portanto a faixa de miniaturas fica oculta nesta PDP, sem imagens demonstrativas.
- Nome e SKU: `.info-principal-produto h1.nome-produto` e `.codigo-produto`.
- Preço normal, preço promocional, Pix, estoque e CTA são *nativos* (`.acoes-produto`), não recriados ou calculados no JS.
- Formas de pagamento: `.parcelas-produto > ul.accordion` com valores por meio de pagamento. Não foram confirmadas regras numéricas de parcelamento: não prometer `Nx sem juros`.
- CEP: formulário nativo `#formCalcularCep` dentro de `.parcelas-produto .cep`; o acordeão de meios de pagamento não o oculta.
- Informações técnicas e descrição: conteúdo original `#descricao` mantido e tipografia melhorada.

## Testes automatizados locais (Chromium)
- Larguras **320, 390, 768, 1024, 1440 e 1920 px** — passaram, sem overflow horizontal na fixture HTML representativa do HTML real.
- Galeria responsiva; duas colunas desktop e coluna única mobile.
- Zoom abre e fecha por botão/Esc; só utiliza URLs de imagem do produto.
- Formas de pagamento expandem/recolhem sem alterar ID original e sem esconder CEP.
- Um único botão nativo de compra; barra mobile encaminha o clique para o mesmo botão.
- Breadcrumbs e imagem do produto continuam no DOM, sem duplicação.

## Restrições e homologação
- O QA automatizado usou fixture baseada no DOM real, não uma sessão autenticada com compra real. Validar na prévia da loja com um item de teste antes de publicar a todos.
- A Loja Integrada controla preço, descontos, PIX, estoque, variações, frete e checkout. Não inventar promoções nem parcelas.
- As miniaturas aparecem quando há mais de uma imagem cadastrada.
- O efeito é habilitado somente no preview `tractorbel_preview=1` ou após `publicarNaLoja:true` explicitamente definido no HTML.
- Links JS/CSS fixos; não trocar os endereços.