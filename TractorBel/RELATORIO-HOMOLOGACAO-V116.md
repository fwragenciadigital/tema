# TractorBel 2026 — Relatório de homologação final (v1.16.0)

**Data da auditoria:** 17/11/2026  
**Plataforma:** Loja Integrada  
**Ambiente de prévia:** https://www.lojatractorbel.com.br/?tractorbel_preview=1  
**Origem dos arquivos:** https://tractorbel-2026.vercel.app/tractorbel.js e https://tractorbel-2026.vercel.app/tractorbel.css  
**Publicação geral:** desativada na configuração da loja (`publicarNaLoja: false`) até aceite.

## Conclusão

**Status técnico: APROVADO NOS TESTES AUTOMATIZADOS E DE ESTRUTURA.**

**Status comercial: HOMOLOGAÇÃO FINAL PENDENTE.** A validação não executou pedidos reais, pagamento, cálculo de frete com CEP real, resgate de cupom válido nem Lighthouse com a página final ativa em um navegador conectado ao site. Estes testes dependem da sessão/condições reais da Loja Integrada e não devem ser apresentados como concluídos.

## Escopo validado

| Área | Desktop | Tablet | Mobile | Verificações |
|---|---|---|---|---|
| Home | Aprovado | Aprovado | Aprovado | Composição, carrossel de marcas, imagens, seção institucional e rodapé |
| Cabeçalho e menu | Aprovado | Aprovado | Aprovado | Logo do painel, submenu da LI, menu mobile, fechamento por Escape |
| Categoria Peças Novas | Aprovado | Aprovado | Aprovado | Grid 4/3/2/1 conforme largura, preços sem corte, Pix, botão, paginação |
| Busca | Aprovado | Aprovado | Aprovado | Cards e links de produtos, itens adicionados dinamicamente |
| Página do produto | Aprovado | Aprovado | Aprovado | Galeria, Pix, botão nativo, painel informativo e barra fixa mobile |
| Barra `#resumo-produto` | Aprovado | Aprovado | Aprovado | Adaptação da barra nativa e preservação do link de compra |
| Carrinho com produto | Aprovado | Aprovado | Aprovado | Quantidade, excluir, cupom, frete, subtotal, Pix, checkout **em fixture** |
| Carrinho vazio | Aprovado | Aprovado | Aprovado | Mensagem e CTA sem transbordamento |

**Larguras testadas:** 320, 360, 375, 390, 430, 768, 900, 1024, 1440 e 1920 px (a cobertura varia conforme o teste). Navegador local Chromium; fixtures estruturais baseadas no HTML efetivamente disponibilizado pela Loja Integrada. Navegação real por HTTP conferida para home, categoria, busca, PDP e carrinho.

## Correções aplicadas na v1.16

### 1. Imagens quebradas no CDN da Loja Integrada

Foram verificadas 20 referências de imagens do layout. **15 responderam HTTP 200** e **5 retornaram HTTP 404** no CDN:

- `fullbanner.jpg`
- `Novo Projeto (5).jpg`
- `Novo Projeto (6).jpg`
- `Novo Projeto (11).png`
- `logo-top.png`

Os arquivos equivalentes `.webp` existentes na Vercel responderam HTTP 200. O JS v1.16 agora **tenta primeiro a origem da Loja Integrada** e, se falhar, utiliza o arquivo equivalente na Vercel; isso funciona também nos fundos CSS declarados pelo JS. Assim, o fundo institucional não fica em branco enquanto os arquivos faltantes não são enviados ao painel. A logo do cabeçalho continua sendo obtida diretamente do painel da loja, independentemente do arquivo `logo-top.png`.

**Pendência operacional:** carregar/renomear os cinco recursos no CDN da loja antes de remover o fallback da Vercel.

### 2. Links institucionais inexistentes

Os seguintes links definidos anteriormente no rodapé retornaram HTTP 404:

- `/pagina/frete-e-entrega.html`
- `/pagina/trocas-e-devolucoes.html`
- `/pagina/politica-de-privacidade.html`

O endereço `/pagina/sobre-nos.html` retornou HTTP 200. O rodapé deixa de gerar links institucionais fictícios: mantém Sobre Nós e incorpora outras páginas apenas quando elas estiverem presentes como links no rodapé nativo da loja.

**Pendência obrigatória antes de publicar:** cadastrar e revisar no painel as páginas de entrega, trocas/devoluções e privacidade, com conteúdo aprovado pelo cliente. Após a publicação, verificar a inclusão dos links nativos no rodapé.

## Testes funcionais

- **Menu:** subcategorias obtidas da árvore nativa da Loja Integrada, abertura/fechamento por clique, menu mobile, tecla Esc e navegação.
- **Vitrines:** layout 4 colunas no desktop com sidebar, 3 no tablet, 2 no mobile comum e 1 abaixo de 360 px; títulos, preço e Pix dentro dos cards; links originais preservados.
- **PDP:** o JS atua como melhoria progressiva, preservando botão de compra, preço, frete e variações da plataforma; teste da barra fixa em celular e desktop.
- **Carrinho:** fixture com um item real da estrutura da loja, valor total R$ 6.000,00 e Pix R$ 5.820,00; sincronização após mudança simulada do total para R$ 12.000,00 e Pix para R$ 11.640,00; eventos dos botões nativos de frete, cupom, adicionar quantidade, remover e finalizar.
- **Acessibilidade básica:** rótulos e controles móveis, sem erro JavaScript nos cenários automatizados; não substitui auditoria WCAG completa com leitores de tela.
- **Links comerciais:** home, `/pecas-novas`, `/pecas-seminovas`, `/miniaturas`, `/equipamentos-novos`, `/carrinho/index` responderam HTTP 200.

## Testes que ainda exigem conferência real antes da liberação

1. Em desktop e mobile reais, abrir uma sessão com produto e confirmar quantidade `+`/`−`, exclusão, atualização e manutenção do estado do carrinho ao navegar.
2. Simular um cálculo de frete com CEP atendido e outro não atendido, verificando prazo, valor e mensagens de erro.
3. Aplicar um cupom real autorizado (válido e inválido), confirmando atualização do total e Pix no resumo.
4. Prosseguir até a identificação/checkout e testar meios de pagamento em ambiente autorizado, **sem efetuar cobrança real sem autorização específica**.
5. Em dispositivos físicos (preferencialmente iPhone Safari e Android Chrome), conferir abertura de menu, rolagem de marcas (3 por vez), teclado/inputs, sticky header, galeria, barra fixa, drawers e navegação por toque.
6. Verificar Lighthouse/PageSpeed real para **LCP, CLS, INP** e política de cache após habilitar a versão ao público.
7. Registrar/corrigir as páginas institucionais faltantes e confirmar seus links, conteúdo legal e acessibilidade.
8. Aprovação visual final pelo cliente em home, catálogo, PDP e carrinho, inclusive nas larguras 320/390 e 1440 px.

## Critério de liberação

Manter `publicarNaLoja: false` até o checklist operacional e visual ser concluído. Os mesmos links JS/CSS permanecem válidos; alterações no GitHub publicam automaticamente na Vercel. Depois do aceite, mover os arquivos finais para o armazenamento autorizado da Loja Integrada e validar novamente todas as rotas e recursos no novo domínio.

**Nota:** capturas de teste e fixtures são representações locais da estrutura da plataforma, não fotografias verificadas do site real renderizado em dispositivo físico.
