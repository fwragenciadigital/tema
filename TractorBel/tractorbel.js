/*
 * TractorBel 2026 - FWR Agencia Digital - v1.1.0
 * Camada visual da Loja Integrada. Sem checkout ou precificacao paralela.
 * Editavel por window.TractorBelSettings no HTML da LI.
 */
(function (win, doc) {
  'use strict';
  if (win.TractorBel2026) return;
  var VERSION = '1.1.0';
  var script = doc.currentScript;
  var defaultAssetBase = script && script.src ? new URL('./assets/', script.src).href : '/assets/';
  var defaults = {
    geral: { ativo: true, publicarNaLoja: false, debug: false },
    imagensBase: defaultAssetBase,
    topo: { ativo: true, menu: true },
    home: { ativo: true },
    rodape: { ativo: true },
    vitrines: { ativo: true, destaques: 10, miniaturas: 8, maisVendidos: 10 },
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
  function asset(name) { return String(cfg.imagensBase || defaultAssetBase).replace(/\/?$/, '/') + encodeURI(name); }
  function image(name, alt, width, height, eager) {
    var x = e('img'); x.src = asset(name); x.alt = alt || ''; x.width = width; x.height = height;
    x.loading = eager ? 'eager' : 'lazy'; x.decoding = 'async';
    if (eager) x.setAttribute('fetchpriority', 'high');
    return x;
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
  function navItems() {
    var desired = [
      ['PEÇAS NOVAS', '/pecas-novas'], ['PEÇAS SEMINOVAS', '/pecas-seminovas'],
      ['CRBT', '/crbt'], ['FERRAMENTAS DE PENETRAÇÃO DE SOLO', '/fps'],
      ['LUBRIFICANTES', '/lubrificantes'], ['MINIATURAS', '/miniaturas'],
      ['EQUIPAMENTOS', '/equipamentos-novos']
    ];
    var nativeLinks = [].slice.call(doc.querySelectorAll('#cabecalho .menu a, .menu.superior a, .menu-principal a'));
    return desired.map(function (entry) {
      var match = nativeLinks.find(function (n) { return n.textContent.trim().replace(/\s+/g, ' ').toUpperCase() === (entry[0] === 'FERRAMENTAS DE PENETRAÇÃO DE SOLO' ? 'FPS' : entry[0]); });
      return { title: entry[0], href: match && safeUrl(match.getAttribute('href')) || entry[1] };
    });
  }
  function mountHeader() {
    if (!cfg.topo.ativo || doc.getElementById('tb26-header')) return;
    var native = doc.querySelector('#cabecalho') || doc.querySelector('header');
    if (!native) { warn('Cabeçalho nativo não identificado, mantido sem alterações.'); return; }
    var header = e('header', 'tb26-header'); header.id = 'tb26-header';
    var top = e('div', 'tb26-header__wrap tb26-container');
    var brand = link('/', 'tb26-logo'); append(brand, image('logo-top.webp', 'TractorBel Tratores e Peças - Desde 1983', 741, 176, true));
    var nav = e('nav', 'tb26-nav'); nav.id = 'tb26-menu'; nav.setAttribute('aria-label', 'Categorias principais');
    navItems().forEach(function (it) { nav.appendChild(link(it.href, 'tb26-nav__link', it.title)); });
    var action = e('div', 'tb26-actions');
    var searchOpen = e('button', 'tb26-icon tb26-search-open', '⌕'); searchOpen.type = 'button'; searchOpen.setAttribute('aria-label', 'Abrir busca'); searchOpen.setAttribute('aria-expanded', 'false');
    var search = e('form', 'tb26-search'); search.method = 'get'; search.action = '/buscar'; search.role = 'search';
    var searchInput = e('input'); searchInput.type = 'search'; searchInput.name = 'q'; searchInput.placeholder = 'O que você procura?'; searchInput.setAttribute('aria-label', 'Buscar produtos');
    var searchSubmit = e('button', '', 'Buscar'); searchSubmit.type = 'submit'; append(search, searchInput, searchSubmit);
    searchOpen.addEventListener('click', function () { var open = header.classList.toggle('tb26-search-visible'); searchOpen.setAttribute('aria-expanded', String(open)); if (open) searchInput.focus(); });
    var account = link('/conta/index', 'tb26-icon tb26-account'); account.setAttribute('aria-label', 'Minha conta'); account.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>';
    var cart = link('/carrinho/index', 'tb26-icon tb26-cart'); cart.setAttribute('aria-label', 'Meu carrinho'); cart.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h2l2 12h11l3-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>';
    var count = firstText(doc, ['#cabecalho .qtd-carrinho', '#cabecalho .carrinho .qtd-carrinho', '.carrinho .qtd-carrinho']);
    if (/^\d{1,3}$/.test(count)) cart.appendChild(e('span', 'tb26-cart__count', count));
    var menuBtn = e('button', 'tb26-icon tb26-mobile-toggle', '☰'); menuBtn.type = 'button'; menuBtn.setAttribute('aria-controls', 'tb26-menu'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Abrir menu');
    menuBtn.addEventListener('click', function () { var open = header.classList.toggle('tb26-menu-open'); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? '×' : '☰'; });
    nav.addEventListener('click', function (ev) { if (ev.target.closest('a')) { header.classList.remove('tb26-menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = '☰'; } });
    append(action, searchOpen, account, cart, menuBtn); append(top, brand, nav, action); append(header, top, search);
    native.parentNode.insertBefore(header, native);
    native.classList.add('tb26-native-header');
    doc.body.classList.add('tb26-with-header'); state.header = true;
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
  function brands() {
    var section = e('section', 'tb26-brands'); var container = e('div', 'tb26-container');
    var h = e('h2', 'tb26-brands__title', cfg.conteudo.fraseMarcas); append(container, h);
    var img = image('novo-projeto-11.webp', 'Marcas CAT, SANY, XCMG, Komatsu, Volvo, CASE, Randon e John Deere', 1762, 178, true);
    img.className = 'tb26-brands__logos'; append(container, img); append(section, container); return section;
  }
  function hero() {
    var sec = e('section', 'tb26-hero'); var img = image('fullbanner.webp', 'Mais de 50.000 itens para manter sua operação em movimento - TractorBel', 2549, 986, true);
    append(sec, link('/pecas-novas', 'tb26-hero__link')); sec.querySelector('a').appendChild(img); return sec;
  }
  function benefits() {
    var bar = e('div', 'tb26-benefits'); var inner = e('div', 'tb26-container tb26-benefits__grid');
    [['⬡', 'ENVIAMOS PARA TODO O BRASIL'], ['▣', 'PARCELE NO CARTÃO DE CRÉDITO'], ['%', 'PAGUE À VISTA E GANHE DESCONTO'], ['♙', 'AMBIENTE DE COMPRA 100% SEGURO']].forEach(function (v) { var cell = e('div', 'tb26-benefits__item'); append(cell, e('b', '', v[0]), e('span', '', v[1])); inner.appendChild(cell); }); append(bar, inner); return bar;
  }
  function institutionalBanner() {
    var sec = e('section', 'tb26-institutional-banner tb26-container');
    sec.appendChild(image('vendedores.webp', 'A TractorBel é referência em peças, equipamentos e serviços no Brasil há mais de 40 anos', 1719, 402)); return sec;
  }
  function categories() {
    var sec = e('section', 'tb26-categories'); sec.style.backgroundImage = 'linear-gradient(#201811b8,#201811b8),url("' + asset('bg-pecas.webp') + '")';
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
    var info = e('div', 'tb26-company__info'); append(info, image('logo-empresa-footer.webp', 'TractorBel e TTL', 698, 103), e('p', '', cfg.conteudo.sobre));
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
    var a = link(cfg.conteudo.instagram || 'https://www.instagram.com/', 'tb26-instagram__feed'); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.setAttribute('aria-label', 'Acompanhe a TractorBel nas redes sociais');
    a.appendChild(image('insta.webp', 'Publicações da TractorBel sobre máquinas, peças e ofertas', 1720, 522)); append(inner, a); append(sec, inner); return sec;
  }
  // Animacao uma unica vez ao entrar no viewport. Transform/opacity nao provocam CLS.
  // Nao aplicar na hero, para preservar LCP. Nem no conteudo nativo da plataforma.
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
      '.tb26-benefits__item', '.tb26-institutional-banner img', '.tb26-title',
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
    append(root, brands(), hero(), benefits(), institutionalBanner());
    var homeProducts = getProducts(findNativeShelf('Destaques') || native, Math.max(10, cfg.vitrines.destaques));
    var latest = getProducts(findNativeShelf('Lançamentos') || native, Math.max(10, cfg.vitrines.maisVendidos));
    if (cfg.vitrines.ativo && homeProducts.length) { root.appendChild(carousel('destaques', 'PRODUTOS EM DESTAQUE', homeProducts, 'tb26-carousel--featured')); state.products.destaques = homeProducts.length; }
    append(root, categories());
    var miniatureProducts = latest.filter(function (p) { return /miniatura/i.test(p.title); });
    if (cfg.vitrines.ativo) {
      var miniSec = e('section', 'tb26-miniatures'); miniSec.id = 'tb26-miniatures';
      var miniInner = e('div', 'tb26-container'); miniInner.appendChild(e('h2', 'tb26-title tb26-title--left', 'MINIATURAS EXCLUSIVAS'));
      var layout = e('div', 'tb26-miniatures__layout'); var art = e('div', 'tb26-miniatures__art');
      art.style.backgroundImage = 'url("' + asset('bg-miniaturas.webp') + '")';
      var holder = e('div', 'tb26-miniatures__products');
      append(layout, art, holder); append(miniInner, layout); append(miniSec, miniInner); root.appendChild(miniSec);
      function fillMini(items) { holder.replaceChildren(); if (items.length) { var slider = carousel('miniaturas', '', items.slice(0, cfg.vitrines.miniaturas), 'tb26-miniatures__slider'); holder.appendChild(slider); state.products.miniaturas = items.length; } else { holder.appendChild(link('/miniaturas', 'tb26-miniatures__fallback', 'VER TODAS AS MINIATURAS →')); warn('Miniaturas sem resposta; exibido link de categoria.'); } if (state.home) setupMotion(holder); }
      if (miniatureProducts.length >= 3) fillMini(miniatureProducts);
      else fetch('/miniaturas', { credentials: 'same-origin' }).then(function (resp) { if (!resp.ok) throw Error('Resposta ' + resp.status); return resp.text(); }).then(function (html) { return getProducts(new DOMParser().parseFromString(html, 'text/html'), cfg.vitrines.miniaturas); }).then(fillMini).catch(function () { fillMini(miniatureProducts); });
    }
    if (cfg.vitrines.ativo && latest.length) { root.appendChild(carousel('mais-vendidas', 'PEÇAS MAIS VENDIDAS', latest, 'tb26-carousel--best')); state.products.maisVendidos = latest.length; }
    append(root, solutions(), company(), instagram());
    native.parentNode.insertBefore(root, native); native.classList.add('tb26-native-home'); doc.body.classList.add('tb26-with-home'); state.home = true;
    setupMotion(root);
  }
  function mountFooter() {
    if (!cfg.rodape.ativo || doc.getElementById('tb26-footer')) return;
    var native = doc.querySelector('#rodape') || doc.querySelector('footer'); if (!native) { warn('Rodapé nativo não identificado.'); return; }
    var footer = e('footer', 'tb26-footer'); footer.id = 'tb26-footer';
    var left = e('div', 'tb26-footer__art'); left.style.backgroundImage = 'url("' + asset('bg-footer.webp') + '")';
    var social = e('div', 'tb26-footer__social'); social.appendChild(e('span', '', 'SIGA-NOS:'));
    if (cfg.conteudo.instagram) social.appendChild(link(cfg.conteudo.instagram, '', 'Instagram'));
    if (cfg.conteudo.facebook) social.appendChild(link(cfg.conteudo.facebook, '', 'Facebook'));
    left.appendChild(social);
    var right = e('div', 'tb26-footer__right'); var grid = e('div', 'tb26-footer__grid');
    function column(title, items) { var c = e('div', 'tb26-footer__col'); c.appendChild(e('h3', '', title)); items.forEach(function (item) { c.appendChild(link(item[1], '', item[0])); }); return c; }
    append(grid,
      column('ÁREA DO CLIENTE', [['Minha Conta', '/conta/index'], ['Meus Pedidos', '/conta/pedido/listar'], ['Cadastre-se', '/conta/criar'], ['Fale Conosco', '/contato']]),
      column('INSTITUCIONAL', [['Sobre Nós', '/pagina/sobre-nos.html'], ['Frete & Entrega', '/pagina/frete-e-entrega.html'], ['Trocas & Devoluções', '/pagina/trocas-e-devolucoes.html'], ['Política de Privacidade', '/pagina/politica-de-privacidade.html']])
    );
    var secure = e('div', 'tb26-footer__col tb26-footer__secure'); secure.appendChild(e('h3', '', 'COMPRA SEGURA'));
    var seal = firstElement(native, ['.selos', '.selos-seguranca', '.pagamento-selos', '.formas-pagamento', '.bandeiras-pagamento']);
    if (seal) { var imgs = [].slice.call(seal.querySelectorAll('img')).slice(0, 12); if (imgs.length) { var wrap = e('div', 'tb26-footer__native-seals'); imgs.forEach(function (n) { var img = n.cloneNode(true); img.removeAttribute('style'); img.loading = 'lazy'; wrap.appendChild(img); }); secure.appendChild(wrap); } }
    if (!secure.querySelector('img')) secure.appendChild(e('p', '', 'Pagamento processado pela Loja Integrada.'));
    secure.appendChild(e('h3', '', 'FORMAS DE PAGAMENTO'));
    secure.appendChild(e('p', '', 'Consulte os meios disponíveis no checkout.'));
    grid.appendChild(secure); right.appendChild(grid);
    var legal = e('div', 'tb26-footer__bottom'); append(legal, e('small', '', 'TRACTORBEL TRATORES E PEÇAS BELO HORIZONTE LTDA · CNPJ 17.713.959/0001-77 · © ' + new Date().getFullYear()), e('span', '', 'by FWR Agência Digital'));
    right.appendChild(legal); append(footer, left, right);
    native.parentNode.insertBefore(footer, native); native.classList.add('tb26-native-footer'); doc.body.classList.add('tb26-with-footer'); state.footer = true;
    setupMotion(footer);
  }
  function mount() {
    if (!enabled || !doc.body) return;
    if (doc.documentElement.dataset.tb26Mount === '1') return;
    doc.documentElement.dataset.tb26Mount = '1';
    doc.body.classList.add('tb26-active');
    try { mountHeader(); mountHome(); mountFooter(); }
    catch (err) { console.error('[TractorBel] Erro no layout, loja nativa preservada onde possível:', err); state.warnings.push(String(err.message)); }
    debug('Inicialização', state);
  }
  win.TractorBel2026 = Object.freeze({ version: VERSION, enabled: enabled, config: cfg, diagnostico: function () { return JSON.parse(JSON.stringify(state)); }, refresh: function () { return mount(); } });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})(window, document);