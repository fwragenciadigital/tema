# TractorBel 2026 — Auditoria visual e funcional | v1.4.0

Data: 13/11/2026. Referências: versão aprovada `https://projetos.fwragenciadigital.com.br/tractorbel/2026/` e loja `https://www.lojatractorbel.com.br/?tractorbel_preview=1`.

## Metodologia
O endereço aprovado entrega um HTML simples contendo uma única imagem comprida `images/banner-regua.png` de **1250 × 9404 px**; trata-se de arte visual estática, não de uma interface funcional. A versão da Loja Integrada expõe DOM de categorias, dados comerciais e scripts. Foi possível inspecionar o HTML dessas duas páginas e validar os módulos em fixtures locais usando Chromium/Playwright em 1480×900 e 390×844. **Não foi possível fazer uma comparação pixel a pixel entre capturas renderizadas das duas URLs públicas**. Os screenshots enviados pelo cliente serviram de referência do design.

## Matriz de correspondência

| Elemento aprovado | Implementação v1.4 | Observação |
| --- | --- | --- |
| Cabeçalho escuro, logo e borda amarela | Mantido; sticky no scroll | Menu com as categorias reais do painel e submenus nativos |
| Menu horizontal, categorias e navegação mobile | Corrigido | Hover/foco no desktop, acordeão com botão próprio no celular, Escape |
| Faixa de marcas redondas | Imagem CDN oficial | O conteúdo visual é fatiado; não reconstruir marcas a partir de logos aleatórios |
| Hero escavadeira + chamada 50.000 | Imagem CDN oficial | O desktop segue a composição; banner desktop pode ter texto muito pequeno no celular sem imagem mobile específica |
| Quatro qualificadores de compra | Ícones SVG com identidade monocromática | Aproximação fiel às referências de entrega, cartão, desconto e segurança |
| Faixa institucional de peças/equipamentos | Imagem CDN oficial | Preservada |
| Cards de produtos em destaque | Vitrine com produtos **reais** da LI | Produtos e preços variam; valores da arte são demonstrativos, não dados comerciais atuais |
| Cards amarelos de categorias | Imagens originais e URLs reais | Os três cards são clicáveis; os filtros por segmento ainda não são categorias específicas |
| Miniaturas exclusivas | Carrossel com produtos reais ou link | Busca tardia da categoria quando necessária |
| Peças mais vendidas | Vitrine específica **somente se a LI publicar esse agrupamento** | Caso contrário mostra título neutro; requer vitrine de mais vendidos nativa para identidade exata |
| Soluções por segmento | Imagens originais | Links de segmentação precisam de categorias/URLs efetivamente cadastradas, não URLs fictícias |
| Empresa, contato e telefone | Preservados | Links WhatsApp/telefone/e-mail no bloco |
| Últimas postagens | Arte original do projeto | Feed é uma composição visual estática, não integração com API do Instagram; só linka para perfil se URL real informada |
| Rodapé escuro/amarelo, meios de pagamento | Leitura dos selos e bandeiras do rodapé nativo | Se os elementos não estiverem presentes no tema, mostra texto seguro sem inventar selos |
| Drawer do carrinho | Corrigido | Itens, preço, quantidade, total nativo `.carrino-total`, subtotal estimado quando possível, frete no checkout |
| Parcelamento | Exibido só quando há regra verificável | Necessita max. parcelas e juros vigentes para calcular automaticamente caso LI não mostre frase parcelada no DOM |

## Correções funcionais e performance
- `navItems()` anterior recriava apenas categorias principais e perdia as subcategorias. Agora replica a árvore LI com limites de profundidade, sem modificar os nós nativos.
- `position:relative` impedia header sticky; substituído por `position:sticky` e ajustes de overflow.
- `readTotal()` não priorizava a classe real `.carrino-total`; corrigido no parsing do minicarrinho.
- O resumo do carrinho fica visível no rodapé fixo do drawer, próximo do botão de continuar para o checkout.
- O cálculo de parcelamento nunca inventa máximo, descontos ou juros. Regras manuais só devem ser configuradas após verificação no painel.
- O banner principal não recebe fade-in, protegendo LCP; componentes abaixo da dobra continuam usando `IntersectionObserver` sem alterar dimensões.
- Extração de miniaturas sob demanda evita baixar uma página de categoria extra antes de o cliente se aproximar da seção.

## Critérios de homologação antes da publicação geral
- Em `?tractorbel_preview=1`, clicar menu **Peças Novas** e abrir diferentes subcategorias em desktop e mobile; conferir navegação para URLs reais.
- Adicionar produtos reais em uma sessão de teste da loja e verificar subtotal, regras de pagamento, descontos e frete no checkout oficial.
- Conferir banner, fundos e cortes em 360, 390, 768, 1024, 1440 e 1920 px; validar imagem mobile específica caso a mensagem no hero fique ilegível.
- Conferir ícones de pagamento, rodapé e links sociais com os dados do painel.
- Verificar console para `TractorBel2026.diagnostico()` e métricas Core Web Vitals na página hospedada.

**Importante:** arquivo aprovado é **arte gráfica estática**. O objetivo desta versão é fidelidade de identidade + funcionalidade e dados reais da Loja Integrada, não reproduzir números ou ofertas fictícios que constem no mockup.