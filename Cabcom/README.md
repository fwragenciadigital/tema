# Cabcom 2026 — Loja Integrada / FWR Agência Digital

Este projeto utiliza o mesmo modelo operacional da TractorBel: camada JS/CSS externa, arquivos versionados no GitHub e publicados via Vercel, com configuração no HTML da Loja Integrada.

## Diagnóstico de ativação da prévia — 20/11/2026

A URL \`?cabcom_preview=1\` **não injeta** JS/CSS por conta própria. O código \`INTEGRACAO-LOJA-INTEGRADA.html\` deve estar salvo no HTML personalizado da Cabcom e a página deve fazer as requisições \`https://cabcom-2026.vercel.app/cabcom.js\` e \`https://cabcom-2026.vercel.app/cabcom.css\`.

**Teste visual imediato:** com os arquivos carregados e a flag de prévia ativa, aparece o selo **CABCOM 2026 · PRÉVIA ATIVA** no canto inferior direito. Se o selo não aparecer, verificar o HTML injetado no painel e a aba Network do navegador (não há razão para continuar comparando o layout antes de resolver o carregamento).

**Teste técnico no console do navegador:**
\`\`\`js
({
  script: !!window.Cabcom2026,
  active: window.Cabcom2026?.state?.active,
  preview: window.Cabcom2026?.state?.preview,
  header: window.Cabcom2026?.state?.header,
  sections: window.Cabcom2026?.state?.sections,
  warnings: window.Cabcom2026?.state?.warnings
})
\`\`\`

**Atualizações v1.1:** novo cabeçalho com as categorias oficiais capturadas no menu nativo, logo do painel, busca submetida pelo formulário original, acesso a conta e link ao carrinho de orçamento. O cabeçalho da LI permanece no DOM, mas é retirado do fluxo visual apenas durante a prévia. As seções customizadas passam a ter largura total da viewport.

**Banner:** em prévia, tenta usar \`fullbanner.jpg\` no CDN informado. Se a imagem carregar, oculta somente o banner visual anterior; se faltar, não oculta o banner do painel. Em publicação, continua prioritário o banner gerenciado pela Loja Integrada. Para fidelidade final, o cliente deve cadastrar o banner aprovado na posição nativa do painel.

**Arquivos gráficos:** o arquivo \`Fatiado.rar\` não equivale a upload para a CDN. Enquanto os arquivos não estiverem acessíveis nas URLs da LI, os módulos gráficos exclusivos não terão fidelidade ao layout. Não afirmar que imagens foram publicadas só porque foram descompactadas.


## Revisão v1.4.0 — 20/11/2026

- **Somente em `?cabcom_preview=1`**: as áreas legadas `.banner-central`, `.banner-tarja-central`, `.banner-central-marcas` e `.box-vitrine` recebem ocultação visual depois da montagem das seções Cabcom. Todos os nós continuam disponíveis no DOM para a Loja Integrada e para leitura das imagens. Não ocultar um contêiner que inclua módulos novos.
- `.cc26-shortcuts` lê imagens, rótulos e **links reais** da seção `.banner-central-marcas`. Se não houver imagens ou links no HTML do tema, mantém o bloco original disponível até que a origem seja encontrada; não inventa imagens ou slugs.
- Ícones da faixa de benefícios, navegação e contatos substituídos por SVGs padronizados, sem emojis.
- Fade-up progressivo com `IntersectionObserver`, hover e imagens com transição de carregamento. Respeita `prefers-reduced-motion` e mantém conteúdo visível caso o navegador não suporte a API.
- `window.Cabcom2026.state.shortcuts` informa a origem e a quantidade de atalhos, e `state.previewHidden` quantifica contêineres ocultados em modo de prévia.
- **Atenção:** publicação na Vercel não significa que os recursos já foram homologados no DOM real; comparar desktop/mobile e checar navegação/ação dos atalhos antes de ativar produção.

## Experiência de navegação v1.5.0

- **Fade-up progressivo** em seções, títulos, vitrines e elementos editoriais, disparado por `IntersectionObserver`.
- **Loader não bloqueante** (barra superior + estado Carregando): encerra após `load` ou timeout de segurança de 1,6s. Não intercepta cliques, formulários ou checkout.
- **Menu** com entrada suave dos submenus, marcação de categoria atual, fechamento do menu mobile ao selecionar link ou clicar fora, feedback de foco e sombra do cabeçalho durante a rolagem.
- **Progresso de leitura** discreto na borda inferior do cabeçalho.
- `prefers-reduced-motion` desabilita as animações; ausência de APIs de animação não bloqueia conteúdo.
- Exclusivo da camada Cabcom ativa; links, busca, formulários, orçamento e checkout continuam nativos.

Configuração opcional do bloco `window.CabcomSettings` no HTML da loja:

```js
efeitos: {
  ativo: true,
  fadeUp: true,
  imagens: true,
  loader: true,
  navegacao: true,
  indicadorRolagem: true
}
```

Para desligar somente o loader: `efeitos: { loader: false }`. `publicarNaLoja:false` permanece necessário até homologação. Recarregar com `?cabcom_preview=1` para testar.

## Links permanentes
- JS: https://cabcom-2026.vercel.app/cabcom.js
- CSS: https://cabcom-2026.vercel.app/cabcom.css
- Integração: INTEGRACAO-LOJA-INTEGRADA.html
- Layout aprovado: https://projetos.fwragenciadigital.com.br/cabcom/2025/
- Loja: https://www.cabcom.com.br/

## Publicação segura
1. Conferir upload dos **24 arquivos originais** do Fatiado.rar para `https://cdn.awsli.com.br/80/80577/arquivos/`, preservando nome, extensão e letras minúsculas. O endereço-base por si só não comprova que todos foram publicados.
2. No HTML personalizado da LI, colar o código de `INTEGRACAO-LOJA-INTEGRADA.html`.
3. Deixar `geral.publicarNaLoja: false`. Validar em `https://www.cabcom.com.br/?cabcom_preview=1`.
4. Testar desktop (1920, 1440, 1024), tablet (768) e mobile (390, 375, 320).
5. Testar **busca, menus, categorias, login, Minha Conta, orçamento, formulário de cotação, WhatsApp, e-mail, produtos, variações, quantidade, frete/CEP, cupons, métodos de pagamento e checkout**, conforme disponíveis na loja.
6. Depois de aprovar, habilitar `publicarNaLoja: true` no HTML da loja. **Não habilitar em desenvolvimento.**
7. Após estabilização, baixar `cabcom.js` e `cabcom.css` e hospedar no próprio CDN da LI, atualizando as duas URLs do snippet uma única vez.

## Propriedades nativas da Loja Integrada
Logo, busca, menu, banner nativo, categorias, vitrines, preços, estoque, botões de cotação, sessão e checkout permanecem administráveis na própria LI. Este projeto não cria nem altera produto, carrinho, pedido, preço, condição comercial ou API da loja. Em particular, a Cabcom trabalha com carrinho de **orçamento** e ele não deve ser substituído por um carrinho genérico.

O banner `fullbanner.jpg` é fallback quando não existe banner nativo detectável. Se a loja tiver um banner nativo, ele fica preservado como fonte administrável. Assim, cadastrar o layout aprovado também no banner da LI é necessário para fidelidade visual integral.

As novas seções editoriais vêm do JS. Apenas os arquivos editoriais customizados são geridos no código.

## Limitações conhecidas
- Recebido: `Fatiado.rar` com 24 imagens; não foi recebido um arquivo separado `public.rar` com scripts pré-existentes. Não é possível integrar ou certificar funções específicas desse arquivo até recebê-lo.
- O layout aprovado e as imagens fatiadas não são o HTML funcional da loja; reproduzir o desenho não garante renderização idêntica dos controles nativos sem homologação na loja real.
- Imagens CDN não verificadas automaticamente; em caso de erro, o script emite aviso no console (`debug:true`) e não substitui os controles comerciais.
- Não criar botões de orçamento por WhatsApp/e-mail com links artificiais: o código mantém os botões e suas ações implementadas na LI.

## Arquitetura
`Cabcom/cabcom.js`: injeta módulos exclusivos e melhora vitrines **sem clonar cards**; usa URLs de categorias lidas dos links existentes, sem fixar slugs de categorias.

`Cabcom/cabcom.css`: tema responsivo escopado a `.cc26-active` e, quando necessário, aos elementos nativos específicos de Cabcom.

`Cabcom/assets-manifest.json`: arquivos originais exigidos no CDN da Loja Integrada.

Atualizações de `Cabcom/` no branch `main` são publicadas pelo projeto Vercel `cabcom-2026` com Root Directory `Cabcom`; não alterar o HTML da loja a cada revisão.

## QA
- Sem JS, o site da LI continua funcional e com seu tema nativo.
- Com `publicarNaLoja:false`, visitantes sem `?cabcom_preview=1` continuam com o layout anterior.
- Não há listeners novos para submit/compra, nem eventos sintéticos em elementos de negócio.
- Não ocultar `#corpo` e `#rodape` nem destruir formulários, carrinho ou vitrines.