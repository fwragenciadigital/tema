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
