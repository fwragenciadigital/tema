# TractorBel — Ativação oficial (19/11/2026)

## Situação da implantação
Aprovada a configuração de produção do projeto TractorBel. A versão GitHub/Vercel estará preparada para produção. **O checkout público e a loja transacional não foram modificados por este commit.** Um deploy na Vercel não atualiza automaticamente o código HTML já inserido no painel da Loja Integrada.

## Arquivos
- `INTEGRACAO-LOJA-INTEGRADA.html`: snippet para produção, com `geral.publicarNaLoja: true`.
- `INTEGRACAO-LOJA-INTEGRADA-PREVIEW.html`: cópia integral da integração anterior (`false`) para reverter.
- `tractorbel.js`, `tractorbel.css`: assets externos do layout, URLs mantidas sem alterações.

## Como efetivar no painel da Loja Integrada
1. Fazer backup do código HTML customizado e das chamadas de CSS/JS atualmente instaladas.
2. Acessar a opção de código HTML global ("Todas as páginas exceto checkout") e localizar o bloco original `window.TractorBelSettings`.
3. Substituir somente `publicarNaLoja: false` por `publicarNaLoja: true` na configuração já instalada. Se esse bloco não estiver equivalente ao repositório, instalar o conteúdo do snippet de produção completo, **sem duplicar** a chamada de assets.
4. Preservar UMA chamada para `https://tractorbel-2026.vercel.app/tractorbel.css` e UMA para `https://tractorbel-2026.vercel.app/tractorbel.js`; a definição de `window.TractorBelSettings` deve preceder o carregamento do JS.
5. NÃO remover indiscriminadamente scripts legados `fwrnewnovo1.min.js`: o novo projeto ainda reutiliza componentes como `#resumo-produto`. Planejar a migração do legado após QA funcional.
6. Validar homepage, menu, busca, categoria, marca, PDP com variações, Pix, comprar, carrinho lateral, carrinho vazio/cheio, frete, cupom, login, cadastro, conta, pedidos, institucional e mobile em 320/390/768/1024/1440. Inspecionar console, CLS, erros em formulários e links.
7. Confirmar avanço até checkout oficial, sem alterar gateways, cupons, frete ou pagamentos nativos e sem gerar cobrança para testar sem autorização.

## Rollback
No mesmo bloco HTML do painel, alterar `geral.publicarNaLoja: true` para `false`, salvar e limpar cache se aplicável. Se for necessário desligar tudo, restaurar a cópia do snippet e os assets anteriores.

## Limite atual
Há acesso GitHub e Vercel, mas não há conexão administrativa com o painel Loja Integrada, logo **a ativação efetiva da loja não pode ser confirmada sem aplicação no painel**. A rota checkout usa mecanismo separado, conforme restrição da plataforma.
