# TractorBel | Checkout (17/11/2026)

**Status:** conceito de interface publicado para revisão; checkout transacional da Loja Integrada INALTERADO. Este não é um pagamento paralelo.

## Visual solicitado
A referência enviada pelo cliente inspira layout minimalista, formulário à esquerda, resumo à direita, identidade branca/preta/amarela e versão mobile. O protótipo é demonstrativo (sem formulários que enviem dados, sem cálculo comercial e sem captura de pagamento).

## Fontes
- [Checkout — prévia visual não transacional](checkout-preview.html): renderiza a direção visual para aprovação.
- [checkout-native.css](checkout-native.css): CSS conservador **não instalado**, a validar contra o DOM real e somente por uma configuração oficialmente permitida de CSS do checkout.

## Restrição oficial
Loja Integrada (Ajuda, 17/09/2026): o recurso Visual/Personalize > Incluir código HTML não permite HTML/CSS/JavaScript no checkout nem na finalização. Outra documentação informa CSS Avançado de checkout no novo tema padrão, sem comprovar disponibilidade no tema da TractorBel.
- https://ajuda.lojaintegrada.com.br/pt-BR/articles/911875-como-inserir-um-codigo-html-e-javascript
- https://ajuda.lojaintegrada.com.br/pt-BR/articles/13335706-novo-tema-padrao-entenda-como-funciona-o-tema-padrao-das-novas-lojas-da-loja-integrada

## Para viabilizar sem afetar conversão
1. Verificar se o painel desta loja oferece editor de CSS **nativo do checkout**. NÃO usar inclusão comum de HTML/JS, não redirecionar checkout e não montar checkout novo em Vercel.
2. Testar a página real em sessão autorizada com item no carrinho; confirmar seus seletores e disponibilidade do CSS antes de habilitar qualquer estilo.
3. Manter campos, mensagens de validação, pagamento, Frete, Pix, parcelas, descontos, consentimentos e processamento exclusivamente na Loja Integrada.
4. Homologar 320/360/390/430/768/1024/1440, login, CEP, cupom, formas de pagamento e retorno ao carrinho; sem efetuar pagamento real sem autorização específica.
5. Publicar apenas após aceite visual e técnico, com rollback pelo editor oficial.

## Limite desta entrega
O checkout real não estava acessível para inspeção nesta sessão. Nenhuma compra foi criada, nenhum dado foi coletado, e o CSS não foi aplicado à página transacional.