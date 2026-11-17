# Cabcom 2026 — Loja Integrada / FWR Agência Digital

Este projeto utiliza o mesmo modelo operacional da TractorBel: camada JS/CSS externa, arquivos versionados no GitHub e publicados via Vercel, com configuração no HTML da Loja Integrada.

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