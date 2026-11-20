# TractorBel — QA v1.25.0 (20/11/2026)

## Fontes
- `boxx.html`: amostra HTML transacional recebida do lojista, inspecionada localmente. Nao versionada pois contem valores de sessao e dados potencialmente sensiveis.
- `tractorbel.js` e `tractorbel.css` em main: ajustes do carrinho/empresa/home.
- `checkout-native.css` em main: folha de estilos independente baseada nos seletores concretos do checkout.

## Validacoes concluídas
- JavaScript v1.25.0: compilacao sintatica PASS.
- Parcelamento do carrinho via texto nativo da Loja Integrada: 5 testes PASS; contempla `ou em até 6x de R$ 1.208,85 sem juros`, arredondamento de centavos, pagamento com juros e rejeicao de valores inconsistentes.
- Estrutura checkout HTML, confirmado no snapshot: `#formularioCheckout`, `#finalizarCompra`, `#formasPagamento`, `#formularioEndereco`, `.dados-cadastro`, `.resumo-compra` todos presentes.
- O formulario nativo no snapshot contem 84 inputs, dos quais 40 hidden, 5 radios de forma de pagamento e 9 inputs de entrega. Preservados pelos seletores visuais, sem copia ou alteracao de dados transacionais.
- Teste local de estrutura com fixture sanitizada, CSS compacto equivalente apenas para a grade: 1440/1366/1280 duas colunas, 767 responsivo/767 emulacao mobile/390 emulacao mobile uma coluna, todos sem overflow horizontal, PASS.
- Confirmada publicação dos arquivos via resposta HTTP 200 no dominio Vercel: `/tractorbel.js` v1.25.0, `/tractorbel.css` v1.25.0 e `/checkout-native.css` v1.25.0.

## Limites do teste
- Os 6 testes locais de layout verificam seletores e estrutura em CSS representativo, **nao sao renderizacoes da folha de estilos completa** ou da loja real.
- Deploy READY na Vercel **nao implica CSS aplicado à rota /checkout/**. O codigo padrao de HTML da LI nao permite personalizar checkout. Existe CSS Avancado especifico em certas modalidades/temas, a verificar na conta.
- Nao foram executados pedidos, pagamento de teste, validacao de frete real, CPF/CNPJ ou mascaras dos campos, nem compra real.
- Antes de ativar a personalizacao do checkout, validar em ambiente autorizado os tamanhos 1440,1366,1280,767 responsivo,767 mobile e 390, inclusive formularios PF/PJ, login, frete, pagamento, erros, botao disabled e selos. Usar rollback do CSS caso haja regressao funcional.

## Integracao pendente
1. Verificar editor que injeta CSS especificamente no checkout na conta TractorBel.
2. Confirmar que o seletor da rota ainda corresponde à amostra (body `.pagina-carrinho.carrinho-checkout`).
3. Aplicar apenas o `checkout-native.css` no canal de personalizacao oficialmente suportado.
4. Homologar todos os passos do pagamento sem executar cobranca real.

Fonte: https://ajuda.lojaintegrada.com.br/pt-BR/articles/911875-como-inserir-um-codigo-html-e-javascript
