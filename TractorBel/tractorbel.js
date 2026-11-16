/*
 * TractorBel 2026 - FWR Agencia Digital - v1.10.0
 * Camada visual da Loja Integrada. Sem checkout ou precificacao paralela.
 * Editavel por window.TractorBelSettings no HTML da LI.
 */
(function (win, doc) {
  'use strict';
  if (win.TractorBel2026) return;
  var VERSION = '1.10.0';
  // Assets oficiais da TractorBel, ja hospedados na Loja Integrada.
  // Manter os nomes e extensoes ORIGINAIS, sem converter .jpg/.png para .webp.
  // O nome logico pode continuar .webp para compatibilidade com os componentes existentes.
  var ASSET_CDN_BASE = 'https://cdn.awsli.com.br/901/901888/arquivos/';
  var ASSET_FILES = Object.freeze({
    'peca3.webp': 'peca3.png',
    'bg-footer.webp': 'bg-footer.png',
    'vendedores.webp': 'vendedores.jpg',
    'fullbanner.webp': 'fullbanner.jpg',
    'bg-miniaturas.webp': 'bg-miniaturas.jpg',
    'box-contato.webp': 'box-contato.png',
    'novo-projeto-6.webp': 'Novo Projeto (6).jpg',
    'minibox2.webp': 'minibox2.png',
    'peca1.webp': 'peca1.png',
    'minibox4.webp': 'minibox4.png',
    'bg-pecas.webp': 'bg-pecas.jpg',
    'insta.webp': 'insta.jpg',
    'minibox1.webp': 'minibox1.png',
    'novo-projeto-11.webp': 'Novo Projeto (11).png',
    'logo-empresa-footer.webp': 'logo-empresa-footer.png',
    'novo-projeto-5.webp': 'Novo Projeto (5).jpg',
    'logo-top.webp': 'logo-top.png',
    'fundo-destaques.webp': 'fundo-destaques.jpg',
    'minibox3.webp': 'minibox3.png',
    'peca2.webp': 'peca2.png'
  });
  // A LI pode normalizar os nomes com espacos. Se o original falhar, tenta o alias.
  var ASSET_ALIASES = Object.freeze({
    'novo-projeto-5.webp': ['novo-projeto-5.jpg', 'novo-projeto-(5).jpg'],
    'novo-projeto-6.webp': ['novo-projeto-6.jpg', 'novo-projeto-(6).jpg'],
    'novo-projeto-11.webp': ['novo-projeto-11.png', 'novo-projeto-(11).png']
  });
  var defaults = {
    geral: { ativo: true, publicarNaLoja: false, debug: false },
    imagensBase: ASSET_CDN_BASE,
    topo: { ativo: true, menu: true },
    marcas: {
      ativo: true, porRolagemMobile: 3, imagensBase: 'https://tractorbel-2026.vercel.app/assets/marcas/',
      itens: [
        { imagem: 'cat.png', nome: 'CAT', ativo: true },
        { imagem: 'sany.png', nome: 'SANY', ativo: true },
        { imagem: 'xcmg.png', nome: 'XCMG', ativo: true },
        { imagem: 'komatsu.png', nome: 'Komatsu', ativo: true },
        { imagem: 'volvo.png', nome: 'Volvo', ativo: true },
        { imagem: 'case.png', nome: 'CASE', ativo: true },
        { imagem: 'randon.png', nome: 'Randon', ativo: true },
        { imagem: 'john-deere.png', nome: 'John Deere', ativo: true }
      ]
    },
    beneficios: {
      ativo: true, itens: [
        { ativo: true, texto: 'ENVIAMOS PARA TODO O BRASIL' },
        { ativo: true, texto: 'PARCELE NO CARTÃO DE CRÉDITO' },
        { ativo: true, texto: 'PAGUE À VISTA E GANHE DESCONTO' },
        { ativo: true, texto: 'AMBIENTE DE COMPRA 100% SEGURO' }
      ]
    },
    institucional: {
      ativo: true,
      titulo: 'NO BRASIL, somos uma das maiores vendedoras de peças, equipamentos e serviços.',
      textoAntes: 'A ',
      destaque: 'mais de 40 anos, a Tractorbel',
      textoDepois: ' é referência no segmento de peças novas, seminovas e insumos mecânicos para tratores, escavadeiras e máquinas pesadas.'
    },
    home: { ativo: true },
    produto: { ativo: true, compraFixaMobile: true, pixEmDestaque: true, resumoRapido: true },
    rodape: { ativo: true },
    vitrines: { ativo: true, destaques: 10, miniaturas: 8, maisVendidos: 10 },
    carrinho: { ativo: true, parcelamento: { maximo: null, semJuros: null, minimoParcela: null } },
    movimento: { ativo: true, fadeIn: true, hover: true, duracao: 740, distancia: 25, intervalo: 80 },
    conteudo: {
      fraseMarcas: 'Temos de imediato FPS com o melhor preço do mercado!',
      whatsapp: '5531996573930',
      telefone: '(31) 2105-1455',
      email: 'vendas@tractorbel.com.br',
      instagram: '',
      facebook: '',
      sobre: 'Em 1983 nascia a TractorBel Tratores e Peças, em Belo Horizonte, Minas Gerais. Uma trajetória de mais de 40 anos com estoque de peças novas e seminovas, equipamentos e atendimento especializado.'
    }
  };
  function merge(a, b) {
    var r = Object.assign({}, a);
    Object.keys(b || {}).forEach(function (key) {
      if (b[key] && typeof b[key] === 'object' && !Array.isArray(b[key]) && a[key] && typeof a[key] === 'object') r[key] = merge(a[key], b[key]);
      else r[key] = b[key];
    });
    return r;
  }
  var cfg = merge(defaults, win.TractorBelSettings || {});
  // Prioridade ao CDN oficial mesmo que o HTML antigo ainda aponte para /assets/ da Vercel.
  cfg.imagensBase = ASSET_CDN_BASE;

  var isHome = /^\/?(?:index\.html)?\/?$/.test(location.pathname);
  var isStore = /(?:^|\.)lojatractorbel\.com\.br$/i.test(location.hostname);
  var preview = /(?:^|[?&])tractorbel_preview=1(?:&|$)/.test(location.search);
  var enabled = cfg.geral.ativo && (!isStore || cfg.geral.publicarNaLoja || preview);
  var state = { header: false, home: false, footer: false, products: {}, motion: { ativo: false, observados: 0, revelados: 0 }, warnings: [] };
  var motionObserver = null;
  var motionSeen = new WeakSet();
  function debug() { if (cfg.geral.debug && console && console.info) console.info.apply(console, ['[TractorBel]'].concat([].slice.call(arguments))); }
  function warn(msg) { state.warnings.push(msg); debug(msg); }
  function e(tag, cls, text) { var x = doc.createElement(tag); if (cls) x.className = cls; if (text !== undefined && text !== null) x.textContent = text; return x; }
  function append(parent) { for (var i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]); return parent; }
  function link(href, cls, text) { var x = e('a', cls, text); x.href = href; return x; }
  function asset(name, attempt) {
    var filename = (attempt > 0 && ASSET_ALIASES[name] && ASSET_ALIASES[name][attempt - 1]) || ASSET_FILES[name] || name;
    return ASSET_CDN_BASE + encodeURIComponent(filename);
  }
  function image(name, alt, width, height, eager) {
    var x = e('img'); x.src = asset(name); x.alt = alt || ''; x.width = width; x.height = height;
    x.loading = eager ? 'eager' : 'lazy'; x.decoding = 'async';
    if (eager) x.setAttribute('fetchpriority', 'high');
    if (ASSET_ALIASES[name]) {
      var attempt = 0;
      x.addEventListener('error', function () {
        attempt++;
        if (attempt <= ASSET_ALIASES[name].length) x.src = asset(name, attempt);
        else warn('Imagem indisponivel no CDN da LI: ' + name);
      });
    }
    return x;
  }
  function setBackground(node, logicalName, overlay) {
    if (!node) return;
    // Backgrounds tambem usam a Loja Integrada; fallback nos nomes normalizados.
    var attempt = 0;
    function apply() {
      var url = asset(logicalName, attempt);
      var value = (overlay ? overlay + ', ' : '') + 'url("' + url + '")';
      node.style.backgroundImage = value;
      if (!ASSET_ALIASES[logicalName] || attempt >= ASSET_ALIASES[logicalName].length) return;
      var probe = new Image();
      probe.onerror = function () { attempt++; apply(); };
      probe.src = url;
    }
    apply();
  }
  function setBackgroundVariable(prop, name) {
    var attempt = 0;
    function apply() {
      var url = asset(name, attempt);
      doc.body.style.setProperty(prop, 'url("' + url + '")');
      if (!ASSET_ALIASES[name] || attempt >= ASSET_ALIASES[name].length) return;
      var probe = new Image();
      probe.onerror = function () { attempt++; apply(); };
      probe.src = url;
    }
    apply();
  }
  function configureBackgrounds() {
    // Os fundos da vitrine e do institucional tambem seguem o mapeamento do JS.
    setBackgroundVariable('--tb26-bg-featured', 'fundo-destaques.webp');
    setBackgroundVariable('--tb26-bg-best', 'novo-projeto-5.webp');
    setBackgroundVariable('--tb26-bg-company', 'novo-projeto-6.webp');
  }
  function safeUrl(raw) {
    try { var url = new URL(raw, location.href); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch (_e) { return ''; }
  }
  function firstText(root, selectors) {
    for (var i = 0; i < selectors.length; i++) { var node = root.querySelector(selectors[i]); if (node && node.textContent.trim()) return node.textContent.replace(/\s+/g, ' ').trim(); }
    return '';
  }
  function firstElement(root, selectors) {
    for (var i = 0; i < selectors.length; i++) { var node = root.querySelector(selectors[i]); if (node) return node; }
    return null;
  }
  // A arvore de categorias vem DIRETAMENTE do painel da Loja Integrada.
  // Preserva ordem, links, subcategorias e ate 3 niveis quando cadastrados.
  function navItems() {
    var list = firstElement(doc, [
      '#cabecalho .menu.superior > ul.nivel-um',
      '#cabecalho .menu.superior ul.nivel-um',
      '#cabecalho ul.nivel-um',
      '#cabecalho .menu-principal > ul'
    ]);
    function walk(li, depth) {
      if (!li || depth > 3) return null;
      var a = firstElement(li, [':scope > a[href]']);
      if (!a) return null;
      var href = safeUrl(a.getAttribute('href'));
      if (!href || !/^https?:$/.test(new URL(href).protocol)) return null;
      var title = (a.getAttribute('title') || firstText(a,['strong','.titulo']) || a.textContent || '').replace(/\s+/g,' ').trim();
      if (!title || /--[A-Z_]+--/.test(title)) return null;
      var ul = firstElement(li, [':scope > ul.nivel-dois', ':scope > ul.nivel-tres', ':scope > ul']);
      var children = ul ? [].slice.call(ul.children).filter(function(n){ return n.tagName === 'LI'; }).map(function(n){ return walk(n, depth+1); }).filter(Boolean) : [];
      if (depth === 1 && title.toUpperCase() === 'FPS') title = 'FERRAMENTAS DE PENETRAÇÃO DE SOLO';
      return {title:title, href:href, children:children};
    }
    if (list) {
      var nodes = [].slice.call(list.children).filter(function(n){return n.tagName === 'LI';});
      var nativeTree = nodes.map(function(n){return walk(n,1);}).filter(Boolean);
      if (nativeTree.length) { state.categories = {origem:'menu LI', principais:nativeTree.length, subcategorias:nativeTree.reduce(function(n,it){return n+it.children.length;},0)}; return nativeTree; }
    }
    warn('Categorias nativas indisponiveis; mantidos links principais para navegacao.');
    return [['PEÇAS NOVAS','/pecas-novas'],['PEÇAS SEMINOVAS','/pecas-seminovas'],['CRBT','/crbt'],
      ['FERRAMENTAS DE PENETRAÇÃO DE SOLO','/fps'],['LUBRIFICANTES','/lubrificantes'],['MINIATURAS','/miniaturas'],
      ['EQUIPAMENTOS','/equipamentos-novos']].map(function(x){return {title:x[0],href:x[1],children:[]};});
  }
  // A imagem da marca pertence ao painel da Loja Integrada, não ao pacote fatiado.
  // O cabeçalho nativo é lido antes de ser ocultado; assim, trocar a logo no painel
  // atualiza a versão personalizada sem modificar o JS/CSS.
  function nativeStoreLogo(native) {
    var logo = firstElement(native, [
      'h1.logo a img', '.logo a img', 'h1.logo img', '.logo img',
      '.logo picture img', 'a.logo img'
    ]);
    if (!logo) return null;
    var src = logo.getAttribute('src') || logo.getAttribute('data-src') ||
              logo.getAttribute('data-original') || logo.currentSrc;
    var url = safeUrl(src);
    if (!url) return null;
    var anchor = logo.closest('a[href]');
    return {
      src: url,
      href: anchor && safeUrl(anchor.getAttribute('href')) || '/',
      alt: logo.getAttribute('alt') || 'TractorBel Tratores e Peças',
      width: Number(logo.getAttribute('width')) || 400,
      height: Number(logo.getAttribute('height')) || 96
    };
  }
  function mountHeader() {
    if (!cfg.topo.ativo || doc.getElementById('tb26-header')) return;
    var native = doc.querySelector('#cabecalho') || doc.querySelector('header');
    if (!native) { warn('Cabeçalho nativo não identificado, mantido sem alterações.'); return; }
    var header = e('header', 'tb26-header'); header.id = 'tb26-header';
    var top = e('div', 'tb26-header__wrap tb26-container');
    var panelLogo = nativeStoreLogo(native);
    var brand = link(panelLogo ? panelLogo.href : '/', 'tb26-logo');
    function showBrandText() {
      brand.replaceChildren(e('span', 'tb26-logo__fallback', 'TRACTORBEL'));
    }
    if (panelLogo) {
      var brandImage = e('img');
      brandImage.src = panelLogo.src;
      brandImage.alt = panelLogo.alt;
      brandImage.width = panelLogo.width;
      brandImage.height = panelLogo.height;
      brandImage.loading = 'eager';
      brandImage.decoding = 'async';
      brandImage.addEventListener('error', function () {
        warn('Não foi possível carregar a logo definida no painel da LI.');
        showBrandText();
      }, {once:true});
      brand.appendChild(brandImage);
      state.logo = {origem:'painel Loja Integrada',src:panelLogo.src};
    } else {
      showBrandText();
      warn('A logo nativa não foi localizada em #cabecalho .logo; exibindo nome da marca.');
      state.logo = {origem:'fallback-texto'};
    }
    var nav = e('nav', 'tb26-nav'); nav.id = 'tb26-menu'; nav.setAttribute('aria-label','Categorias principais');
    function createSubmenu(items, depth) {
      var ul = e('ul', depth === 2 ? 'tb26-nav__submenu' : 'tb26-nav__sublist');
      items.forEach(function(it){
        var li = e('li','tb26-nav__submenu-item');
        li.appendChild(link(it.href,'tb26-nav__submenu-link',it.title));
        if (it.children && it.children.length) li.appendChild(createSubmenu(it.children,depth+1));
        ul.appendChild(li);
      });
      return ul;
    }
    var allGroups=[];
    navItems().forEach(function (it,index) {
      var group = e('div','tb26-nav__group');
      group.appendChild(link(it.href,'tb26-nav__link',it.title));
      if (it.children && it.children.length) {
        group.classList.add('tb26-nav__group--has-submenu');
        var submenu = createSubmenu(it.children,2); submenu.id = 'tb26-submenu-'+index;
        var btn=e('button','tb26-nav__toggle');btn.type='button';btn.setAttribute('aria-label','Mostrar subcategorias de '+it.title);
        btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',submenu.id);
        btn.innerHTML='<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        btn.addEventListener('click',function(ev){
          ev.preventDefault();ev.stopPropagation();var open=!group.classList.contains('is-expanded');
          allGroups.forEach(function(g){g.classList.remove('is-expanded');var b=g.querySelector('.tb26-nav__toggle');if(b)b.setAttribute('aria-expanded','false');});
          group.classList.toggle('is-expanded',open);btn.setAttribute('aria-expanded',String(open));
        });
        group.appendChild(btn);group.appendChild(submenu);
      }
      nav.appendChild(group);allGroups.push(group);
    });
    var action = e('div', 'tb26-actions');
    var searchOpen = e('button', 'tb26-icon tb26-search-open', '⌕'); searchOpen.type = 'button'; searchOpen.setAttribute('aria-label', 'Abrir busca'); searchOpen.setAttribute('aria-expanded', 'false');
    var search = e('form', 'tb26-search'); search.method = 'get'; search.action = '/buscar'; search.role = 'search';
    var searchInput = e('input'); searchInput.type = 'search'; searchInput.name = 'q'; searchInput.placeholder = 'O que você procura?'; searchInput.setAttribute('aria-label', 'Buscar produtos');
    var searchSubmit = e('button', '', 'Buscar'); searchSubmit.type = 'submit'; append(search, searchInput, searchSubmit);
    searchOpen.addEventListener('click', function () { var open = header.classList.toggle('tb26-search-visible'); searchOpen.setAttribute('aria-expanded', String(open)); if (open) searchInput.focus(); });
    var account = link('/conta/index', 'tb26-icon tb26-account'); account.setAttribute('aria-label', 'Minha conta'); account.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>';
    var cart = e('button', 'tb26-icon tb26-cart'); cart.type = 'button'; cart.setAttribute('aria-label', 'Meu carrinho'); cart.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2 12h11l3-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>';
    var count = firstText(doc, ['#cabecalho .qtd-carrinho', '#cabecalho .carrinho .qtd-carrinho', '.carrinho .qtd-carrinho']);
    if (/^\d{1,3}$/.test(count)) cart.appendChild(e('span', 'tb26-cart__count', count));
    var menuBtn = e('button', 'tb26-icon tb26-mobile-toggle', '☰'); menuBtn.type = 'button'; menuBtn.setAttribute('aria-controls', 'tb26-menu'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir menu');
    function closeMenu() {
      header.classList.remove('tb26-menu-open'); menuBtn.setAttribute('aria-expanded','false');
      menuBtn.textContent='☰';
      allGroups.forEach(function(g){g.classList.remove('is-expanded');var b=g.querySelector('.tb26-nav__toggle');if(b)b.setAttribute('aria-expanded','false');});
    }
    menuBtn.addEventListener('click', function () {
      var open = !header.classList.contains('tb26-menu-open');
      if(!open)closeMenu();else {header.classList.add('tb26-menu-open');menuBtn.setAttribute('aria-expanded','true');menuBtn.textContent='×';}
    });
    nav.addEventListener('click',function(ev){ if(ev.target.closest('.tb26-nav__submenu-link, .tb26-nav__link'))closeMenu(); });
    doc.addEventListener('click',function(ev){ if(!header.contains(ev.target))closeMenu(); });
    doc.addEventListener('keydown',function(ev){if(ev.key==='Escape' && !ev.target.closest('#tb26-cart-drawer')){closeMenu();header.classList.remove('tb26-search-visible');searchOpen.setAttribute('aria-expanded','false');}});
    var scheduled=false;
    function setStickyState(){ scheduled=false;header.classList.toggle('is-scrolled',(win.scrollY||doc.documentElement.scrollTop||0)>18); }
    win.addEventListener('scroll',function(){if(!scheduled){scheduled=true;win.requestAnimationFrame(setStickyState);}}, {passive:true});
    append(action, searchOpen, account, cart, menuBtn); append(top, brand, nav, action); append(header, top, search);
    // Montar fora do .conteiner-principal elimina o espaço residual do tema
    // e mantém o sticky independente de wrappers com overflow/transform.
    var principal = native.closest('.conteiner-principal');
    if (principal && principal.parentNode === doc.body) doc.body.insertBefore(header, principal);
    else native.parentNode.insertBefore(header, native);
    native.classList.add('tb26-native-header');
    doc.body.classList.add('tb26-with-header'); state.header = true;
    setStickyState();
    if (cfg.carrinho.ativo) mountCartDrawer(cart);
    else cart.addEventListener('click', function () { location.assign('/carrinho/index'); });
  }

  // Nao altera quantidades, preco, sessao ou rotas de checkout da plataforma.
  var cartDrawerApi = null;
  function mountCartDrawer(trigger) {
    if (cartDrawerApi || doc.getElementById('tb26-cart-drawer') || !trigger) return;
    var drawer = e('div', 'tb26-cart-drawer');
    drawer.id = 'tb26-cart-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    var backdrop = e('button', 'tb26-cart-drawer__backdrop');
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Fechar carrinho');
    var panel = e('aside', 'tb26-cart-drawer__panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'tb26-cart-drawer-title');
    panel.tabIndex = -1;
    var head = e('div', 'tb26-cart-drawer__head');
    var titles = e('div', 'tb26-cart-drawer__titles');
    var overline = e('span', 'tb26-cart-drawer__eyebrow', 'TRACTORBEL');
    var title = e('h2', 'tb26-cart-drawer__title', 'Meu carrinho');
    title.id = 'tb26-cart-drawer-title';
    var subtitle = e('p', 'tb26-cart-drawer__subtitle', 'Confira os produtos antes de finalizar.');
    append(titles, overline, title, subtitle);
    var close = e('button', 'tb26-cart-drawer__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Fechar carrinho');
    append(head, titles, close);
    var main = e('div', 'tb26-cart-drawer__body');
    main.setAttribute('aria-live', 'polite');
    main.setAttribute('aria-atomic', 'true');
    var foot = e('div', 'tb26-cart-drawer__foot');
    append(panel, head, main, foot);
    append(drawer, backdrop, panel);
    doc.body.appendChild(drawer);
    trigger.setAttribute('aria-controls', drawer.id);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    var opened = false, previousFocus = null, previousOverflow = '', pending = null;
    var updateTimer = null, observed = null, observer = null;
    var cartLink = '/carrinho/index';

    function moneyFrom(text) {
      // Nunca interpretar placeholders de preco (R$ *** / --PRODUTO_PRECO_POR--).
      var matched = String(text || '').match(/R\$\s*(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}/g);
      return matched ? matched[matched.length - 1].replace(/\s+/g, ' ') : '';
    }
    function moneyValue(str) {
      var m = moneyFrom(str).match(/R\$\s*([\d.]+,\d{2})/);
      return m ? Number(m[1].replace(/\./g,'').replace(',','.')) : null;
    }
    function moneyBRL(value) { return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value); }
    function readInstallments(root) {
      if (!root) return '';
      var nodes = root.querySelectorAll('.parcelamento, .parcelas, .preco-parcelado, .preco-parcela, .valor-parcela, .condicoes-parcelamento, [data-parcelas], [data-installments]');
      for (var i=0;i<nodes.length;i++) {
        if (nodes[i].closest('.minicart-placeholder')) continue;
        var text=(nodes[i].getAttribute('data-parcelas') || nodes[i].getAttribute('data-installments') || textOf(nodes[i])).replace(/\s+/g,' ');
        var m=text.match(/(?:at[eé]\s*)?(\d{1,2})\s*x\s*(?:de\s*)?(R\$\s*(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2})(?:\s*(sem juros|com juros))?/i);
        if (m && Number(m[1])>=2 && Number(m[1])<=24) return (/(?:at[eé])/i.test(m[0])?'Até ':'')+Number(m[1])+'x de '+moneyFrom(m[2])+(m[3]?' '+m[3].toLowerCase():'');
      }
      return '';
    }
    function calculateSubtotal(items) {
      if (!items.length || items.some(function(it){return !it.price || !Number.isFinite(it.quantity) || it.quantity<1;})) return '';
      var sum=items.reduce(function(acc,it){return acc+moneyValue(it.price)*it.quantity;},0);
      return Number.isFinite(sum) ? moneyBRL(sum) : '';
    }
    function configuredInstallments(total) {
      var conf=cfg.carrinho && cfg.carrinho.parcelamento;
      if (!conf || conf.semJuros!==true || !Number.isInteger(Number(conf.maximo)) || !Number.isFinite(moneyValue(total))) return '';
      var max=Number(conf.maximo),number=moneyValue(total);
      if(max<2 || max>24 || number<=0) return '';
      var min=Number(conf.minimoParcela);
      if(Number.isFinite(min) && min>0) max=Math.min(max,Math.floor(number/min));
      if(max<2) return '';
      return 'Até '+max+'x de '+moneyBRL(number/max)+' sem juros';
    }
    function textOf(node) { return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
    function readQuantity(node) {
      var input = firstElement(node, ['input[name*=quantidade]', 'input[name*=qtd]', 'input.quantidade', '.quantidade input', 'input[type=number]']);
      var raw = input && input.value;
      if (!raw) {
        var qty = firstElement(node, ['[data-quantity]', '[data-qtd]', '.quantidade', '.qtd', '.qtde', '.item-quantidade']);
        raw = qty && (qty.getAttribute('data-quantity') || qty.getAttribute('data-qtd') || textOf(qty));
      }
      var match = String(raw || '').match(/^\s*(\d{1,4})\s*$/) || String(raw || '').match(/^\s*(?:Qtd\.?\s*:?\s*)?(\d{1,4})\s*(?:unidades?)?\s*$/i);
      return match ? Number(match[1]) : null;
    }
    function firstValidLink(node) {
      var anchors = [].slice.call(node.querySelectorAll('a[href]'));
      for (var i = 0; i < anchors.length; i++) {
        var href = anchors[i].getAttribute('href') || '';
        if (/^(#|javascript:)/i.test(href) || /\/carrinho(?:\/|$)|\/conta(?:\/|$)/i.test(href)) continue;
        var url = safeUrl(href);
        if (url && new URL(url).origin === location.origin) return { node: anchors[i], url: url };
      }
      return null;
    }
    function readLine(node) {
      // O tema da LI inclui templates com --PRODUTO_NOME--; nunca exibi-los.
      var found = firstValidLink(node);
      var name = firstText(node, ['.nome-produto', '.produto-nome', '.produto-info .nome', '.produto-info a', '.info-produto a', '.item-nome', '.nome a', '.nome', 'a.nome-produto']);
      if (!name && found) name = textOf(found.node);
      if (!name) {
        var anchors = [].slice.call(node.querySelectorAll('a[href]'));
        var namedAnchor = anchors.find(function (a) { return textOf(a) && !/carrinho|remover|excluir/i.test(textOf(a)); });
        if (namedAnchor) name = textOf(namedAnchor);
      }
      if (!name || /--[A-Z_]+--|carrinho vazio|ir para o carrinho/i.test(name) || /^R\$/.test(name)) return null;
      var photo = firstElement(node, ['.imagem-produto img', '.imagem img', '.produto-imagem img', 'img']);
      var src = photo && (photo.getAttribute('data-src') || photo.getAttribute('src') || '');
      var price = firstText(node, ['.preco-promocional', '.preco-venda', '.preco-produto', '.preco-por', '.item-preco', '.preco', '.valor']);
      return {
        title: name.slice(0, 240),
        url: found ? found.url : '',
        image: src && !/^data:/.test(src) ? safeUrl(src) : '',
        quantity: readQuantity(node),
        price: moneyFrom(price)
      };
    }
    function readLines(root, selectors) {
      for (var i = 0; i < selectors.length; i++) {
        var nodes = [].slice.call(root.querySelectorAll(selectors[i]));
        var items = [], keys = {};
        nodes.forEach(function (node) {
          var line = readLine(node);
          if (!line) return;
          var key = line.url || line.title;
          // Um mesmo produto com variantes pode ocupar linhas distintas.
          if (keys[key]) return;
          keys[key] = true;
          items.push(line);
        });
        if (items.length) return items.slice(0, 100);
      }
      return [];
    }
    function findTotal(root, selectors) {
      for (var i = 0; i < selectors.length; i++) {
        var n = root.querySelector(selectors[i]);
        var price = moneyFrom(textOf(n));
        if (price) return price;
      }
      return '';
    }
    function countFromHeader() {
      var node = firstElement(doc, [
        '#cabecalho .qtd-carrinho', '#cabecalho .carrinho .quantidade',
        '#cabecalho .carrinho .qtd', '#cabecalho [data-cart-count]'
      ]);
      if (!node) return null;
      var raw = node.getAttribute('data-cart-count') || textOf(node);
      var match = raw.match(/^(?:\s*)(\d{1,5})(?:\s*)$/);
      return match ? Number(match[1]) : null;
    }
    function nativeCart() {
      // A LI controla a estrutura nativa, que deve continuar intocada.
      var selectors = [
        '#cabecalho .carrinho-interno-ajax .produto',
        '#cabecalho .carrinho-interno-ajax li',
        '#cabecalho .carrinho-interno li',
        '#cabecalho .carrinho-interno .item',
        '#cabecalho .carrinho-produtos li',
        '.carrinho-interno-ajax .produto',
        '.carrinho-interno-ajax li',
        '.carrinho-interno li'
      ];
      var items = readLines(doc, selectors);
      var total = findTotal(doc, [
        '#cabecalho .carrinho-interno-ajax .carrino-total strong',
        '#cabecalho .carrinho-interno .carrino-total strong',
        '#cabecalho .carrinho-rodape .carrino-total strong',
        '#cabecalho .carrinho-interno .total strong',
        '#cabecalho .carrinho-interno .total .valor',
        '#cabecalho .carrinho-interno .total',
        '#cabecalho .carrinho-interno-ajax .total strong',
        '.carrinho-interno-ajax .carrino-total strong',
        '.carrinho-interno .carrino-total strong',
        '.carrinho-interno .total', '.carrinho-interno-ajax .total'
      ]);
      var count = countFromHeader();
      var nativeLink = doc.querySelector('#cabecalho .carrinho-interno a[href*="/carrinho"], #cabecalho .carrinho > a[href*="/carrinho"]');
      if (nativeLink) {
        var href = safeUrl(nativeLink.getAttribute('href'));
        if (href && new URL(href).origin === location.origin) cartLink = href;
      }
      return { items: items, total: total || calculateSubtotal(items), estimated: !total && !!calculateSubtotal(items), installments: readInstallments(doc.querySelector('#cabecalho .carrinho-interno-ajax') || doc.querySelector('#cabecalho .carrinho-interno')), count: count, source: 'minicarrinho-nativo' };
    }
    function cartPage(parsed) {
      var items = readLines(parsed, [
        '.tabela-carrinho tbody tr', '.pagina-carrinho .tabela-carrinho tr',
        '.carrinho-principal .tabela-carrinho tr',
        '.carrinho-produtos .produto', '.pagina-carrinho .carrinho-item'
      ]);
      var total = findTotal(parsed, [
        '.tabela-carrinho .subtotal .valor', '.pagina-carrinho .subtotal .valor',
        '.tabela-carrinho .total-itens strong', '.total-itens strong',
        '.total-subtotal strong', '.subtotal .valor',
        '.pagina-carrinho .subtotal .valor', '.tabela-carrinho tfoot .subtotal',
        '.carrino-total strong'
      ]);
      var explicitEmpty = !!parsed.querySelector('.carrinho-vazio, .carrinho-empty, .carrinho-sem-produtos');
      var paymentScope = firstElement(parsed,['.resumo-carrinho','.carrinho-rodape','.total-carrinho','.pagamento-carrinho','.resumo-pedido']);
      return { items: items, total: total || calculateSubtotal(items), estimated: !total && !!calculateSubtotal(items), installments: readInstallments(paymentScope), count: null, empty: explicitEmpty, source: 'carrinho-pagina' };
    }
    function updateBadge(count) {
      if (count === null || !Number.isFinite(count)) return;
      var badge = trigger.querySelector('.tb26-cart__count');
      if (!badge) { badge = e('span', 'tb26-cart__count'); trigger.appendChild(badge); }
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
      trigger.setAttribute('aria-label', count ? 'Meu carrinho, ' + count + ' itens' : 'Meu carrinho, vazio');
    }
    function render(data, mode) {
      var items = data && data.items || [];
      main.replaceChildren(); foot.replaceChildren();
      if (mode === 'loading') {
        var loading = e('div', 'tb26-cart-drawer__status');
        append(loading, e('span', 'tb26-cart-drawer__spinner'), e('p', '', 'Carregando seu carrinho...'));
        main.appendChild(loading);
      } else if (items.length) {
        var list = e('div', 'tb26-cart-drawer__list');
        items.forEach(function (item) {
          var row = e('article', 'tb26-cart-drawer__item');
          var figure = e('div', 'tb26-cart-drawer__image');
          if (item.image) {
            var img = e('img'); img.src = item.image; img.alt = item.title;
            img.loading = 'lazy'; img.decoding = 'async'; img.width = 88; img.height = 88;
            figure.appendChild(img);
          } else figure.appendChild(e('span', '', '▣'));
          var info = e('div', 'tb26-cart-drawer__info');
          var label = item.url ? link(item.url, 'tb26-cart-drawer__item-title', item.title) : e('strong', 'tb26-cart-drawer__item-title', item.title);
          info.appendChild(label);
          if (item.quantity !== null) info.appendChild(e('span', 'tb26-cart-drawer__qty', 'Quantidade: ' + item.quantity));
          if (item.price) info.appendChild(e('strong', 'tb26-cart-drawer__price', item.price));
          append(row, figure, info); list.appendChild(row);
        });
        main.appendChild(list);
        var summary = e('div', 'tb26-cart-drawer__summary');
        var total = data.total || calculateSubtotal(items);
        if (total) {
          var totalLabel = data.estimated ? 'Subtotal estimado dos itens' : 'Total dos itens';
          append(summary, e('span', '', totalLabel), e('strong', '', total));
        } else append(summary,e('span','','Total dos itens'),e('span','tb26-cart-drawer__pending','Consulte no carrinho'));
        foot.appendChild(summary);
        var installment = data.installments || configuredInstallments(total);
        var payment = e('div', 'tb26-cart-drawer__installments');
        append(payment,e('span','tb26-cart-drawer__installments-icon','▣'),e('span','',installment || 'Confira as opções de parcelamento no carrinho'));
        foot.appendChild(payment);
        foot.appendChild(e('small', 'tb26-cart-drawer__note', 'Condições de pagamento, descontos e frete confirmados pela Loja Integrada.'));
      } else {
        var empty = e('div', 'tb26-cart-drawer__status');
        var icon = e('span', 'tb26-cart-drawer__empty-icon', mode === 'empty' ? '🛒' : 'ⓘ');
        var message = mode === 'empty' ? 'Seu carrinho está vazio' : 'Não foi possível carregar o resumo agora';
        var detail = mode === 'empty' ? 'Encontre peças e equipamentos para sua operação.' : 'Consulte seus produtos diretamente no carrinho da loja.';
        append(empty, icon, e('h3', '', message), e('p', '', detail));
        main.appendChild(empty);
      }
      if (mode !== 'loading') {
        var go = link(cartLink, 'tb26-cart-drawer__checkout', mode === 'empty' ? 'IR À LOJA' : 'VER CARRINHO E FINALIZAR');
        if (mode === 'empty') go.href = '/';
        foot.appendChild(go);
        var back = e('button', 'tb26-cart-drawer__continue', 'Continuar comprando');
        back.type = 'button'; back.addEventListener('click', closeDrawer);
        foot.appendChild(back);
      }
      if (data) updateBadge(data.count);
    }
    function fetchCartFallback(existing) {
      if (!opened) return;
      if (pending) pending.abort();
      pending = new AbortController();
      var controller = pending;
      if (!existing || !existing.items || !existing.items.length) render(null, 'loading');
      fetch(cartLink, { method: 'GET', credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'text/html' }, signal: controller.signal })
        .then(function (r) {
          if (!r.ok || !r.headers.get('content-type') || r.headers.get('content-type').indexOf('text/html') < 0 || new URL(r.url).origin !== location.origin) throw Error('Carrinho indisponivel');
          return r.text();
        })
        .then(function (html) {
          if (!opened || controller.signal.aborted) return;
          var data = cartPage(new DOMParser().parseFromString(html, 'text/html'));
          var count = countFromHeader();
          if (existing && existing.items && existing.items.length) {
            var merged = {items:existing.items,total:existing.estimated ? (data.total || existing.total) : (existing.total || data.total),
              estimated:existing.estimated && !data.total,installments:existing.installments || data.installments,
              count:existing.count===null ? count : existing.count};
            render(merged,'items');
          } else if (data.items.length) { data.count=count;render(data, 'items'); }
          else if (data.empty || count === 0) render({items:[], count:0}, 'empty');
          else render({items:[], count:count}, 'unavailable');
        })
        .catch(function (err) { if (opened && !controller.signal.aborted) { warn('Carrinho lateral: ' + err.message); if (existing && existing.items && existing.items.length) render(existing, 'items'); else render({items:[], count:countFromHeader()}, 'unavailable'); } })
        .finally(function () { if (pending === controller) pending = null; });
    }
    function refreshDrawer(fallback) {
      var data = nativeCart();
      updateBadge(data.count);
      if (!opened) return;
      if (data.items.length) {
        render(data, 'items');
        if (fallback && (!data.total || data.estimated)) fetchCartFallback(data);
        else if (pending) { pending.abort(); pending = null; }
      } else if (data.count === 0) {
        if (pending) { pending.abort(); pending = null; }
        render(data, 'empty');
      } else if (fallback) fetchCartFallback();
      else if (!pending) render({items:[], count:data.count}, 'unavailable');
    }
    function openDrawer(ev) {
      if (ev) ev.preventDefault();
      if (opened) return;
      previousFocus = doc.activeElement;
      previousOverflow = doc.body.style.overflow;
      opened = true;
      drawer.inert = false;
      drawer.setAttribute('aria-hidden', 'false');
      drawer.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      doc.body.style.overflow = 'hidden';
      close.focus({preventScroll:true});
      refreshDrawer(true);
    }
    function closeDrawer() {
      if (!opened) return;
      opened = false;
      if (pending) { pending.abort(); pending = null; }
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.inert = true;
      trigger.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = previousOverflow;
      if (previousFocus && doc.contains(previousFocus) && previousFocus.focus) previousFocus.focus({preventScroll:true});
    }
    function trapKeys(ev) {
      if (!opened) return;
      if (ev.key === 'Escape') { ev.preventDefault(); closeDrawer(); return; }
      if (ev.key !== 'Tab') return;
      var focusable = [].slice.call(panel.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')).filter(function (n) { return n.getClientRects().length; });
      if (!focusable.length) { ev.preventDefault(); panel.focus(); return; }
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (ev.shiftKey && doc.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && doc.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
    function watchNative() {
      var host = doc.getElementById('cabecalho');
      if (!host || typeof MutationObserver !== 'function') return;
      observed = host;
      observer = new MutationObserver(function () {
        if (updateTimer) win.clearTimeout(updateTimer);
        updateTimer = win.setTimeout(function () { updateTimer = null; refreshDrawer(false); }, 120);
      });
      observer.observe(observed, { childList:true, characterData:true, subtree:true, attributes:false });
    }
    trigger.addEventListener('click', openDrawer);
    backdrop.addEventListener('click', closeDrawer);
    close.addEventListener('click', closeDrawer);
    doc.addEventListener('keydown', trapKeys);
    watchNative();
    refreshDrawer(false);
    cartDrawerApi = Object.freeze({ open:openDrawer, close:closeDrawer, refresh:function () { refreshDrawer(true); }, get aberto() { return opened; } });
    state.cart = {ativo:true, fonte:'minicarrinho LI (carrino-total) + consulta oficial sob demanda',parcelamento:'extraido da LI ou configuracao verificada'};
  }

  function getProducts(scope, limit) {
    var nodes = [].slice.call(scope.querySelectorAll('.listagem-item'));
    if (!nodes.length) nodes = [].slice.call(scope.querySelectorAll('li.produto, .produto-miniatura'));
    var seen = new Set();
    return nodes.map(function (item) {
      var a = firstElement(item, ['.nome-produto a[href]', 'a.nome-produto[href]', '.imagem-produto a[href]', 'a[href*="/produto/"]', 'a[href]']);
      var title = firstText(item, ['.nome-produto', '.nome-produto a', '.produto-nome', 'h3']);
      var img = firstElement(item, ['.imagem-produto img', '.imagem img', 'img']);
      if (!a || !title || !img) return null;
      var url = safeUrl(a.getAttribute('href'));
      if (!url || seen.has(url)) return null;
      seen.add(url);
      var src = img.getAttribute('data-src') || img.getAttribute('data-original') || img.currentSrc || img.getAttribute('src') || '';
      if (/^data:image\/gif/.test(src) && img.getAttribute('data-src')) src = img.getAttribute('data-src');
      var price = firstText(item, ['.preco-promocional', '.preco-produto .preco-promocional', '.preco-produto strong', '.preco-venda', '.preco-produto']);
      var pix = firstText(item, ['.preco-a-vista', '.desconto-a-vista', '.preco-pix', '.preco-avista']);
      var unavailable = /(^R\$\s*\*+|consultar preço|ver preço)/i.test(price) || !price;
      return { title: title, url: url, image: safeUrl(src), price: unavailable ? '' : price, pix: pix && !/\*+/.test(pix) ? pix : '', unavailable: unavailable };
    }).filter(Boolean).slice(0, limit || 12);
  }
  function findNativeShelf(partial) {
    var lists = [].slice.call(doc.querySelectorAll('#corpo .listagem, #corpo .listagem-linha, #corpo .vitrine'));
    var wanted = lists.find(function (n) { var t = firstText(n, ['.titulo-categoria', '.titulo', 'h2']); return t.toLowerCase().indexOf(partial.toLowerCase()) >= 0 && n.querySelector('.listagem-item'); });
    if (partial === 'Mais vendidos') return wanted || null;
    return wanted || (partial === 'Destaques' ? lists[1] : lists[0]) || doc.querySelector('#corpo');
  }
  function productCard(p) {
    var a = link(p.url, 'tb26-product');
    var photo = e('div', 'tb26-product__image'); var img = e('img'); img.src = p.image || asset('peca1.webp'); img.loading = 'lazy'; img.decoding = 'async'; img.width = 320; img.height = 320; img.alt = p.title; append(photo, img);
    var detail = e('div', 'tb26-product__details'); append(detail, e('h3', 'tb26-product__title', p.title));
    if (p.price) detail.appendChild(e('strong', 'tb26-product__price', p.price));
    else detail.appendChild(e('span', 'tb26-product__consult', 'Consulte o preço'));
    if (p.pix) detail.appendChild(e('small', 'tb26-product__pix', p.pix));
    append(a, photo, detail, e('span', 'tb26-product__cta', 'VER PRODUTO')); return a;
  }
  function carousel(name, title, products, sectionCls) {
    var sec = e('section', 'tb26-section tb26-carousel ' + (sectionCls || ''));
    sec.dataset.tb26Section = name;
    var container = e('div', 'tb26-container');
    var heading = e('h2', 'tb26-title', title); var view = e('div', 'tb26-carousel__track'); view.setAttribute('tabindex', '0'); view.setAttribute('aria-label', title);
    products.forEach(function (product) { view.appendChild(productCard(product)); });
    var ctrl = e('div', 'tb26-carousel__controls');
    var prev = e('button', 'tb26-arrow', '‹'); prev.type = 'button'; prev.setAttribute('aria-label', 'Ver anteriores');
    var next = e('button', 'tb26-arrow', '›'); next.type = 'button'; next.setAttribute('aria-label', 'Ver próximos');
    function step(dir) { var item = view.querySelector('.tb26-product'); view.scrollBy({left: dir * ((item && item.getBoundingClientRect().width || 275) + 14), behavior: 'smooth'}); }
    prev.addEventListener('click', function () { step(-1); }); next.addEventListener('click', function () { step(1); });
    append(ctrl, prev, next); append(container, heading, view, ctrl); append(sec, container); return sec;
  }
  // Carrossel real de marcas: oito logos PNG separados a partir da arte aprovada.
  // Nunca usar a imagem horizontal "Novo Projeto (11).png" como uma unica marca.
  function brands() {
    var section = e('section', 'tb26-brands');
    section.dataset.tb26Section = 'marcas';
    section.setAttribute('aria-label', 'Marcas atendidas pela TractorBel');
    var container = e('div', 'tb26-container');
    var title = e('h2', 'tb26-brands__title', cfg.conteudo.fraseMarcas);
    append(container, title);
    if (!cfg.marcas.ativo) { append(section, container); return section; }

    var frame = e('div', 'tb26-brands__frame');
    var track = e('div', 'tb26-brands__track');
    track.id = 'tb26-brands-track';
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carrossel');
    track.setAttribute('aria-label', 'Marcas de máquinas e equipamentos');
    track.tabIndex = 0;

    var brandsList = (Array.isArray(cfg.marcas.itens) ? cfg.marcas.itens : [])
      .filter(function (entry) { return entry && entry.ativo !== false && entry.imagem && entry.nome; })
      .map(function (entry) { return [String(entry.imagem), String(entry.nome)]; });
    if (!brandsList.length) { section.appendChild(container); return section; }
    var base = String(cfg.marcas.imagensBase || 'https://tractorbel-2026.vercel.app/assets/marcas/');
    if (!/\/$/.test(base)) base += '/';
    // O dominio de desenvolvimento pode ser trocado pelo CDN da LI apos upload dos recortes.
    var baseUrl = safeUrl(base) || 'https://tractorbel-2026.vercel.app/assets/marcas/';
    brandsList.forEach(function (entry, i) {
      var item = e('div', 'tb26-brands__item');
      item.setAttribute('role', 'group');
      item.setAttribute('aria-roledescription', 'marca');
      item.setAttribute('aria-label', (i + 1) + ' de ' + brandsList.length + ': ' + entry[1]);
      var img = e('img');
      img.src = baseUrl + entry[0];
      img.alt = 'Logo ' + entry[1];
      img.width = 160;
      img.height = 160;
      img.loading = i < 3 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', function () {
        // Degradacao elegante caso algum arquivo ainda nao esteja no CDN.
        item.replaceChildren(e('span', 'tb26-brands__fallback', entry[1]));
        warn('Marca sem arquivo: ' + entry[0]);
      }, {once:true});
      item.appendChild(img);
      track.appendChild(item);
    });
    frame.appendChild(track);
    var controls = e('div', 'tb26-brands__controls');
    var previous = e('button', 'tb26-brands__arrow', '‹');
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Marcas anteriores');
    previous.setAttribute('aria-controls', track.id);
    var next = e('button', 'tb26-brands__arrow', '›');
    next.type = 'button';
    next.setAttribute('aria-label', 'Próximas marcas');
    next.setAttribute('aria-controls', track.id);
    var status = e('span', 'tb26-brands__status');
    status.setAttribute('aria-live', 'off');
    function visibleCount() {
      if (win.matchMedia('(max-width: 767px)').matches) return Math.max(1, Math.min(3, Number(cfg.marcas.porRolagemMobile) || 3));
      if (win.matchMedia('(max-width: 1199px)').matches) return 5;
      return 8;
    }
    function measureStep() {
      var child = track.querySelector('.tb26-brands__item');
      if (!child) return 0;
      var style = getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap) || 0;
      return (child.getBoundingClientRect().width + gap) * visibleCount();
    }
    function refreshControls() {
      var max = Math.max(0, track.scrollWidth - track.clientWidth);
      controls.hidden = max <= 2;
      previous.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft >= max - 2;
      var first = track.querySelector('.tb26-brands__item');
      var unit = first ? first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0) : 1;
      var start = Math.min(brandsList.length, Math.round(track.scrollLeft / Math.max(unit, 1)) + 1);
      status.textContent = 'Exibindo marcas ' + start + ' a ' + Math.min(brandsList.length, start + visibleCount() - 1);
    }
    function move(direction) {
      var amount = measureStep();
      if (!amount) return;
      var reduce = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({left: direction * amount, behavior: reduce ? 'auto' : 'smooth'});
    }
    previous.addEventListener('click', function () { move(-1); });
    next.addEventListener('click', function () { move(1); });
    track.addEventListener('scroll', refreshControls, {passive: true});
    win.addEventListener('resize', refreshControls, {passive: true});
    append(controls, previous, status, next);
    append(frame, controls);
    append(container, frame);
    append(section, container);
    // Chamado apos o layout concluir o calculo das larguras.
    win.requestAnimationFrame(refreshControls);
    state.marcas = {fonte:'logos individuais', quantidade:brandsList.length, mobilePorRolagem:3};
    return section;
  }
  // Componentes independentes para espelhar o layout aprovado.
  // Cada item de beneficio tem seu proprio controle ativo/texto em defaults.beneficios.itens.
  function benefits() {
    var bar = e('section', 'tb26-benefits');
    bar.dataset.tb26Section = 'beneficios';
    bar.setAttribute('aria-label', 'Vantagens de comprar na TractorBel');
    var inner = e('div', 'tb26-container tb26-benefits__grid');
    var icons = [
      '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
      '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 16h5"/>',
      '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
      '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
    ];
    (Array.isArray(cfg.beneficios.itens) ? cfg.beneficios.itens : []).forEach(function (item, index) {
      if (!item || item.ativo === false || !item.texto) return;
      var cell = e('div', 'tb26-benefits__item');
      var icon = e('span', 'tb26-benefits__icon');
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[index] || icons[0]) + '</svg>';
      append(cell, icon, e('span', 'tb26-benefits__text', String(item.texto)));
      inner.appendChild(cell);
    });
    if (!inner.children.length) return null;
    bar.appendChild(inner);
    state.beneficios = {quantidade:inner.children.length};
    return bar;
  }
  // Imagem aprovada e uma arte SEM o texto; insere o conteudo em HTML editavel e acessivel.
  function institutionalBanner() {
    var cfgBanner = cfg.institucional;
    var sec = e('section', 'tb26-institutional-banner tb26-container');
    sec.dataset.tb26Section = 'institucional';
    var art = e('div', 'tb26-institutional-banner__art');
    var photo = image('vendedores.webp', '', 1719, 402);
    photo.setAttribute('aria-hidden', 'true');
    var copy = e('div', 'tb26-institutional-banner__copy');
    var title = e('h2', 'tb26-institutional-banner__title', String(cfgBanner.titulo || ''));
    var description = e('p', 'tb26-institutional-banner__description');
    description.appendChild(doc.createTextNode(String(cfgBanner.textoAntes || '')));
    var emphasis = e('strong', '', String(cfgBanner.destaque || ''));
    description.appendChild(emphasis);
    description.appendChild(doc.createTextNode(String(cfgBanner.textoDepois || '')));
    append(copy, title, description);
    append(art, photo, copy);
    sec.appendChild(art);
    state.institucional = {textoAtivo:true, imagem:asset('vendedores.webp')};
    return sec;
  }
  function introSection() {
    var wrap = e('div', 'tb26-intro');
    wrap.dataset.tb26Section = 'introducao';
    if (cfg.marcas && cfg.marcas.ativo) wrap.appendChild(brands());
    if (cfg.beneficios && cfg.beneficios.ativo) {
      var bar = benefits();
      if (bar) wrap.appendChild(bar);
    }
    if (cfg.institucional && cfg.institucional.ativo) wrap.appendChild(institutionalBanner());
    return wrap.childElementCount ? wrap : null;
  }
  function categories() {
    var sec = e('section', 'tb26-categories'); setBackground(sec, 'bg-pecas.webp', 'linear-gradient(#201811b8,#201811b8)');
    var inner = e('div', 'tb26-container'); inner.appendChild(e('h2', 'tb26-title', 'ENCONTRE AS PEÇAS CERTAS PARA SUA DEMANDA'));
    var grid = e('div', 'tb26-categories__grid');
    [['peca1.webp', 'Peças novas', '/pecas-novas'], ['peca2.webp', 'Peças seminovas', '/pecas-seminovas'], ['peca3.webp', 'Equipamentos', '/equipamentos-novos']].forEach(function (it) { var a = link(it[2], 'tb26-categories__card'); a.setAttribute('aria-label', it[1]); a.appendChild(image(it[0], it[1], 592, 530)); grid.appendChild(a); }); append(inner, grid); append(sec, inner); return sec;
  }
  function solutions() {
    var sec = e('section', 'tb26-solutions'); var inner = e('div', 'tb26-container');
    inner.appendChild(e('h2', 'tb26-title tb26-title--dark', 'TEMOS AS MELHORES SOLUÇÕES PARA O SEU NEGÓCIO'));
    var grid = e('div', 'tb26-solutions__grid');
    [['minibox1.webp', 'Mineração e Extração', '/pecas-novas'], ['minibox3.webp', 'Construção Civil', '/pecas-novas'], ['minibox2.webp', 'Construção Pesada', '/pecas-novas'], ['minibox4.webp', 'Terraplanagem, Pedreiras e Areais', '/pecas-novas']].forEach(function (it) {
      var a = link(it[2], 'tb26-solutions__card'); a.setAttribute('aria-label', 'Soluções para ' + it[1]); a.appendChild(image(it[0], it[1], 480, 685)); grid.appendChild(a);
    }); append(inner, grid); append(sec, inner); return sec;
  }
  function company() {
    var sec = e('section', 'tb26-company'); var inner = e('div', 'tb26-container tb26-company__grid');
    var info = e('div', 'tb26-company__info'); setBackground(info, 'novo-projeto-6.webp'); append(info, image('logo-empresa-footer.webp', 'TractorBel e TTL', 698, 103), e('p', '', cfg.conteudo.sobre));
    info.appendChild(e('p', '', 'Peças, equipamentos e atendimento especializado para manter o seu maquinário em movimento.'));
    var contact = e('div', 'tb26-company__contact');
    contact.appendChild(image('box-contato.webp', 'Atendimento especializado TractorBel', 586, 820));
    var text = e('div', 'tb26-company__contact-text');
    append(text, e('small', '', 'Não fique com o seu maquinário parado!'), e('h2', '', 'Fale conosco'), link('https://wa.me/' + String(cfg.conteudo.whatsapp).replace(/\D/g, ''), '', 'WhatsApp  (31) 9 9657-3930'), link('tel:+553121051455', '', 'Suporte  ' + cfg.conteudo.telefone), link('mailto:' + cfg.conteudo.email, '', cfg.conteudo.email));
    append(contact, text); append(inner, info, contact); append(sec, inner); return sec;
  }
  function instagram() {
    var sec = e('section', 'tb26-instagram'); var inner = e('div', 'tb26-container');
    inner.appendChild(e('h2', 'tb26-title tb26-title--dark tb26-title--left', 'ÚLTIMAS POSTAGENS'));
    var a = cfg.conteudo.instagram ? link(cfg.conteudo.instagram, 'tb26-instagram__feed') : e('div','tb26-instagram__feed');
    if(cfg.conteudo.instagram){ a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', 'Acompanhe a TractorBel nas redes sociais'); }
    a.appendChild(image('insta.webp', 'Publicações da TractorBel sobre máquinas, peças e ofertas', 1720, 522)); append(inner, a); append(sec, inner); return sec;
  }
  // Animacao uma unica vez ao entrar no viewport. Transform/opacity nao provocam CLS.
  // Nao aplicar fade ao topo inteiro (LCP); elementos institucionais abaixo sao elegiveis.
  function setupMotion(root) {
    if (!root || !cfg.movimento || cfg.movimento.ativo === false) return;
    var motion = cfg.movimento;
    var reduce = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    doc.body.classList.toggle('tb26-hover-motion', motion.hover !== false);
    if (motion.fadeIn === false || !('IntersectionObserver' in win)) return;

    function cap(n, min, max, fallback) {
      n = Number(n);
      return isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    }
    doc.body.style.setProperty('--tb26-reveal-duration', cap(motion.duracao, 200, 1400, 740) + 'ms');
    doc.body.style.setProperty('--tb26-reveal-distance', cap(motion.distancia, 0, 65, 25) + 'px');
    var gap = cap(motion.intervalo, 0, 200, 80);

    if (!motionObserver) {
      motionObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          if (!entry.target.classList.contains('tb26-visible')) {
            entry.target.classList.add('tb26-visible');
            state.motion.revelados++;
          }
          observer.unobserve(entry.target);
        });
      }, { root: null, rootMargin: '0px 0px -32px 0px', threshold: 0.08 });
    }
    var selectors = [
      '.tb26-benefits__item', '.tb26-institutional-banner__art', '.tb26-title',
      '.tb26-product', '.tb26-categories__card', '.tb26-miniatures__art',
      '.tb26-solutions__card', '.tb26-company__info', '.tb26-company__contact',
      '.tb26-instagram__feed', '.tb26-footer__col', '.tb26-footer__bottom'
    ];
    // Inclui a home e o footer; o segundo parametro permite registrar produtos carregados por fetch.
    var targets = root.querySelectorAll(selectors.join(','));
    [].forEach.call(targets, function (el) {
      if (motionSeen.has(el)) return;
      motionSeen.add(el);
      var group = el.parentElement;
      var siblings = group ? [].filter.call(group.children, function (child) {
        return child.matches && (child.matches('.tb26-product, .tb26-categories__card, .tb26-solutions__card, .tb26-benefits__item, .tb26-footer__col'));
      }) : [];
      var order = Math.max(0, siblings.indexOf(el)) % 5;
      el.style.setProperty('--tb26-reveal-delay', order * gap + 'ms');
      el.classList.add('tb26-reveal');
      state.motion.observados++;
      // Nunca ocultar componentes que ficaram para cima do viewport ao ativar a animacao.
      if (el.getBoundingClientRect().bottom <= 0) {
        el.classList.add('tb26-visible');
        state.motion.revelados++;
      } else motionObserver.observe(el);
    });
    if (targets.length) {
      doc.body.classList.add('tb26-motion-ready');
      state.motion.ativo = true;
    }
  }

  function mountHome() {
    if (!isHome || !cfg.home.ativo || doc.getElementById('tb26-home')) return;
    var native = doc.querySelector('#corpo');
    if (!native) { warn('Elemento #corpo não identificado; home nativa preservada.'); return; }
    var root = e('main', 'tb26-home'); root.id = 'tb26-home';
    var intro = introSection();
    if (intro) root.appendChild(intro);
    var homeProducts = getProducts(findNativeShelf('Destaques') || native, Math.max(10, cfg.vitrines.destaques));
    var latest = getProducts(findNativeShelf('Lançamentos') || native, Math.max(10, cfg.vitrines.maisVendidos));
    var bestNative = findNativeShelf('Mais vendidos');
    var best = bestNative ? getProducts(bestNative,Math.max(10,cfg.vitrines.maisVendidos)) : [];
    if (cfg.vitrines.ativo && homeProducts.length) { root.appendChild(carousel('destaques', 'PRODUTOS EM DESTAQUE', homeProducts, 'tb26-carousel--featured')); state.products.destaques = homeProducts.length; }
    append(root, categories());
    var miniatureProducts = latest.filter(function (p) { return /miniatura/i.test(p.title); });
    if (cfg.vitrines.ativo) {
      var miniSec = e('section', 'tb26-miniatures'); miniSec.id = 'tb26-miniatures';
      var miniInner = e('div', 'tb26-container'); miniInner.appendChild(e('h2', 'tb26-title tb26-title--left', 'MINIATURAS EXCLUSIVAS'));
      var layout = e('div', 'tb26-miniatures__layout'); var art = e('div', 'tb26-miniatures__art');
      setBackground(art, 'bg-miniaturas.webp');
      var holder = e('div', 'tb26-miniatures__products');
      append(layout, art, holder); append(miniInner, layout); append(miniSec, miniInner); root.appendChild(miniSec);
      function fillMini(items) { holder.replaceChildren(); if (items.length) { var slider = carousel('miniaturas', '', items.slice(0, cfg.vitrines.miniaturas), 'tb26-miniatures__slider'); holder.appendChild(slider); state.products.miniaturas = items.length; } else { holder.appendChild(link('/miniaturas', 'tb26-miniatures__fallback', 'VER TODAS AS MINIATURAS →')); warn('Miniaturas sem resposta; exibido link de categoria.'); } if (state.home) setupMotion(holder); }
      if (miniatureProducts.length >= 3) fillMini(miniatureProducts);
      else {
        // Consulta extra de categoria contabiliza pageview na LI: buscar apenas quando a seção estiver próxima.
        holder.appendChild(e('span','tb26-miniatures__loading','Carregando miniaturas...'));
        var startedMini=false;
        function loadMini() {
          if(startedMini)return;
          startedMini=true;
          fetch('/miniaturas', { credentials: 'same-origin' }).then(function (resp) { if (!resp.ok) throw Error('Resposta ' + resp.status); return resp.text(); }).then(function (html) { return getProducts(new DOMParser().parseFromString(html, 'text/html'), cfg.vitrines.miniaturas); }).then(fillMini).catch(function () { fillMini(miniatureProducts); });
        }
        if ('IntersectionObserver' in win) {
          var miniObserver=new IntersectionObserver(function(entries,observer){
            entries.forEach(function(entry){ if(entry.isIntersecting){observer.disconnect();loadMini();} });
          },{rootMargin:'500px 0px'});
          miniObserver.observe(miniSec);
        } else loadMini();
      }
    }
    if (cfg.vitrines.ativo && (best.length || latest.length)) {
      var source = best.length ? best : latest;
      var heading = best.length ? 'PEÇAS MAIS VENDIDAS' : 'PEÇAS EM DESTAQUE';
      root.appendChild(carousel('mais-vendidas', heading, source, 'tb26-carousel--best'));
      state.products.maisVendidos = best.length;
      if(!best.length)warn('Vitrine mais vendidos ausente na LI: exibido titulo neutro para nao confundir lançamentos com ranking de vendas.');
    }
    append(root, solutions(), company(), instagram());
    native.parentNode.insertBefore(root, native); native.classList.add('tb26-native-home'); doc.body.classList.add('tb26-with-home'); state.home = true;
    setupMotion(root);
  }
  function mountFooter() {
    if (!cfg.rodape.ativo || doc.getElementById('tb26-footer')) return;
    var native = doc.querySelector('#rodape') || doc.querySelector('footer'); if (!native) { warn('Rodapé nativo não identificado.'); return; }
    var footer = e('footer', 'tb26-footer'); footer.id = 'tb26-footer';
    var left = e('div', 'tb26-footer__art'); setBackground(left, 'bg-footer.webp');
    var social = e('div', 'tb26-footer__social'); social.appendChild(e('span', '', 'SIGA-NOS:'));
    // Fontes reais: prioriza links do painel da LI, nunca aponta para perfil generico.
    var instagramURL = cfg.conteudo.instagram;
    var facebookURL = cfg.conteudo.facebook;
    var instagramNative = native.querySelector('a[href*="instagram.com/"]');
    var facebookNative = native.querySelector('a[href*="facebook.com/"]');
    if (!instagramURL && instagramNative) instagramURL=instagramNative.href;
    if (!facebookURL && facebookNative) facebookURL=facebookNative.href;
    if (instagramURL) social.appendChild(link(instagramURL, 'tb26-footer__social-icon', 'Instagram'));
    if (facebookURL) social.appendChild(link(facebookURL, 'tb26-footer__social-icon', 'Facebook'));
    left.appendChild(social);
    var right = e('div', 'tb26-footer__right'); var grid = e('div', 'tb26-footer__grid');
    function column(title, items) { var c = e('div', 'tb26-footer__col'); c.appendChild(e('h3', '', title)); items.forEach(function (item) { c.appendChild(link(item[1], '', item[0])); }); return c; }
    append(grid,
      column('ÁREA DO CLIENTE', [['Minha Conta', '/conta/index'], ['Meus Pedidos', '/conta/pedido/listar'], ['Cadastre-se', '/conta/criar'], ['Fale Conosco', '/contato']]),
      column('INSTITUCIONAL', [['Sobre Nós', '/pagina/sobre-nos.html'], ['Frete & Entrega', '/pagina/frete-e-entrega.html'], ['Trocas & Devoluções', '/pagina/trocas-e-devolucoes.html'], ['Política de Privacidade', '/pagina/politica-de-privacidade.html']])
    );
    var secure = e('div', 'tb26-footer__col tb26-footer__secure'); secure.appendChild(e('h3', '', 'COMPRA SEGURA'));
    function copyLogos(selectors, parent, limit) {
      var seen = new Set(); var wrap = e('div','tb26-footer__native-seals');
      [].slice.call(native.querySelectorAll(selectors)).forEach(function(n) {
        var src=n.getAttribute('data-src') || n.getAttribute('src') || '';
        var clean=safeUrl(src);
        if(!clean || seen.has(clean) || seen.size>=limit)return;
        seen.add(clean); var img=e('img');img.src=clean;img.alt=n.getAttribute('alt')||'';img.loading='lazy';img.decoding='async';
        wrap.appendChild(img);
      });
      if(wrap.children.length) parent.appendChild(wrap);
      return wrap.children.length;
    }
    var seals=copyLogos('.selos img, .selos-seguranca img, .seguranca img, .compra-segura img, .certificados img',secure,8);
    if(!seals) secure.appendChild(e('p', '', 'Compra protegida pela Loja Integrada.'));
    secure.appendChild(e('h3', '', 'FORMAS DE PAGAMENTO'));
    var paymentIcons=copyLogos('.pagamento img, .formas-pagamento img, .bandeiras-pagamento img, .bandeiras img, .meios-pagamento img',secure,12);
    if(!paymentIcons) secure.appendChild(e('p', '', 'Consulte os meios disponíveis no checkout.'));
    grid.appendChild(secure); right.appendChild(grid);
    var legal = e('div', 'tb26-footer__bottom'); append(legal, e('small', '', 'TRACTORBEL TRATORES E PEÇAS BELO HORIZONTE LTDA · CNPJ 17.713.959/0001-77 · © ' + new Date().getFullYear()), e('span', '', 'by FWR Agência Digital'));
    right.appendChild(legal); append(footer, left, right);
    native.parentNode.insertBefore(footer, native); native.classList.add('tb26-native-footer'); doc.body.classList.add('tb26-with-footer'); state.footer = true;
    setupMotion(footer);
  }
  // v1.8 | PDP premium - progressive enhancement of the real Loja Integrada page.
  // Does NOT duplicate checkout, variations, pricing rules, payment or stock data.
  function mountProductPage() {
    if (!cfg.produto || cfg.produto.ativo === false || !doc.body.classList.contains('pagina-produto')) return;
    if (doc.body.classList.contains('tb26-with-pdp')) return;
    var root = doc.querySelector('#corpo .secao-principal .produto');
    if (!root) { warn('PDP: container nativo nao encontrado.'); return; }
    var grid = root.querySelector(':scope > .row-fluid');
    if (!grid) return;
    var columns = [].filter.call(grid.children, function (node) { return node.nodeType === 1 && node.classList.contains('span6'); });
    if (columns.length !== 2 || !columns[0].querySelector('#imagemProduto') || !columns[1].querySelector('.info-principal-produto')) {
      warn('PDP: estrutura nao reconhecida; mantida a pagina nativa.'); return;
    }
    var media = columns[0], details = columns[1];
    var mainImage = media.querySelector('#imagemProduto');
    var nativeBuy = details.querySelector('.acoes-produto .comprar .botao-comprar');
    var nativePrice = details.querySelector('.acoes-produto .preco-produto');
    root.classList.add('tb26-pdp'); grid.classList.add('tb26-pdp__grid');
    media.classList.add('tb26-pdp__media'); details.classList.add('tb26-pdp__details');
    var imageContainer = media.querySelector('.conteiner-imagem');
    if (imageContainer) imageContainer.classList.add('tb26-pdp__image-stage');
    var crumbs = details.querySelector('.info-principal-produto .breadcrumbs');
    if (crumbs) {
      crumbs.classList.add('tb26-pdp__breadcrumbs');
      root.insertBefore(crumbs, grid);
    }
    var headline = details.querySelector('.info-principal-produto');
    if (headline) headline.classList.add('tb26-pdp__headline');
    var purchase = details.querySelector('.principal');
    if (purchase) purchase.classList.add('tb26-pdp__purchase');
    if (nativePrice) nativePrice.classList.add('tb26-pdp__price');
    if (nativeBuy) {
      nativeBuy.classList.add('tb26-pdp__buy-native');
      if (!nativeBuy.getAttribute('aria-label')) nativeBuy.setAttribute('aria-label', 'Adicionar ao carrinho');
    }
    var thumbLinks = [].slice.call(media.querySelectorAll('.produto-thumbs .miniaturas a[data-imagem-grande]'));
    if (thumbLinks.length > 1) {
      var thumbs = media.querySelector('.produto-thumbs');
      if (thumbs) thumbs.classList.add('tb26-pdp__has-thumbs');
      // The native slider and click handlers remain intact.
      thumbLinks.forEach(function (a, i) {
        a.setAttribute('aria-label','Ver imagem '+(i+1)+' do produto');
        if (i === 0) a.classList.add('tb26-pdp__thumb-current');
        a.addEventListener('click', function () {
          thumbLinks.forEach(function(x){x.classList.remove('tb26-pdp__thumb-current');});
          a.classList.add('tb26-pdp__thumb-current');
        });
      });
    }
    // Zoom: real large images from the platform only; one image if only one exists.
    if (imageContainer && mainImage) {
      var zoomButton = e('button','tb26-pdp__zoom-button','↗');
      zoomButton.type = 'button'; zoomButton.setAttribute('aria-label','Ampliar imagem do produto');
      imageContainer.appendChild(zoomButton);
      var zoomLayer=null, zoomReturn=null;
      function closeZoom() {
        if (!zoomLayer) return;
        zoomLayer.remove(); zoomLayer=null;
        doc.body.classList.remove('tb26-pdp-zoom-open');
        doc.removeEventListener('keydown', zoomKeys);
        if (zoomReturn && zoomReturn.isConnected) zoomReturn.focus();
      }
      function zoomKeys(ev) { if (ev.key === 'Escape') closeZoom(); }
      function openZoom() {
        if (zoomLayer) return;
        var source = mainImage.currentSrc || mainImage.src;
        var matching = thumbLinks.find(function (a) {
          var small = a.querySelector('img');
          return a.classList.contains('tb26-pdp__thumb-current') || (small && mainImage.currentSrc && small.getAttribute('data-mediumimg') === mainImage.currentSrc);
        });
        var large = matching && matching.getAttribute('data-imagem-grande');
        if (!large) { var nativeZoom = media.querySelector('#abreZoom'); large = nativeZoom && nativeZoom.getAttribute('href'); }
        var validated = safeUrl(large || source);
        if (!validated) return;
        zoomReturn=doc.activeElement;
        zoomLayer=e('div','tb26-pdp__lightbox');zoomLayer.setAttribute('role','dialog');
        zoomLayer.setAttribute('aria-modal','true');zoomLayer.setAttribute('aria-label','Imagem ampliada do produto');
        var lightboxImg=e('img');lightboxImg.src=validated;lightboxImg.alt=mainImage.alt || 'Imagem ampliada';
        var close=e('button','tb26-pdp__lightbox-close','×');close.type='button';close.setAttribute('aria-label','Fechar imagem ampliada');
        close.addEventListener('click',closeZoom);
        zoomLayer.addEventListener('click',function(ev){if(ev.target===zoomLayer)closeZoom();});
        append(zoomLayer,lightboxImg,close);doc.body.appendChild(zoomLayer);
        doc.body.classList.add('tb26-pdp-zoom-open');doc.addEventListener('keydown',zoomKeys);
        close.focus();
      }
      zoomButton.addEventListener('click',openZoom);
      mainImage.style.cursor='zoom-in';mainImage.addEventListener('click',openZoom);
    }
    // A real stock indicator, mirrored from LI's availability state.
    var availability=details.querySelector('.acoes-produto .disponibilidade-produto');
    if (availability) availability.classList.add('tb26-pdp__availability');
    // Payment methods remain controlled by the platform. Collapse ONLY the native list,
    // never its shipping form (.cep), which is often nested in .parcelas-produto.
    var payments=details.querySelector('.parcelas-produto');
    if (payments) {
      payments.classList.add('tb26-pdp__payments');
      var payList=payments.querySelector(':scope > ul.accordion');
      if (payList) {
        var payToggle=e('button','tb26-pdp__payment-toggle');payToggle.type='button';
        payToggle.textContent='Ver formas de pagamento';
        var payId=payList.id || 'tb26-pdp-payment-methods';if(!payList.id)payList.id=payId;
        payToggle.setAttribute('aria-controls',payId);payToggle.setAttribute('aria-expanded','false');
        payList.hidden=true;payments.insertBefore(payToggle,payList);
        payToggle.addEventListener('click',function(){var opening=payList.hidden;payList.hidden=!opening;payToggle.setAttribute('aria-expanded',String(opening));payToggle.textContent=opening?'Ocultar formas de pagamento':'Ver formas de pagamento';});
      }
      if (payments.querySelector('#formCalcularCep, form[action*="frete"], form[action*="cep"]')) {
        payments.classList.add('tb26-pdp__has-freight');
      }
    }
    var tabs=root.querySelector('.abas-custom');
    if (tabs) tabs.classList.add('tb26-pdp__tabs');
    var described=root.querySelector('#descricao');
    if (described) described.classList.add('tb26-pdp__description');
    // PIX FIRST: price labels are always derived from the live LI price nodes.
    // Nothing is hardcoded and discounts/instalments are never invented.
    var pixHighlight=null, pixValue=null, pixSaving=null;
    function readMoney(value) {
      var hit=String(value || '').match(/R\$\s*[\d.]+,\d{2}/);
      return hit ? hit[0].replace(/\s+/g,' ').trim() : '';
    }
    function moneyNumber(value) {
      var number=readMoney(value).replace(/[R$\s.]/g,'').replace(',','.');
      return number ? Number(number) : NaN;
    }
    function nativePixSource() {
      var source=details.querySelector('.acoes-produto .preco-produto .desconto-a-vista');
      return source && /pix/i.test(source.textContent || '') ? source : null;
    }
    if (purchase && cfg.produto.pixEmDestaque !== false) {
      pixHighlight=e('section','tb26-pdp__pix-feature');
      pixHighlight.setAttribute('aria-label','Preço à vista no Pix');
      var pixEyebrow=e('span','tb26-pdp__pix-eyebrow','PREÇO ESPECIAL NO PIX');
      pixValue=e('strong','tb26-pdp__pix-number');
      var pixCaption=e('span','tb26-pdp__pix-caption','Pagamento à vista via Pix');
      pixSaving=e('span','tb26-pdp__pix-saving');
      append(pixHighlight,pixEyebrow,pixValue,pixCaption,pixSaving);
      var purchaseActions=purchase.querySelector('.acoes-produto');
      if (purchaseActions) purchase.insertBefore(pixHighlight,purchaseActions);
    }
    function syncPix() {
      var currentPrice=details.querySelector('.acoes-produto .preco-produto');
      if (currentPrice && !currentPrice.classList.contains('tb26-pdp__price')) currentPrice.classList.add('tb26-pdp__price');
      var source=nativePixSource();
      var nativeValue=source && (source.querySelector('strong') || source);
      var pixText=readMoney(nativeValue && nativeValue.textContent);
      var visible=!!(pixHighlight && pixText);
      if (pixHighlight) pixHighlight.hidden=!visible;
      root.classList.toggle('tb26-pdp--pix-active',visible);
      if (visible && pixValue.textContent !== pixText) pixValue.textContent=pixText;
      var regular=details.querySelector('.acoes-produto .preco-promocional') || details.querySelector('.acoes-produto .preco-produto .preco-venda');
      var saving=regular && moneyNumber(regular.textContent)-moneyNumber(pixText);
      var savingText=visible && Number.isFinite(saving) && saving>0.005 ?
        'Economize '+new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(saving)+' no Pix' : '';
      if (pixSaving && pixSaving.textContent !== savingText) pixSaving.textContent=savingText;
      if (pixSaving) pixSaving.hidden=!savingText;
      return visible ? pixText : '';
    }
    syncPix();
    if (purchase && 'MutationObserver' in win && pixHighlight) {
      var pixUpdateScheduled=false;
      var pixObserver=new MutationObserver(function(changes){
        // Ignore our own price-display mutations, to avoid an update cycle.
        if(changes.every(function(change){return pixHighlight.contains(change.target);})) return;
        if(pixUpdateScheduled)return;
        pixUpdateScheduled=true;
        win.requestAnimationFrame(function(){pixUpdateScheduled=false;syncPix();});
      });
      pixObserver.observe(purchase,{subtree:true,childList:true,characterData:true});
    }

    // Rapid product overview: extract actual text from the native description only.
    function cleanLine(text) { return (text || '').replace(/\s+/g,' ').trim(); }
    function productSummary() {
      if (!described) return '';
      var rows=[].slice.call(described.querySelectorAll('p,li'));
      var pieces=rows.map(function(n){return cleanLine(n.textContent);}).filter(function(t){return t.length>65 && t.length<1800;});
      var candidate=pieces[0] || cleanLine(described.textContent);
      if (!candidate) return '';
      if (candidate.length<=258) return candidate;
      var part=candidate.slice(0,255),breakAt=part.lastIndexOf(' ');
      return (breakAt>165?part.slice(0,breakAt):part).trim()+'…';
    }
    function summaryFeatures() {
      if (!described) return [];
      return [].slice.call(described.querySelectorAll('li')).map(function(el){return cleanLine(el.textContent);})
        .filter(function(text){return text.length>=12 && text.length<135;}).slice(0,3);
    }
    function pdpIcon(key) {
      var paths={
        truck:'<path d="M3 6h11v11H3z M14 10h4l3 3v4h-7 M5 17a2 2 0 1 0 4 0 M16 17a2 2 0 1 0 4 0"/>',
        shield:'<path d="m12 2 8 4v6c0 5-3.2 8.5-8 10-4.8-1.5-8-5-8-10V6z M9 12l2 2 4-4"/>',
        message:'<path d="M21 11.5a8.3 8.3 0 0 1-12.3 7.2L3 20l1.4-5.1A8.3 8.3 0 1 1 21 11.5z"/>',
        card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20 M6 15h4"/>'
      };
      var wrapper=e('span','tb26-pdp__icon');
      // Trusted, local SVG markup only; never interpolate store HTML here.
      wrapper.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[key]||paths.shield)+'</svg>';
      return wrapper;
    }
    function infoRow(icon,title,detail) {
      var item=e('div','tb26-pdp__quick-item');
      var content=e('div','tb26-pdp__quick-item-text');
      append(content,e('strong','',title),e('span','',detail));
      append(item,pdpIcon(icon),content);
      return item;
    }
    function detailRow(title,content,open) {
      var item=e('details','tb26-pdp__disclosure');
      if(open)item.open=true;
      append(item,e('summary','',title),content);
      return item;
    }
    if (nativeBuy && cfg.produto.resumoRapido !== false) {
      var helpUrl='https://wa.me/'+String(cfg.conteudo.whatsapp || '5531996573930').replace(/\D/g,'');
      var infoStack=e('section','tb26-pdp__after-buy');
      infoStack.setAttribute('aria-label','Informações rápidas sobre o produto e a compra');
      var quick=e('div','tb26-pdp__quick-grid');
      append(quick,
        infoRow('truck','Enviamos para todo o Brasil','Consulte o prazo pelo CEP'),
        infoRow('shield','Compra em ambiente seguro','Pagamento pela própria loja'),
        infoRow('message','Atendimento especializado','Orientação antes de comprar')
      );
      var quickLabel=e('h2','tb26-pdp__quick-title','Informações importantes');
      // Um unico bloco real: fica sob as miniaturas no desktop e retorna
      // abaixo de Comprar no mobile, preservando os dados e eventos nativos.
      var quickPanel=e('div','tb26-pdp__quick-panel');
      append(quickPanel,quickLabel,quick);
      append(infoStack,quickPanel);
      var disclosures=e('div','tb26-pdp__disclosures');
      var overview=e('div','tb26-pdp__disclosure-body');
      var brief=productSummary();
      append(overview,e('p','',brief || 'Veja as informações completas e especificações cadastradas para esta peça.'));
      var features=summaryFeatures();
      if (features.length) {
        var bullets=e('ul','tb26-pdp__feature-list');
        features.forEach(function(text){append(bullets,e('li','',text));});
        append(overview,bullets);
      }
      if (described) append(overview,link('#descricao','tb26-pdp__small-link','Ver descrição completa ↓'));
      append(disclosures,detailRow('Descrição e especificações',overview,true));
      var delivery=e('div','tb26-pdp__disclosure-body');
      append(delivery,e('p','','Calcule o frete e o prazo de entrega pelo CEP. O resultado considera as condições de envio disponíveis para o seu endereço.'));
      var freightForm=details.querySelector('#formCalcularCep');
      if (freightForm) {
        var goFreight=e('button','tb26-pdp__text-action','Calcular frete e prazo');goFreight.type='button';
        goFreight.addEventListener('click',function(){
          freightForm.scrollIntoView({behavior:win.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
          var field=freightForm.querySelector('input:not([type=hidden])');if(field)field.focus({preventScroll:true});
        });
        append(delivery,goFreight);
      }
      append(disclosures,detailRow('Envio e entrega',delivery,false));
      var payment=e('div','tb26-pdp__disclosure-body');
      append(payment,e('p','','Confira abaixo as formas de pagamento e os valores informados pela Loja Integrada. O destaque no Pix é exibido somente quando disponível para o produto.'));
      var payBtn=e('button','tb26-pdp__text-action','Ver opções de pagamento');payBtn.type='button';
      payBtn.addEventListener('click',function(){
        var toggle=details.querySelector('.tb26-pdp__payment-toggle');
        if(toggle && toggle.getAttribute('aria-expanded')!=='true') toggle.click();
        if(toggle)toggle.scrollIntoView({behavior:win.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
      });
      if (details.querySelector('.tb26-pdp__payment-toggle')) append(payment,payBtn);
      append(disclosures,detailRow('Pagamento e condições',payment,false));
      var assistance=e('div','tb26-pdp__disclosure-body');
      append(assistance,e('p','','Precisa confirmar a compatibilidade da peça ou tirar dúvidas antes da compra? Fale com a equipe TractorBel.'));
      var support=link(helpUrl,'tb26-pdp__text-action','Conversar com um especialista');
      support.target='_blank';support.rel='noopener noreferrer';append(assistance,support);
      append(disclosures,detailRow('Dúvidas e atendimento',assistance,false));
      append(infoStack,disclosures);
      var block=nativeBuy.closest('.comprar');
      if (block) {
        block.insertAdjacentElement('afterend',infoStack);
        var desktopLayout=win.matchMedia('(min-width: 768px)');
        function relocateImportantInfo() {
          if (desktopLayout.matches) {
            // A LI pode ocultar as miniaturas quando existe uma foto apenas.
            // Neste caso, posicionar imediatamente apos a imagem principal.
            var after=media.querySelector('.produto-thumbs') || imageContainer;
            if (after && after.parentNode === media) after.insertAdjacentElement('afterend',quickPanel);
            else media.appendChild(quickPanel);
          } else if (quickPanel.parentNode !== infoStack) {
            // Mesma posicao mobile original, antes dos accordions.
            infoStack.insertBefore(quickPanel,disclosures);
          }
        }
        relocateImportantInfo();
        if (desktopLayout.addEventListener) desktopLayout.addEventListener('change',relocateImportantInfo);
        else if (desktopLayout.addListener) desktopLayout.addListener(relocateImportantInfo);
      }
    }
    var floatingBar=null;
    if (nativeBuy && cfg.produto.compraFixaMobile !== false) {
      floatingBar=e('div','tb26-pdp__mobile-bar');
      var barInfo=e('div','tb26-pdp__mobile-info');
      var barLabel=e('small','','Total do produto');
      var barPrice=e('strong','tb26-pdp__mobile-price');
      append(barInfo,barLabel,barPrice);
      var barButton=e('button','tb26-pdp__mobile-cta','COMPRAR');barButton.type='button';
      barButton.setAttribute('aria-label','Comprar este produto');
      barButton.addEventListener('click',function(){
        var currentBuy=details.querySelector('.acoes-produto .comprar .botao-comprar');
        if (currentBuy && !currentBuy.classList.contains('desativado') && currentBuy.getAttribute('aria-disabled')!=='true') currentBuy.click();
      });
      append(floatingBar,barInfo,barButton);doc.body.appendChild(floatingBar);
      function syncPrice() {
        var pix=syncPix();
        var node=details.querySelector('.acoes-produto .preco-promocional') || details.querySelector('.acoes-produto .preco-venda');
        var price=node && (node.textContent || '').replace(/\s+/g,' ').trim();
        barLabel.textContent=pix ? 'Valor no Pix' : 'Preço do produto';
        barPrice.textContent=pix || price || 'Consulte o preço';
        var unavailable=!!details.querySelector('.acoes-produto.indisponivel, .acoes-produto.sem-estoque');
        var currentBuy=details.querySelector('.acoes-produto .comprar .botao-comprar');
        barButton.disabled=unavailable || !currentBuy || currentBuy.classList.contains('desativado') || currentBuy.getAttribute('aria-disabled')==='true';
      }
      syncPrice();
      if (purchase && 'MutationObserver' in win) {
        var mobileScheduled=false;
        var priceObserver=new MutationObserver(function(changes){
          if (pixHighlight && changes.every(function(change){return pixHighlight.contains(change.target);})) return;
          if (mobileScheduled) return;
          mobileScheduled=true;
          win.requestAnimationFrame(function(){mobileScheduled=false;syncPrice();});
        });
        priceObserver.observe(purchase,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
      }
      // Keep the bar out of view when the original purchase button is already visible.
      if ('IntersectionObserver' in win) {
        var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){floatingBar.classList.toggle('tb26-pdp__mobile-bar--visible',!entry.isIntersecting);});},{threshold:0.05});
        io.observe(nativeBuy);
      } else floatingBar.classList.add('tb26-pdp__mobile-bar--visible');
    }
    doc.body.classList.add('tb26-with-pdp');
    state.produto={ativo:true,galeria:thumbLinks.length||1,compraNativa:!!nativeBuy,formasPagamento:!!payments,zoom:!!imageContainer,barraMobile:!!floatingBar};
    // Avoid automatic hiding/translation on the main product image (LCP).
  }

  function mount() {
    if (!enabled || !doc.body) return;
    if (doc.documentElement.dataset.tb26Mount === '1') return;
    doc.documentElement.dataset.tb26Mount = '1';
    doc.body.classList.add('tb26-active');
    if (isHome) configureBackgrounds();
    try { mountHeader(); mountHome(); mountProductPage(); mountFooter(); }
    catch (err) { console.error('[TractorBel] Erro no layout, loja nativa preservada onde possível:', err); state.warnings.push(String(err.message)); }
    debug('Inicialização', state);
  }
  win.TractorBel2026 = Object.freeze({ version: VERSION, enabled: enabled, config: cfg, arquivos: ASSET_FILES, diagnostico: function () { return JSON.parse(JSON.stringify(state)); }, refresh: function () { return mount(); }, carrinho: { abrir: function () { if (cartDrawerApi) cartDrawerApi.open(); }, fechar: function () { if (cartDrawerApi) cartDrawerApi.close(); }, atualizar: function () { if (cartDrawerApi) cartDrawerApi.refresh(); } } });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})(window, document);