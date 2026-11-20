# TractorBel — Implementacao de checkout (17/11/2026)

Status: camada CSS conservadora desenvolvida no GitHub e distribuida via Vercel. Nao aplicada ao checkout publico. A rota de checkout nao e atendida pelo CSS e JS da home.

## Arquivos
- checkout-preview.html: conceito responsivo nao transacional conforme referencia aprovada.
- checkout-native.css: estilo seguro e escopado para o checkout, a ajustar SOMENTE depois de verificar a estrutura de HTML nativa e o editor de CSS especifico para checkout.

## Restricoes oficiais (atualizadas em 2026)
- O recurso Incluir codigo HTML permite paginas da loja, exceto checkout e confirmacao. Codigo HTML/CSS/JS por esse recurso nao opera no checkout.
- No novo tema padrao, ha CSS Avancado proprio para Checkout, Minha Conta e Login; o suporte desse editor no tema instalado pela TractorBel nao foi verificado.
- Desde 01/10/2026, o GTM no checkout e isolado do DOM. Nao usar GTM para injetar layout.
- Fontes: https://ajuda.lojaintegrada.com.br/pt-BR/articles/911875-como-inserir-um-codigo-html-e-javascript
- https://ajuda.lojaintegrada.com.br/pt-BR/articles/13335706-novo-tema-padrao-entenda-como-funciona-o-tema-padrao-das-novas-lojas-da-loja-integrada
- https://ajuda.lojaintegrada.com.br/pt-BR/articles/16962707-como-usar-o-google-tag-manager-na-loja-integrada

## Etapas para finalizacao
1. Verificar no painel desta loja se existe configuracao de CSS especifica de checkout.
2. Inspecionar o checkout em sessao autorizada com produto no carrinho e verificar os seletores HTML reais.
3. Ajustar o CSS a DOM conhecido. A referencia de grade esquerda/direita NAO pode ser aplicada as cegas, pois pode ocultar ou reordenar controles transacionais.
4. Salvar copia do CSS anterior, instalar no editor oficial e testar responsividade 320/360/390/430/768/1024/1440.
5. Testar validacao, login, CEP, frete, cupons, Pix, cartao, valor de pedido e navegacao; sem pedido real sem autorizacao de cobranca.
6. Se nao existir editor para checkout, nao realizar redirect ou checkout paralelo. Solicitar a plataforma caminho oficial.

Nao confundir deploy READY na Vercel com publicacao da alteracao no checkout.


## Checkout visual referência duas colunas (19/11/2026)

Prévia visual atualizada com identificação, entrega e pagamento à esquerda; três itens ilustrativos da captura, resumo, total, cupom, segurança e CTA à direita. CSS nativo preparado com classes de checkout conhecidas, sem mudança de ordem de elementos transacionais. Checkout real ainda não conectado ao editor oficial de CSS; nenhum produto foi adicionado ou cobrança iniciada nesta sessão. Exige homologação com DOM autenticado e testes 1440, 1366, 1280, 767 (duas passagens), além de 390.


## 20/11/2026 — HTML transacional nao presente na ultima mensagem

O usuario solicitou refazer o checkout e disse enviar HTML completo, mas nesta conversa o HTML nao estava presente como arquivo ou texto acessivel. Nao aplicar grade de colunas especulativa nem substituir formulario da LI sem a estrutura real. Ajustes da v1.24.0 se limitam ao carrinho e seus valores nativos.


## v1.25 — Checkout nativo, seletores confirmados pelo HTML (20/11/2026)

A amostra original do lojista (arquivo boxx.html) foi lida integralmente **somente para identificar estrutura e seletores**. Ela possui dados de sessao/transacao; **NAO versionar, compartilhar nem executar os scripts deste HTML**.

**Estrutura nativa (confirmada):**
- `body.pagina-carrinho.carrinho-checkout` — classe da rota real /checkout/.
- `#cabecalho` — logo e contatos, preservados.
- `#corpo .secao-principal > .campos-pedido > .campos-pedido` — wrapper com login, resumo do pedido e formulario.
- `.resumo-compra .tabela-carrinho` — produtos, quantidade, subtotal, frete, desconto e total da plataforma.
- `#formularioCheckout` — formulario POST nativo, todos os campos e regras de validacao mantidos.
- `.dados-cadastro` e `#tipoCadastro` — identificacao PF/PJ, CPF/CNPJ e criacao de senha.
- `#formularioEndereco`, `#formasEnvio` — CEP, endereco, frete e opcoes de entrega.
- `#formularioObservacao` — observacoes.
- `#formasPagamento`, `.li-box-payment`, `.accordion-group` — integracoes de cartao, Pix, boleto, pagamento na entrega etc.
- `#finalizarCompra` — botao transacional existente (com classe disabled quando condicoes nao estao completas).
- `.acao-editar .selo-ssl` — selo oficial, sem sobreposicao do botao.

**Desenho CSS publicado no codigo-fonte:**
- Desktop acima de 991px: dados de identificacao/entrega/pagamento empilhados na coluna esquerda, resumo sticky na direita. Tudo CSS: nenhum componente transacional muda de pai.
- Tablet e mobile <=991px: formulario primeiro, resumo depois, um unico fluxo vertical. Revisar 767px duas vezes e 390px em dispositivo emulado.
- Títulos Michroma, textos e formularios Montserrat, amarelo #ffc400, preto e branco.
- Sem mover inputs hidden, token de pagamento, radio, modal de erro, validacao, captcha, select, checkout_ref, form action e handlers. Nao copiar o HTML da captura para outro dominio.

**Instalacao e limites:**
- O arquivo `checkout-native.css` e a fonte versionada, ainda **NAO INJETADA NA ROTA DE CHECKOUT DA LOJA REAL**. Deploy Vercel sozinho nao realiza essa acao.
- A documentacao oficial (setembro 2026) esclarece que `Visual > Incluir codigo HTML` **NAO** funciona no checkout e finalizacao: https://ajuda.lojaintegrada.com.br/pt-BR/articles/911875-como-inserir-um-codigo-html-e-javascript
- Algumas modalidades de tema permitem CSS avancado especifico: https://ajuda.lojaintegrada.com.br/pt-BR/articles/13335706-novo-tema-padrao-entenda-como-funciona-o-tema-padrao-das-novas-lojas-da-loja-integrada . **Verificar no painel da TractorBel** se ha editor de CSS que efetivamente carrega em /checkout/ e se o tema usado autoriza.
- Nao adicionar `checkout-native.css` ao `tractorbel.css` geral esperando que passe a valer no checkout. Nao usar injetor externo nao autorizado, iframe, DOM clonado, endpoint de pagamento proprio ou alteracao dos formularios nativos.

**QA pendente de homologacao na Loja Integrada (nao certificado por snapshot HTML):** teste no browser com 1440/1366/1280/767 viewport/767 emulacao mobile/390, telefone, CPF/PJ, CEP, opcoes frete, cartao, Pix, boleto, alteracao de pagamento, mensagens de erro, botao disabled/ativo, selo SSL, cupons, sem concluir pagamento real. Aplicar somente apos confirmar que o CSS de checkout pode ser carregado sem afetar conversao.
