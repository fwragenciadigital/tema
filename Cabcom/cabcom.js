/* Cabcom 2026 | FWR Agencia Digital | Integracao Loja Integrada
 * Camada visual conservadora: preserva DOM comercial, links nativos, catalogo,
 * estoque, cotacoes, busca, conta, carrinho, frete, cupom, pagamentos e checkout.
 * Preview: ?cabcom_preview=1; producao somente com publicarNaLoja:true.
 */
(function (w,d) {
  'use strict';
  if(w.Cabcom2026) return;
  var VERSION='1.6.0';
  var CDN='https://cdn.awsli.com.br/80/80577/arquivos/';
  var DEFAULTS={
    geral:{ativo:true,publicarNaLoja:false,debug:false},
    previsualizacao:{ocultarBlocosLegados:true},
    efeitos:{ativo:true,fadeUp:true,imagens:true,loader:true,navegacao:true,indicadorRolagem:true},
    imagensBase:CDN,
    topo:{ativo:true},
    carrinhoLateral:{ativo:true,consultarCarrinho:true},
    home:{ativo:true,hero:true,beneficios:true,apresentacao:true,cabos:true,conectores:true,atalhos:true,miniBanners:true,marcas:true,institucional:true,instagram:true},
    catalogo:{ativo:true},
    produto:{ativo:true},
    rodape:{ativo:true},
    conteudo:{
      slogan:'Fios, cabos e conectividade para projetos profissionais',
      contato:'(11) 3280-2008',
      email:'sac@cabcom.com.br',
      instagram:'https://www.instagram.com/cabcomoficial/',
      tituloEmpresa:'Conectividade profissional desde 2011',
      textoEmpresa:'A Cabcom fornece fios, cabos especiais, conectores, ferramentas e acessórios para projetos de telecomunicações, broadcast, automação e segurança digital. Atendimento técnico para encontrar a solução adequada a cada aplicação.'
    }
  };
  function merge(a,b){
    var o=Object.assign({},a);
    Object.keys(b||{}).forEach(function(k){
      o[k]=(a[k] && b[k] && typeof a[k]==='object' && typeof b[k]==='object' && !Array.isArray(b[k]))?merge(a[k],b[k]):b[k];
    });
    return o;
  }
  var cfg=merge(DEFAULTS,w.CabcomSettings||{});
  var hostname=location.hostname.toLowerCase();
  var store=hostname==='cabcom.com.br'||hostname==='www.cabcom.com.br';
  var preview=new URLSearchParams(location.search).get('cabcom_preview')==='1';
  var active=!!(cfg.geral.ativo && (!store||cfg.geral.publicarNaLoja||preview));
  var home=/^\/(?:index\.html)?\/?$/i.test(location.pathname);
  var state={version:VERSION,active:active,preview:preview,home:home,sections:[],warnings:[]};
  w.Cabcom2026={version:VERSION,settings:cfg,state:state,reinit:boot};
  if(!active) return;
  function log(){if(cfg.geral.debug&&w.console&&console.log)console.log.apply(console,['[Cabcom]'].concat([].slice.call(arguments)));}
  function warn(v){state.warnings.push(v);log(v);}
  function el(tag,klass,text){
    var x=d.createElement(tag);
    if(klass)x.className=klass;
    if(text!=null)x.textContent=String(text);
    return x;
  }
  function asset(file){return String(cfg.imagensBase||CDN).replace(/\/?$/,'/')+encodeURIComponent(file);}
  function img(file,alt,eager){
    var x=el('img');
    x.alt=alt||'';x.src=asset(file);x.decoding='async';x.loading=eager?'eager':'lazy';
    if(eager)x.setAttribute('fetchpriority','high');
    x.addEventListener('error',function(){
      x.classList.add('cc26-image-unavailable');
      warn('Imagem ausente no CDN oficial: '+file);
    },{once:true});
    imageTransition(x);
    return x;
  }
  function imageTransition(image){
    if(!cfg.efeitos || cfg.efeitos.imagens===false || !image || !image.addEventListener)return;
    image.classList.add('cc26-image-loading');
    function done(){
      image.classList.remove('cc26-image-loading');
      image.classList.add('cc26-image-loaded');
    }
    image.addEventListener('load',done,{once:true});
    image.addEventListener('error',done,{once:true});
    if(image.complete)done();
  }
  function section(cls){
    var s=el('section','cc26-section '+cls);
    s.setAttribute('data-cc26-component',cls);
    state.sections.push(cls);
    return s;
  }
  function wrap(){
    return el('div','cc26-container');
  }
  function normalized(text){
    return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
  }
  function navAnchor(label){
    var needle=normalized(label);
    var selectors='#cabecalho a[href], .menu.superior a[href], .menu.lateral a[href], #corpo a[href]';
    var matches=[].slice.call(d.querySelectorAll(selectors));
    var exact=matches.find(function(a){return normalized(a.textContent)===needle&&a.getAttribute('href')&&!a.getAttribute('href').startsWith('#');});
    var match=exact||matches.find(function(a){
      var t=normalized(a.textContent);
      return t.indexOf(needle)===0&&t.length<=needle.length+12&&a.getAttribute('href');
    });
    if(!match)return '';
    try{
      var url=new URL(match.href,location.href);
      return url.origin===location.origin?url.href:'';
    }catch(e){return '';}
  }
  function safeInstagram(url){
    try{var x=new URL(url);return x.protocol==='https:'&&/(^|\.)instagram\.com$/i.test(x.hostname)?x.href:'';}catch(e){return '';}
  }
  function a(href,cls,text){
    var x=el('a',cls,text);x.href=href;return x;
  }
  function title(text){
    var h=el('h2','cc26-title',text);
    var ico=img('logo.png','');ico.className='cc26-title__logo';ico.setAttribute('aria-hidden','true');
    h.prepend(ico);
    return h;
  }
  function insertAfter(anchor,node){
    if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(node,anchor.nextSibling);
  }
  function inlineIcon(name){
    var icons={
      search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
      user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2c0-4 3.6-6 8-6s8 2 8 6v2"/>',
      cart:'<path d="M2 3h3l2.5 12H19l2-9H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
      menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
      arrow:'<path d="m9 5 7 7-7 7"/>',
      truck:'<path d="M3 5h11v11H3zM14 9h4l3 4v3h-7M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>',
      credit:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h5"/>',
      tag:'<path d="M20.5 13.4 13 20.9 3 11V3h8l9.5 10.4Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
      shield:'<path d="M12 2 20 5v6c0 5-3.2 8.5-8 11-4.8-2.5-8-6-8-11V5l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
      phone:'<path d="M6.5 3H4a2 2 0 0 0-2 2c0 9.4 7.6 17 17 17a2 2 0 0 0 2-2v-2.5l-5.5-2-2.2 2.2a15 15 0 0 1-7-7l2.2-2.2L6.5 3Z"/>',
      mail:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
      instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.7h.01"/>',
      facebook:'<path d="M15.5 4H13a3 3 0 0 0-3 3v3H7v4h3v7h4v-7h3l.5-4H14V7h2z"/>'
    };
    var span=el('span','cc26-icon');
    span.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(icons[name]||'')+'</svg>';
    return span;
  }
  function enableHeader(){
    if (!cfg.topo.ativo || d.getElementById('cc26-new-header')) return;
    var nativeHeader=d.querySelector('#cabecalho');
    if (!nativeHeader) { warn('Cabecalho nativo nao encontrado: fallback mantido'); return; }
    var nativeNav=nativeHeader.querySelector('.menu.superior .nivel-um, .menu.superior > ul') || d.querySelector('.menu.superior .nivel-um, .menu.superior > ul');
    if (!nativeNav) { warn('Categorias nativas nao encontradas: fallback mantido'); return; }
    var navItems=[].slice.call(nativeNav.children).filter(function(li){
      return li.tagName==='LI' && li.querySelector('a[href]');
    });
    if (!navItems.length) return;
    var header=el('header','cc26-site-header');
    header.id='cc26-new-header';
    var top=el('div','cc26-site-header__top');
    var promo=d.querySelector('.barra-inicial .conteiner, #barra-top .conteiner, .barra-topo .conteiner');
    var promoText=promo?String(promo.textContent||'').replace(/\s+/g,' ').trim():'';
    top.textContent=promoText && promoText.length<180 ? promoText : '';
    if(!top.textContent.trim())top.classList.add('cc26-site-header__top--empty');
    header.appendChild(top);
    var inner=el('div','cc26-site-header__inner');
    var main=el('div','cc26-site-header__main');
    var homeLink=navAnchor('INICIAL')||location.origin+'/';
    var logo=a(homeLink,'cc26-site-header__brand');
    var logoOriginal=nativeHeader.querySelector('.logo img');
    var logoImage=el('img');
    logoImage.src=logoOriginal && (logoOriginal.currentSrc||logoOriginal.src) ? (logoOriginal.currentSrc||logoOriginal.src) : asset('logo.png');
    logoImage.alt=logoOriginal && logoOriginal.alt ? logoOriginal.alt : 'Cabcom';
    logo.appendChild(logoImage);
    logoImage.addEventListener('error',function(){if(!logo.querySelector('.cc26-site-header__wordmark'))logo.appendChild(el('span','cc26-site-header__wordmark','Cabcom'));},{once:true});
    main.appendChild(logo);
    var navigation=el('nav','cc26-site-header__nav');
    navigation.id='cc26-navigation';
    navigation.setAttribute('aria-label','Categorias');
    var navList=el('ul','cc26-site-header__list');
    var preferred=['ACESSÓRIOS','ANTENAS','CABOS','CONECTORES','FERRAMENTAS','ISOLANTES','RADIOS'];
    var mainNodes=[];
    preferred.forEach(function(name){
      var node=navItems.find(function(li){
        var anchor=li.querySelector(':scope > a[href]');
        return anchor && normalized(anchor.textContent)===normalized(name);
      });
      if(node)mainNodes.push(node);
    });
    // Outras categorias nativas continuam acessiveis; nenhuma e fabricada.
    var remaining=navItems.filter(function(li){return mainNodes.indexOf(li)<0;});
    function menuItem(li){
      var original=li.querySelector(':scope > a[href]');
      if(!original)return null;
      var row=el('li','cc26-site-header__navitem');
      var item=a(original.href,'cc26-site-header__navlink',original.textContent.trim());
      row.appendChild(item);
      var childList=li.querySelector(':scope > ul');
      if(childList){
        var sub=el('ul','cc26-site-header__submenu');
        var childAnchors=[].slice.call(childList.querySelectorAll('a[href]')).slice(0,45);
        childAnchors.forEach(function(c){
          var child=el('li');
          child.appendChild(a(c.href,'',c.textContent.trim()));
          sub.appendChild(child);
        });
        if(sub.children.length)row.appendChild(sub);
      }
      return row;
    }
    mainNodes.forEach(function(li){var row=menuItem(li);if(row)navList.appendChild(row);});
    if(remaining.length){
      var more=el('li','cc26-site-header__navitem cc26-site-header__more');
      var text=el('span','cc26-site-header__navlink','MAIS');
      more.appendChild(text);
      var sub=el('ul','cc26-site-header__submenu');
      remaining.forEach(function(li){
        var anchor=li.querySelector(':scope > a[href]');
        if(!anchor)return;
        var item=el('li');item.appendChild(a(anchor.href,'',anchor.textContent.trim()));sub.appendChild(item);
      });
      if(sub.children.length)more.appendChild(sub);
      navList.appendChild(more);
    }
    navigation.appendChild(navList);
    main.appendChild(navigation);
    var actions=el('div','cc26-site-header__actions');
    // Pesquisa proxied pelo formulario nativo: submete o MESMO elemento da LI.
    var nativeForm=nativeHeader.querySelector('.busca form, form[action*="buscar"], form[action*="busca"]') || d.querySelector('.busca form, form[action*="buscar"], form[action*="busca"]');
    var nativeInput=nativeForm&&nativeForm.querySelector('input[name]:not([type="hidden"])');
    if(nativeForm && nativeInput){
      var search=el('form','cc26-site-header__search');
      search.setAttribute('role','search');
      var input=el('input');input.type='search';input.placeholder='Buscar na loja';input.setAttribute('aria-label','Buscar na loja');
      var submit=el('button');submit.type='submit';submit.setAttribute('aria-label','Pesquisar');submit.appendChild(inlineIcon('search'));
      search.appendChild(input);search.appendChild(submit);
      search.addEventListener('submit',function(ev){
        ev.preventDefault();
        if(!input.value.trim())return;
        nativeInput.value=input.value;
        nativeInput.dispatchEvent(new Event('input',{bubbles:true}));
        if(typeof nativeForm.requestSubmit==='function')nativeForm.requestSubmit();
        else nativeForm.submit();
      });
      actions.appendChild(search);
    }
    var account=nativeHeader.querySelector('.minha-conta > a[href], a[href*="/conta/"], a[href*="/login"]');
    if(account){
      var user=a(account.href,'cc26-site-header__action');user.appendChild(inlineIcon('user'));
      user.setAttribute('aria-label','Minha conta');actions.appendChild(user);
    }
    var cart=nativeHeader.querySelector('.carrinho > a[href], a[href*="/carrinho/"]');
    if(cart){
      var quote=a(cart.href,'cc26-site-header__action cc26-site-header__cart');quote.appendChild(inlineIcon('cart'));
      quote.setAttribute('aria-label','Meu orçamento');
      var count=nativeHeader.querySelector('.qtd-carrinho');
      if(count&&count.textContent.trim())quote.appendChild(el('span','cc26-site-header__count',count.textContent.trim()));
      actions.appendChild(quote);
      if(cfg.carrinhoLateral && cfg.carrinhoLateral.ativo)mountCartSidebar(quote);
    }
    var toggle=el('button','cc26-site-header__toggle');toggle.appendChild(inlineIcon('menu'));
    toggle.type='button';toggle.setAttribute('aria-label','Abrir menu');toggle.setAttribute('aria-controls','cc26-navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',function(){
      var isOpen=header.classList.toggle('cc26-site-header--open');
      toggle.setAttribute('aria-expanded',String(isOpen));
      toggle.setAttribute('aria-label',isOpen?'Fechar menu':'Abrir menu');
    });
    header.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'){header.classList.remove('cc26-site-header--open');toggle.setAttribute('aria-expanded','false');}
    });
    actions.appendChild(toggle);
    main.appendChild(actions);inner.appendChild(main);header.appendChild(inner);
    nativeHeader.parentNode.insertBefore(header,nativeHeader);
    nativeHeader.classList.add('cc26-native-header');
    d.body.classList.add('cc26-with-custom-header');
    var originalMenu=d.querySelector('.menu.superior');
    if(originalMenu)originalMenu.classList.add('cc26-original-menu');
    state.header='custom';
  }
  // Cabcom v1.6: Carrinho lateral baseado no drawer da TractorBel.
  // Consulta somente dados originados na Loja Integrada; jamais altera a sessao,
  // quantidades, precos, frete, cupom, formas de pagamento ou checkout nativo.
  var cartSidebarApi=null;
  function mountCartSidebar(trigger){
    if(cartSidebarApi||!trigger||d.getElementById('cc26-cart-sidebar'))return;
    var nativeCartAnchor=d.querySelector('#cabecalho .carrinho > a[href], #cabecalho a[href*="/carrinho/"]');
    var url='/carrinho/index';
    if(nativeCartAnchor){
      try{
        var nUrl=new URL(nativeCartAnchor.href,location.href);
        if(nUrl.origin===location.origin && /^\/carrinho(?:\/index)?\/?$/i.test(nUrl.pathname))url=nUrl.pathname;
      }catch(e){}
    }
    if(preview)url+=(url.indexOf('?')===-1?'?':'&')+'cabcom_preview=1';
    var sidebar=el('div','cc26-cart-sidebar');sidebar.id='cc26-cart-sidebar';
    sidebar.setAttribute('aria-hidden','true');sidebar.inert=true;
    var overlay=el('button','cc26-cart-sidebar__overlay');
    overlay.type='button';overlay.tabIndex=-1;overlay.setAttribute('aria-label','Fechar orçamento');
    var panel=el('aside','cc26-cart-sidebar__panel');
    panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
    panel.setAttribute('aria-labelledby','cc26-cart-sidebar-title');
    panel.tabIndex=-1;
    var head=el('div','cc26-cart-sidebar__head');
    var meta=el('div','cc26-cart-sidebar__head-content');
    meta.appendChild(el('span','cc26-cart-sidebar__eyebrow','CABCOM'));
    var title=el('h2','cc26-cart-sidebar__title','Meu orçamento');
    title.id='cc26-cart-sidebar-title';meta.appendChild(title);
    meta.appendChild(el('p','cc26-cart-sidebar__subtitle','Revise os produtos selecionados.'));
    var close=el('button','cc26-cart-sidebar__close','×');
    close.type='button';close.setAttribute('aria-label','Fechar orçamento');
    head.appendChild(meta);head.appendChild(close);
    var body=el('div','cc26-cart-sidebar__body');
    body.setAttribute('aria-live','polite');
    body.setAttribute('aria-atomic','true');
    var foot=el('div','cc26-cart-sidebar__foot');
    panel.appendChild(head);panel.appendChild(body);panel.appendChild(foot);
    sidebar.appendChild(overlay);sidebar.appendChild(panel);
    d.body.appendChild(sidebar);
    trigger.setAttribute('aria-haspopup','dialog');
    trigger.setAttribute('aria-controls',sidebar.id);
    trigger.setAttribute('aria-expanded','false');
    var open=false,oldFocus=null,oldOverflow='',fetchController=null,fetchSeq=0,updateTimer=null;
    function safeHref(raw,onlySameOrigin){
      if(!raw || /^(#|javascript:|data:)/i.test(raw))return '';
      try{
        var u=new URL(raw,location.href);
        if(!/^https?:$/.test(u.protocol))return '';
        if(onlySameOrigin && u.origin!==location.origin)return '';
        return u.href;
      }catch(e){return '';}
    }
    function text(node){
      return node?(node.textContent||'').replace(/\s+/g,' ').trim():'';
    }
    function money(node){
      var match=text(node).match(/R\$\s*(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}/g);
      return match?match[match.length-1].replace(/\s+/g,' '):'';
    }
    function first(root,list){
      for(var i=0;i<list.length;i++){
        var found=root.querySelector(list[i]);
        if(found)return found;
      }
      return null;
    }
    function readQty(item){
      var input=first(item,['.quantidade input[name]','input[name*="quantidade"]','input[name*="qtd"]','input[type="number"]']);
      var value=input&&input.value;
      if(!value){
        var node=first(item,['[data-quantity]','[data-qtd]','.quantidade','.item-quantidade','.qtd']);
        value=node&&(node.getAttribute('data-quantity')||node.getAttribute('data-qtd')||text(node));
      }
      var q=String(value||'').match(/^\s*(\d{1,4})\s*$/);
      return q?Number(q[1]):null;
    }
    function readRow(row){
      // Ignorar placeholders de templates e subtotal.
      var anchor=first(row,['.produto-info a[href]','a.nome-produto[href]','.nome-produto a[href]','.imagem-produto a[href]','a[href]']);
      var name=text(first(row,['.produto-info > a[href]','.nome-produto','.produto-nome','.produto-info a[href]','.info-produto a[href]','a.nome-produto[href]']));
      if(!name&&anchor)name=text(anchor);
      if(!name || /--[A-Z_]+--|carrinho vazio|ir para o carrinho/i.test(name)||/^R\$/.test(name))return null;
      var image=first(row,['.produto-info img','.imagem-produto img','.produto-imagem img','img']);
      var rawImage=image&&(image.getAttribute('data-src')||image.getAttribute('src')||image.currentSrc||image.src);
      var imageHref=safeHref(rawImage,false);
      var productHref=anchor?safeHref(anchor.getAttribute('href'),true):'';
      if(productHref && /\/carrinho(?:\/|$)|\/conta(?:\/|$)/i.test(new URL(productHref).pathname))productHref='';
      var price=money(first(row,['.preco-promocional','.preco-venda','.preco-produto','.preco-por','.item-preco','.preco','.valor']));
      return {name:name.slice(0,210),href:productHref,image:imageHref,quantity:readQty(row),price:price};
    }
    function readItems(root,selectors){
      for(var i=0;i<selectors.length;i++){
        var nodes=[].slice.call(root.querySelectorAll(selectors[i]));
        if(!nodes.length)continue;
        var items=[],seen=new Set();
        nodes.forEach(function(node,index){
          if(index>=90)return;
          var row=readRow(node);
          if(!row)return;
          // Preservar produtos iguais com variacao/linha diferente.
          var key=(node.getAttribute('data-produto-id')||node.getAttribute('data-sku')||'')+':'+row.name+':'+index;
          if(seen.has(key))return;
          seen.add(key);items.push(row);
        });
        if(items.length)return items;
      }
      return [];
    }
    function parseSource(root,source){
      var native=source==='minicart';
      var itemSelectors=native?[
        '#cabecalho .carrinho-interno-ajax .produto',
        '#cabecalho .carrinho-interno-ajax li',
        '#cabecalho .carrinho-interno li',
        '#cabecalho .carrinho-produtos li',
        '#cabecalho .carrinho-interno .item',
        '.carrinho-interno-ajax .produto','.carrinho-interno li'
      ]:[
        'table.tabela-carrinho tr[data-produto-id]',
        '.tabela-carrinho tbody tr',
        '.carrinho-principal .tabela-carrinho tr',
        '.carrinho-produtos .produto','.carrinho-item'
      ];
      var items=readItems(root,itemSelectors);
      var totalSelectors=native?[
        '#cabecalho .carrinho-interno-ajax .carrino-total strong',
        '#cabecalho .carrinho-interno .carrino-total strong',
        '#cabecalho .carrinho-interno .total strong',
        '#cabecalho .carrinho-interno .total','.carrinho-interno-ajax .carrino-total strong',
        '.carrinho-interno .carrino-total strong'
      ]:[
        '.valor-total strong','.valor-total','.tabela-carrinho tfoot .total',
        '.total-carrinho strong','.carrino-total strong'
      ];
      var total='';
      for(var i=0;i<totalSelectors.length;i++){
        var node=root.querySelector(totalSelectors[i]);
        total=money(node);
        if(total)break;
      }
      var count=null;
      if(native){
        var countNode=first(root,['#cabecalho .qtd-carrinho','#cabecalho .carrinho .quantidade','#cabecalho [data-cart-count]']);
        var countMatch=String(countNode&&(countNode.getAttribute('data-cart-count')||text(countNode))||'').match(/^\s*(\d{1,5})\s*$/);
        if(countMatch)count=Number(countMatch[1]);
      }
      var empty=!!root.querySelector('.carrinho-vazio,.carrinho-empty,.carrinho-sem-produtos') ||
        (!native && !!root.querySelector('.pagina-carrinho .caixa-destaque,.carrinho-vazio'));
      return {items:items,total:total,count:count,empty:empty,source:source};
    }
    function updateBadge(count){
      if(count===null||!Number.isFinite(count))return;
      var badge=trigger.querySelector('.cc26-site-header__count');
      if(!badge){badge=el('span','cc26-site-header__count');trigger.appendChild(badge);}
      var label=count>99?'99+':String(count);
      if(badge.textContent!==label)badge.textContent=label;
      badge.hidden=count===0;
      trigger.setAttribute('aria-label',count?'Meu orçamento, '+count+' itens':'Meu orçamento vazio');
    }
    function show(data,mode){
      body.replaceChildren();foot.replaceChildren();
      var items=data&&data.items||[];
      if(mode==='loading'){
        var status=el('div','cc26-cart-sidebar__status');
        var spinner=el('span','cc26-cart-sidebar__spinner');
        spinner.setAttribute('aria-hidden','true');status.appendChild(spinner);
        status.appendChild(el('p','','Consultando seu orçamento...'));
        body.appendChild(status);
      }else if(items.length){
        var list=el('div','cc26-cart-sidebar__list');
        items.forEach(function(it){
          var item=el('article','cc26-cart-sidebar__item');
          var thumb=el('div','cc26-cart-sidebar__thumb');
          if(it.image){
            var im=el('img');im.src=it.image;im.alt=it.name;im.loading='lazy';im.decoding='async';
            thumb.appendChild(im);
          }else thumb.appendChild(inlineIcon('cart'));
          var info=el('div','cc26-cart-sidebar__info');
          info.appendChild(it.href?a(it.href,'cc26-cart-sidebar__item-title',it.name):el('strong','cc26-cart-sidebar__item-title',it.name));
          if(it.quantity!==null)info.appendChild(el('span','cc26-cart-sidebar__quantity','Quantidade: '+it.quantity));
          if(it.price)info.appendChild(el('strong','cc26-cart-sidebar__price',it.price));
          item.appendChild(thumb);item.appendChild(info);list.appendChild(item);
        });
        body.appendChild(list);
        var summary=el('div','cc26-cart-sidebar__summary');
        summary.appendChild(el('span','','Total informado pela loja'));
        if(data.total)summary.appendChild(el('strong','',data.total));
        else summary.appendChild(el('span','cc26-cart-sidebar__pending','Consultar no carrinho'));
        foot.appendChild(summary);
        foot.appendChild(el('small','cc26-cart-sidebar__note','Quantidades, frete e condições finais são confirmados pela Loja Integrada.'));
      }else{
        var status=el('div','cc26-cart-sidebar__status');
        var icon=el('span','cc26-cart-sidebar__empty-icon');
        icon.appendChild(inlineIcon(mode==='empty'?'cart':'shield'));
        status.appendChild(icon);
        status.appendChild(el('h3','',mode==='empty'?'Seu orçamento está vazio':'Resumo temporariamente indisponível'));
        status.appendChild(el('p','',mode==='empty'?'Escolha os produtos para montar seu orçamento.':'Consulte os itens e finalize na página oficial da loja.'));
        body.appendChild(status);
      }
      if(mode!=='loading'){
        foot.appendChild(a(mode==='empty'?location.origin+'/':url,'cc26-cart-sidebar__checkout',mode==='empty'?'CONTINUAR NA LOJA':'VER ORÇAMENTO E FINALIZAR'));
        var back=el('button','cc26-cart-sidebar__continue','Continuar comprando');
        back.type='button';back.addEventListener('click',closeSidebar);
        foot.appendChild(back);
      }
      if(data)updateBadge(data.count);
      state.cartSidebar={open:open,mode:mode,source:data&&data.source||'sem-dados'};
    }
    function fetchOfficial(existing){
      if(!open)return;
      if(fetchController)fetchController.abort();
      fetchController=typeof AbortController!=='undefined'?new AbortController():null;
      var controller=fetchController,seq=++fetchSeq;
      if(!existing || !existing.items.length)show(null,'loading');
      var options={method:'GET',credentials:'same-origin',cache:'no-store',headers:{Accept:'text/html'}};
      if(controller)options.signal=controller.signal;
      w.fetch(url,options)
        .then(function(resp){
          if(!resp.ok || !resp.headers.get('content-type') || resp.headers.get('content-type').indexOf('text/html')<0
             || new URL(resp.url,location.href).origin!==location.origin)throw new Error('Carrinho indisponível');
          return resp.text();
        })
        .then(function(html){
          if(!open||seq!==fetchSeq||(controller&&controller.signal.aborted))return;
          var parsed=new DOMParser().parseFromString(html,'text/html');
          var official=parseSource(parsed,'carrinho');
          if(official.items.length){
            official.count=existing?existing.count:null;
            show(official,'items');
          }else if(official.empty || existing&&existing.count===0)show({items:[],count:0,source:'carrinho'},'empty');
          else if(existing&&existing.items.length){
            var retained={items:existing.items,total:official.total||existing.total,count:existing.count,source:existing.source};
            show(retained,'items');
          }else show({items:[],count:null,source:'carrinho'},'unavailable');
        })
        .catch(function(err){
          if(!open || seq!==fetchSeq || controller&&controller.signal.aborted)return;
          warn('Carrinho lateral: '+err.message);
          if(existing&&existing.items.length)show(existing,'items');
          else show({items:[],count:null},'unavailable');
        })
        .finally(function(){if(fetchController===controller)fetchController=null;});
    }
    function refresh(fallback){
      var native=parseSource(d,'minicart');
      updateBadge(native.count);
      if(!open)return;
      if(native.items.length){
        show(native,'items');
        if(fallback)fetchOfficial(native);
      }else if(native.count===0){
        show(native,'empty');
        if(fallback)fetchOfficial(native); // Confirmar a LI quando o mini carrinho estiver desatualizado.
      }else if(fallback && cfg.carrinhoLateral.consultarCarrinho!==false && w.fetch){
        fetchOfficial(native);
      }else show({items:[],count:native.count,source:'minicart'},'unavailable');
    }
    function openSidebar(ev){
      if(ev)ev.preventDefault();
      if(open)return;
      oldFocus=d.activeElement;oldOverflow=d.body.style.overflow;
      open=true;sidebar.inert=false;sidebar.setAttribute('aria-hidden','false');
      sidebar.classList.add('is-open');trigger.setAttribute('aria-expanded','true');
      d.body.style.overflow='hidden';
      close.focus({preventScroll:true});
      refresh(true);
    }
    function closeSidebar(){
      if(!open)return;
      open=false;++fetchSeq;
      if(fetchController)fetchController.abort();
      sidebar.classList.remove('is-open');sidebar.setAttribute('aria-hidden','true');sidebar.inert=true;
      trigger.setAttribute('aria-expanded','false');d.body.style.overflow=oldOverflow;
      if(oldFocus&&d.contains(oldFocus)&&oldFocus.focus)oldFocus.focus({preventScroll:true});
      state.cartSidebar={open:false,mode:'closed'};
    }
    function onKeys(ev){
      if(!open)return;
      if(ev.key==='Escape'){ev.preventDefault();closeSidebar();return;}
      if(ev.key!=='Tab')return;
      var focusable=[].slice.call(panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])'))
        .filter(function(n){return n.getClientRects().length>0;});
      if(!focusable.length){ev.preventDefault();panel.focus();return;}
      var firstNode=focusable[0],last=focusable[focusable.length-1];
      if(ev.shiftKey&&d.activeElement===firstNode){ev.preventDefault();last.focus();}
      else if(!ev.shiftKey&&d.activeElement===last){ev.preventDefault();firstNode.focus();}
    }
    trigger.addEventListener('click',openSidebar);
    overlay.addEventListener('click',closeSidebar);
    close.addEventListener('click',closeSidebar);
    d.addEventListener('keydown',onKeys);
    var header=d.querySelector('#cabecalho');
    if(header && typeof MutationObserver==='function'){
      var observer=new MutationObserver(function(){
        if(!open)return;
        if(updateTimer)w.clearTimeout(updateTimer);
        updateTimer=w.setTimeout(function(){updateTimer=null;refresh(false);},150);
      });
      observer.observe(header,{subtree:true,childList:true,characterData:true,attributes:false});
    }
    cartSidebarApi={open:openSidebar,close:closeSidebar,refresh:function(){refresh(true);},get aberto(){return open;}};
    w.Cabcom2026.cartSidebar=cartSidebarApi;
    state.cartSidebar={open:false,mode:'ready',source:'Loja Integrada'};
  }
  function hero(corpo){
    if(!cfg.home.hero)return null;
    // Se a Loja Integrada oferece banner administravel, mantemos esse banner,
    // usando apenas o estilo Cabcom. Assim continua editavel no painel.
    var nativeBanner=corpo.querySelector('.banner.cheio, .banner-full, .banner-principal, .banner.vitrine, .banner-home');
    if(preview && cfg.home.previewHeroAprovado !== false){
      var shot=section('cc26-hero cc26-approved-preview-hero');
      var approved=img('fullbanner.jpg','Linha de cabos para Internet e Rede',true);
      var destination=navAnchor('CABOS DE REDE')||navAnchor('CABOS');
      var surface=destination?a(destination,'cc26-hero__link'):el('div','cc26-hero__link');
      surface.appendChild(approved);shot.appendChild(surface);
      corpo.parentNode.insertBefore(shot,corpo);
      approved.addEventListener('load',function(){
        if(nativeBanner)nativeBanner.classList.add('cc26-preview-native-banner-hidden');
      },{once:true});
      approved.addEventListener('error',function(){shot.remove();warn('Banner aprovado ausente no CDN. Banner nativo mantido.');},{once:true});
      return shot;
    }
    if(nativeBanner && nativeBanner.querySelector('img, picture')){
      nativeBanner.classList.add('cc26-native-hero');
      return nativeBanner;
    }
    var s=section('cc26-hero');
    var link=navAnchor('CABOS DE REDE')||navAnchor('CABOS');
    var element=link?a(link,'cc26-hero__link'):el('div','cc26-hero__link');
    var picture=img('fullbanner.jpg','Linha de cabos para Internet e Rede',true);
    picture.addEventListener('error',function(){s.remove();},{once:true});
    element.appendChild(picture);s.appendChild(element);
    corpo.parentNode.insertBefore(s,corpo);
    return s;
  }
  function benefits(){
    if(!cfg.home.beneficios)return null;
    var s=section('cc26-benefits');
    var content=wrap();content.classList.add('cc26-benefits__grid');
    var items=[
      ['truck','Receba em casa','Enviamos para todo o Brasil'],
      ['card','Pague no cartão','Consulte as condições de parcelamento'],
      ['tag','Condições especiais','Consulte descontos para pagamento à vista'],
      ['lock','Compra segura','Atendimento e pagamento pela loja']
    ];
    var icons={truck:'truck',card:'credit',tag:'tag',lock:'shield'};
    items.forEach(function(item){
      var box=el('div','cc26-benefit');
      var icon=el('span','cc26-benefit__icon');icon.appendChild(inlineIcon(icons[item[0]]));
      icon.setAttribute('aria-hidden','true');
      var words=el('div');
      words.appendChild(el('strong','',item[1]));
      words.appendChild(el('small','',item[2]));
      box.appendChild(icon);box.appendChild(words);content.appendChild(box);
    });
    s.appendChild(content);return s;
  }
  function presentation(){
    if(!cfg.home.apresentacao)return null;
    var s=section('cc26-presentation');
    var shell=wrap();shell.classList.add('cc26-presentation__layout');
    var media=img('cabos.jpg','Fibra óptica e conectividade');
    media.classList.add('cc26-presentation__image');
    var copy=el('div','cc26-presentation__copy');
    var heading=el('h2');
    heading.appendChild(el('strong','','Cabos'));
    heading.appendChild(el('span','','que ligam o mundo'));
    copy.appendChild(heading);
    copy.appendChild(el('p','','Os cabos são elementos fundamentais para a transmissão de energia elétrica e sinais de comunicação. Eles são compostos por fios condutores revestidos por um material isolante e protegidos por uma camada externa. Os cabos são usados em uma variedade de aplicações, como eletrônica, automação industrial, telecomunicações, construção e muito mais. Eles são projetados para suportar ambientes adversos e garantir uma boa condutividade elétrica e comunicação confiável. Existem vários tipos de cabos, como cabos de alimentação, cabos de dados, cabos de áudio e vídeo, cabos de automação e outros. Cada tipo é projetado para atender a necessidades específicas e requisitos técnicos.'));
    shell.appendChild(media);shell.appendChild(copy);s.appendChild(shell);return s;
  }
  function categoryGrid(type){
    var cables=type==='cabos';
    if(cables&&!cfg.home.cabos || !cables&&!cfg.home.conectores)return null;
    var data=cables?[
      ['cabos_01.png','Cabos de Energia','CABOS DE ENERGIA'],
      ['cabos_03.png','Cabos Coaxiais','CABOS COAXIAIS'],
      ['cabos_05.png','Cabos para Automação','AUTOMAÇÃO'],
      ['cabos_07.png','Cabos para Broadcast','BROADCAST'],
      ['cabos_12.png','Cabos de Controle','CABOS DE CONTROLE'],
      ['cabos_13.png','Cabos para CFTV','CFTV'],
      ['cabos_14.png','Cabos de Rede','CABOS DE REDE'],
      ['cabos_15.png','Cabos Anti-Incêndio','INCÊNDIO']
    ]:[
      ['conect1.png','Conectores P10','CONECTORES P10'],
      ['conect2.png','Conectores XLR','CONECTORES XLR'],
      ['conect3.png','Conectores Powercon','CONECTORES POWERCON'],
      ['conect4.png','Conectores Speak-on','CONECTORES SPEAK-ON'],
      ['conect5.png','Conectores UHF','CONECTORES UHF'],
      ['conect6.png','Conectores DIN','DIN'],
      ['conect7.png','Conectores RJ45','CONECTORES RJ45'],
      ['conect8.png','Conectores EIA','EIA']
    ];
    var s=section('cc26-category-grid cc26-category-grid--'+type);
    var grid=wrap();grid.classList.add('cc26-category-grid__inner');
    var intro=el('div','cc26-category-grid__intro');
    var introName=cables?'cabos-bg.jpg':'redes-bg.jpg';
    intro.appendChild(img(introName,''));
    intro.appendChild(el('h2','',cables?'Cabos em destaque':'Conectores em destaque'));
    grid.appendChild(intro);
    var cards=el('div','cc26-category-grid__cards');
    var count=0;
    data.forEach(function(item){
      var url=navAnchor(item[2]);
      if(!url) return;
      var card=a(url,'cc26-category-card');
      var im=img(item[0],item[1]);im.loading='lazy';
      card.appendChild(im);card.appendChild(el('strong','',item[1]));
      cards.appendChild(card);count++;
    });
    if(!count)return null;
    grid.appendChild(cards);s.appendChild(grid);return s;
  }
  function shortcutSource(){
    // Fonte exclusiva: imagens do banner-central-marcas cadastrado no painel LI.
    var nodes=[].slice.call(d.querySelectorAll(
      '#corpo .banner-central-marcas, #corpo #banner-central-marcas, .banner-central-marcas, #banner-central-marcas'
    ));
    return nodes.find(function(node){
      return !node.closest('.cc26-section') && node.querySelector('img');
    })||null;
  }
  function readShortcuts(source){
    if(!source)return [];
    var result=[],seen={};
    [].slice.call(source.querySelectorAll('img')).forEach(function(im){
      if(result.length>=12)return;
      var url=im.getAttribute('data-src')||im.getAttribute('data-original')||
        im.getAttribute('src')||im.currentSrc||im.src;
      if(!url||url.indexOf('data:')===0)return;
      try{url=new URL(url,location.href).href;}catch(e){return;}
      if(seen[url])return;
      var link=im.closest('a[href]');
      var text=(link&&link.textContent||'').replace(/\s+/g,' ').trim();
      var alt=(im.getAttribute('alt')||'').trim();
      if(!text && im.parentElement) {
        var label=im.parentElement.querySelector('h2,h3,h4,strong,span');
        if(label)text=(label.textContent||'').replace(/\s+/g,' ').trim();
      }
      text=(text||alt).slice(0,70);
      var href='';
      if(link){
        try{
          var parsed=new URL(link.href,location.href);
          if(parsed.origin===location.origin && parsed.protocol.indexOf('http')===0)href=parsed.href;
        }catch(e){}
      }
      if(!href && text)href=navAnchor(text);
      if(!href)return; // Nunca simular link de categoria que nao existe.
      seen[url]=true;result.push({url:url,href:href,label:text});
    });
    return result;
  }
  function shortcuts(){
    if(!cfg.home.atalhos)return null;
    var source=shortcutSource(),items=readShortcuts(source);
    if(!items.length) {
      warn('banner-central-marcas sem imagens/links de categorias acessiveis; atalhos aguardando fonte LI');
      return null;
    }
    var s=section('cc26-shortcuts');
    var grid=wrap();grid.classList.add('cc26-shortcuts__grid');
    items.slice(0,8).forEach(function(item){
      var link=a(item.href,'cc26-shortcut');
      var med=el('span','cc26-shortcut__media');
      var picture=el('img');picture.src=item.url;picture.alt=item.label||'Categoria Cabcom';
      picture.decoding='async';picture.loading='lazy';
      imageTransition(picture);
      med.appendChild(picture);link.appendChild(med);
      if(item.label)link.appendChild(el('strong','cc26-shortcut__label',item.label));
      link.setAttribute('aria-label',item.label||'Abrir categoria');
      grid.appendChild(link);
    });
    if(!grid.children.length)return null;
    s.appendChild(grid);
    state.shortcuts={origin:'Loja Integrada / banner-central-marcas',count:grid.children.length};
    return s;
  }
  function nativeMediaItems(source,limit){
    var results=[],seen={};
    if(!source)return results;
    [].slice.call(source.querySelectorAll('img')).forEach(function(image){
      if(results.length>=limit)return;
      var candidate=image.getAttribute('data-src')||image.getAttribute('data-original')||image.getAttribute('src')||image.currentSrc||image.src;
      if(!candidate || candidate.indexOf('data:image')===0)return;
      var absolute;
      try {absolute=new URL(candidate,location.href);}catch(e){return;}
      if(!/^https?:$/.test(absolute.protocol) || seen[absolute.href])return;
      seen[absolute.href]=true;
      var owner=image.closest('a[href]'), link=owner?owner.href:'';
      if(link){
        try {var valid=new URL(link,location.href);if(!/^https?:$/.test(valid.protocol))link='';else link=valid.href;}
        catch(e){link='';}
      }
      results.push({image:absolute.href,link:link,alt:image.getAttribute('alt')||''});
    });
    return results;
  }
  function findNativeMiniSources(){
    // Nunca usar Banner Vitrine, banners-extras ou imagem arbitraria.
    var candidates=[].slice.call(d.querySelectorAll(
      '#corpo .banner.mini, #corpo .mini-banner, #corpo .mini-banners, #corpo .banner-mini, #corpo .banners-mini, #corpo [data-posicao="minibanner"], #corpo [data-banner-position="mini"], #corpo [data-banner-type="mini"], #corpo [data-banner-posicao="mini"]'
    )).filter(function(node){return !node.closest('.cc26-section');});
    return candidates.filter(function(node){
      return !candidates.some(function(parent){return parent!==node && parent.contains(node);});
    });
  }
  function miniBanners(){
    if(cfg.home.miniBanners===false || !cfg.home.miniBanners)return null;
    var sources=findNativeMiniSources(),items=[],unique={};
    sources.forEach(function(source){
      nativeMediaItems(source,8).forEach(function(item){
        if(items.length>=4 || unique[item.image])return;
        unique[item.image]=true;items.push(item);
      });
    });
    if(items.length<2){
      warn('Mini Banner LI nao foi exposto no DOM: mantido sem inventar imagens');
      return null;
    }
    var s=section('cc26-mini-banners');
    var grid=wrap();grid.classList.add('cc26-mini-banners__grid');
    items.forEach(function(item){
      var tile=item.link?a(item.link,'cc26-mini-banner'):el('div','cc26-mini-banner');
      var picture=el('img');picture.src=item.image;picture.alt=item.alt;picture.loading='lazy';picture.decoding='async';
      tile.appendChild(picture);grid.appendChild(tile);
    });
    s.appendChild(grid);
    s.dataset.nativeSource='minibanner';
    sources.forEach(function(source){source.classList.add('cc26-mini-native-hidden');});
    state.miniBanners={origin:'Loja Integrada / Mini Banner',count:items.length};
    return s;
  }
  function findNativeBrandSource(){
    var sources=[].slice.call(d.querySelectorAll('#corpo .marcas.hidden-phone, #corpo .marcas, .marcas.hidden-phone'));
    return sources.find(function(node){
      return !node.closest('.cc26-section') && nativeMediaItems(node,25).length>=2;
    })||null;
  }
  function brands(){
    if(!cfg.home.marcas)return null;
    var source=findNativeBrandSource();
    if(!source){warn('Marcas nativas da LI nao encontradas: sem logotipos artificiais');return null;}
    var items=nativeMediaItems(source,25);
    if(items.length<2)return null;
    var s=section('cc26-brands');
    var content=wrap();
    content.appendChild(title('Compre por marca'));
    var carousel=el('div','cc26-brands__carousel');
    var prev=el('button','cc26-brands__arrow cc26-brands__arrow--prev');
    prev.type='button';prev.setAttribute('aria-label','Marcas anteriores');
    prev.appendChild(inlineIcon('arrow'));
    var list=el('div','cc26-brands__track');
    list.setAttribute('role','group');list.setAttribute('aria-label','Marcas cadastradas');
    items.forEach(function(item){
      var link=item.link?a(item.link,'cc26-brands__brand'):el('div','cc26-brands__brand');
      var image=el('img');image.src=item.image;image.alt=item.alt||'Marca';image.loading='lazy';image.decoding='async';
      link.appendChild(image);list.appendChild(link);
    });
    var next=el('button','cc26-brands__arrow cc26-brands__arrow--next');
    next.type='button';next.setAttribute('aria-label','Proximas marcas');
    next.appendChild(inlineIcon('arrow'));
    function move(direction){list.scrollBy({left:direction*Math.max(list.clientWidth*.72,210),behavior:'smooth'});}
    prev.addEventListener('click',function(){move(-1);});
    next.addEventListener('click',function(){move(1);});
    carousel.appendChild(prev);carousel.appendChild(list);carousel.appendChild(next);
    content.appendChild(carousel);s.appendChild(content);
    source.classList.add('cc26-brands-native-hidden');
    state.brands={origin:'Loja Integrada / marcas',count:items.length};
    return s;
  }
  function institutional(){
    if(!cfg.home.institucional)return null;
    var s=section('cc26-institutional');
    var c=wrap();
    var panel=el('div','cc26-institutional__panel');
    panel.appendChild(el('div','cc26-institutional__eyebrow','CABCOM · FIOS E CABOS ELÉTRICOS'));
    panel.appendChild(el('h2','',cfg.conteudo.tituloEmpresa));
    panel.appendChild(el('p','',cfg.conteudo.textoEmpresa));
    var about=navAnchor('A CABCOM')||navAnchor('SOBRE NÓS');
    if(about)panel.appendChild(a(about,'cc26-institutional__cta','Conheça a Cabcom'));
    c.appendChild(panel);s.appendChild(c);return s;
  }
  function instagram(){
    if(!cfg.home.instagram)return null;
    var link=safeInstagram(cfg.conteudo.instagram);
    var s=section('cc26-instagram');
    var c=wrap(), heading=el('div','cc26-instagram__title');
    heading.appendChild(el('span','','Siga-nos no Instagram'));
    heading.appendChild(el('strong','','@cabcomoficial'));
    c.appendChild(heading);
    var media=link?a(link,'cc26-instagram__link'):el('div','cc26-instagram__link');
    if(link){media.target='_blank';media.rel='noopener noreferrer';}
    media.appendChild(img('insta.png','Publicações da Cabcom no Instagram'));
    c.appendChild(media);s.appendChild(c);return s;
  }
  function decorateNativeShelves(){
    var listing=d.querySelector('#listagemProdutos');
    if(!listing)return;
    listing.classList.add('cc26-native-listing');
    [].slice.call(listing.querySelectorAll('.titulo-categoria')).forEach(function(title){
      title.classList.add('cc26-native-shelf-title');
    });
    [].slice.call(listing.querySelectorAll('.produtos-carrossel')).forEach(function(shelf){
      shelf.classList.add('cc26-native-carousel');
      [].slice.call(shelf.querySelectorAll('.listagem-item')).forEach(function(card){
        card.classList.add('cc26-native-carousel-card');
      });
    });
  }
  function enhanceShelves(corpo){
    var shelves=[].slice.call(corpo.querySelectorAll('.listagem, .vitrine-produtos'));
    return shelves.filter(function(sh){
      if(sh.classList.contains('cc26-enhanced-shelf'))return true;
      var items=sh.querySelectorAll('.listagem-item, .produto, li.listagem-item');
      if(!items.length)return false;
      sh.classList.add('cc26-enhanced-shelf');
      // Nao aplicar display:grid sobre sliders nativos (Slick, Owl, Swiper).
      if (!sh.querySelector('.owl-carousel, .slick-slider, .slick-initialized, .swiper, .flexslider') && !/owl|slick|swiper|flexslider/i.test(sh.className)) sh.classList.add('cc26-grid-safe');
      return true;
    });
  }
  function homeContent(){
    if(!home||!cfg.home.ativo)return;
    var corpo=d.querySelector('#corpo');
    if(!corpo)return;
    if(d.querySelector('.cc26-benefits'))return;
    var nativeHero=hero(corpo);
    var benefitsNode=benefits(),presentNode=presentation();
    if(benefitsNode){
      if(nativeHero && nativeHero.parentNode===corpo)corpo.insertBefore(benefitsNode,nativeHero.nextSibling);
      else corpo.insertBefore(benefitsNode,corpo.firstChild);
    }
    if(presentNode){
      if(benefitsNode)insertAfter(benefitsNode,presentNode);
      else corpo.insertBefore(presentNode,corpo.firstChild);
    }
    var shelves=enhanceShelves(corpo);
    var cabos=categoryGrid('cabos'),conect=categoryGrid('conectores');
    var shortcut=shortcuts(),mini=miniBanners(),brand=brands(),inst=institutional(),ig=instagram();
    // Ordem do layout aprovado: vitrines, cabos, atalhos, conectores, mais vendidos, mini banners, marcas.
    // Preserva os produtos e suas acoes nativas da Loja Integrada.
    var first=shelves[0],second=shelves[1];
    if(first&&first.parentNode){
      var target=first;
      [cabos,shortcut,conect].forEach(function(node){if(node){insertAfter(target,node);target=node;}});
    }else [cabos,shortcut,conect].forEach(function(node){if(node)corpo.appendChild(node);});
    var miniAnchor=second || (corpo.querySelector('#listagemProdutos .produtos-carrossel:last-of-type')) || first;
    if(miniAnchor && miniAnchor.parentNode){
      var next=miniAnchor;
      [mini,brand].forEach(function(node){if(node){insertAfter(next,node);next=node;}});
    }else [mini,brand].forEach(function(node){if(node)corpo.appendChild(node);});
    [inst,ig].forEach(function(node){if(node)corpo.appendChild(node);});
    corpo.classList.add('cc26-native-home');
  }
  // v1.2 | Cart/quote page progressive enhancement, modeled after TractorBel.
  // Never replace original checkout, quotation, or native cart form/handlers.
  function enhanceCartPage(){
    if(!/^\/carrinho(?:\/index)?\/?$/i.test(location.pathname) &&
       !d.body.classList.contains('pagina-carrinho')) return;
    d.body.classList.add('cc26-page-cart');
    var scope=d.querySelector('#corpo .secao-principal')||d.querySelector('#corpo');
    if(!scope)return;
    var cart=scope.querySelector('.finalizar-compra');
    var empty=scope.querySelector('.caixa-destaque');
    if(empty && !cart){
      d.body.classList.add('cc26-cart-empty');
      empty.classList.add('cc26-cart-empty__panel');
      return;
    }
    if(!cart)return;
    var table=cart.querySelector('table.tabela-carrinho');
    if(!table)return;
    d.body.classList.add('cc26-cart-ready');
    scope.classList.add('cc26-cart-page');
    cart.classList.add('cc26-cart-shell');
    table.classList.add('cc26-cart-table');
    var nativeMain=cart.querySelector('.caixa-sombreada');
    if(nativeMain)nativeMain.classList.add('cc26-cart-main');
    var action=cart.querySelector('.acao-editar');
    if(action)action.classList.add('cc26-cart-actions');
    var nativeCheckout=[].slice.call(cart.querySelectorAll('form[action]')).find(function(f){
      return /\/checkout\/redirect\/?(?:\?|$)/i.test(f.getAttribute('action')||'');
    });
    if(nativeCheckout){
      nativeCheckout.classList.add('cc26-cart-checkout-form');
      var holder=nativeMain || table;
      if(holder.parentNode===cart && nativeCheckout.parentNode===cart){
        cart.classList.add('cc26-cart-two-column');
      }
    }
    var rows=[].slice.call(table.querySelectorAll('tr[data-produto-id]'));
    rows.forEach(function(row){
      row.classList.add('cc26-cart-item');
      var link=row.querySelector('.produto-info > a[href]');
      var name=link?link.textContent.replace(/\s+/g,' ').trim():'produto';
      var controls=[
        ['.quantidade a.icon-minus','Diminuir quantidade de '],
        ['.quantidade a.icon-plus','Aumentar quantidade de '],
        ['.excluir a','Remover ']
      ];
      controls.forEach(function(entry){
        var ctrl=row.querySelector(entry[0]);
        if(ctrl && !ctrl.hasAttribute('aria-label'))ctrl.setAttribute('aria-label',entry[1]+name);
      });
    });
    if(!nativeCheckout)return; // Nao criar um resumo/CTA falso sem formulario oficial.
    var summary=nativeCheckout.querySelector('.cc26-cart-summary');
    if(!summary){
      summary=el('section','cc26-cart-summary');
      summary.setAttribute('aria-label','Resumo do pedido');
      summary.appendChild(el('span','cc26-cart-summary__eyebrow','CABCOM'));
      summary.appendChild(el('h2','cc26-cart-summary__title','Resumo do pedido'));
      var total=el('div','cc26-cart-summary__total');
      total.appendChild(el('span','','Total informado pela loja'));
      total.appendChild(el('strong','cc26-cart-summary__value',''));
      summary.appendChild(total);
      summary.appendChild(el('p','cc26-cart-summary__note','Valores e condições finais são confirmados pela Loja Integrada.'));
      nativeCheckout.insertBefore(summary,nativeCheckout.firstChild);
    }
    var value=summary.querySelector('.cc26-cart-summary__value');
    // Reproduz somente texto monetario que a propria LI exibe, sem calculos.
    var totalNode=cart.querySelector('.valor-total strong, .valor-total .preco, .valor-total');
    if(value){
      var original=totalNode?(totalNode.textContent||'').replace(/\s+/g,' ').trim():'';
      var matched=original.match(/R\$\s*[\d.]+,\d{2}/);
      var displayed=matched?matched[0]:'';
      if(value.textContent!==displayed)value.textContent=displayed;
      summary.classList.toggle('cc26-cart-summary--no-total',!displayed);
    }
  }
  function footer(){
    if(!cfg.rodape.ativo || d.getElementById('cc26-footer'))return;
    var native=d.querySelector('#rodape');
    if(!native)return;
    // Conteudo derivado do rodape nativo; alteracoes no painel LI reaparecem no proximo carregamento.
    var sourceLinks=[].slice.call(native.querySelectorAll('a[href]'));
    function matchingLink(expression){
      return sourceLinks.find(function(node){
        return expression.test(normalized(node.textContent||node.getAttribute('title')||''));
      });
    }
    function hrefOf(node){
      if(!node)return '';
      try{
        var u=new URL(node.href,location.href);
        return /^(https?:|mailto:|tel:)$/.test(u.protocol)?u.href:'';
      }catch(e){return '';}
    }
    function footerColumn(name,klass){
      var col=el('section','cc26-footer__column '+klass);
      col.appendChild(el('h3','',name));
      return col;
    }
    function originalLink(regex,label){
      var n=matchingLink(regex),href=hrefOf(n);
      if(!href)return null;
      return a(href,'cc26-footer__navlink',label||n.textContent.trim());
    }
    var f=el('footer','cc26-footer');f.id='cc26-footer';
    f.setAttribute('aria-label','Rodape Cabcom');
    var main=el('div','cc26-footer__main');
    var grid=wrap();grid.classList.add('cc26-footer__grid');
    var contact=footerColumn('Fale Conosco','cc26-footer__contact');
    var phone=sourceLinks.find(function(l){return /^tel:/i.test(l.getAttribute('href')||'')}) ||
      sourceLinks.find(function(l){return /wa\.me|api\.whatsapp\.com/i.test(l.href||'')});
    var number=phone?(phone.textContent||'').trim().replace(/\s+/g,' '):'';
    if(!number || number.length>60)number=cfg.conteudo.contato;
    var telLink=hrefOf(phone)||'tel:'+String(cfg.conteudo.contato||'').replace(/[^\d+]/g,'');
    function contactLine(kind,href,label){
      var node=href?a(href,'cc26-footer__contact-line'):el('p','cc26-footer__contact-line');
      var ico=inlineIcon(kind);ico.setAttribute('aria-hidden','true');
      node.appendChild(ico);node.appendChild(el('span','',label));
      contact.appendChild(node);
    }
    if(number&&telLink)contactLine('phone',telLink,number);
    var email=sourceLinks.find(function(l){return /^mailto:/i.test(l.getAttribute('href')||'')});
    var emailValue=email?(email.textContent||'').trim():cfg.conteudo.email;
    if(emailValue)contactLine('mail',hrefOf(email)||('mailto:'+emailValue),emailValue);
    var hours=(native.textContent||'').match(/(?:Segunda|Seg)[^\n]{0,95}(?:18(?::?00)?\s*h?|[0-2]\d:\d{2})/i);
    if(hours)contactLine('clock','',hours[0].replace(/\s+/g,' ').slice(0,110));
    var logo=el('img');logo.className='cc26-footer__logo';logo.src=asset('logo.png');logo.alt='Cabcom';
    var nativeLogo=d.querySelector('#cabecalho .logo img');
    if(nativeLogo)logo.src=nativeLogo.currentSrc||nativeLogo.src||logo.src;
    contact.appendChild(logo);
    var social=el('div','cc26-footer__social');
    sourceLinks.forEach(function(link){
      var address=hrefOf(link);
      if(!address||!/instagram\.com|facebook\.com/i.test(address)||social.children.length>=2)return;
      var text=/instagram/i.test(address)?'Instagram':'Facebook';
      var clone=a(address,'cc26-footer__social-link');
      clone.appendChild(inlineIcon(text==='Instagram'?'instagram':'facebook'));
      clone.setAttribute('aria-label',text);
      clone.target='_blank';clone.rel='noopener noreferrer';social.appendChild(clone);
    });
    if(social.children.length)contact.appendChild(social);
    var account=footerColumn('Minha Conta','cc26-footer__account');
    [
      [/^MINHA CONTA$/,'Minha conta'],
      [/^CRIAR (UMA )?CONTA$/,'Criar uma conta'],
      [/^MEUS PEDIDOS$/,'Meus pedidos'],
      [/^MINHA SACOLA$|^MEU CARRINHO$|^MEU ORCAMENTO$/,'Minha sacola'],
      [/POLITICA DE DEVOLUCAO/,'Política de Devolução'],
      [/^COMO COMPRAR$/,'Como comprar'],
      [/^SEGURANCA$/,'Segurança']
    ].forEach(function(item){var link=originalLink(item[0],item[1]);if(link)account.appendChild(link);});
    var institutional=footerColumn('Institucional','cc26-footer__institutional');
    [
      [/^SOBRE NOS$|^QUEM SOMOS$|^A CABCOM$/,'Sobre nós'],
      [/^NOTICIAS$/,'Notícias'],
      [/^NOSSAS LINHAS$/,'Nossas linhas'],
      [/^FALE CONOSCO$|^CONTATO$/,'Fale conosco'],
      [/POLITICA DE PRIVACIDADE/,'Política de Privacidade'],
      [/PROGRAMA DE INTEGRIDADE/,'Programa de Integridade']
    ].forEach(function(item){var link=originalLink(item[0],item[1]);if(link)institutional.appendChild(link);});
    // Preservar links nativos e nao exibir Selos ou bandeiras inventados.
    function logoNodes(selectors,kind){
      var set=[],seen={};
      [].slice.call(native.querySelectorAll(selectors)).forEach(function(node){
        [].slice.call(node.querySelectorAll('img')).forEach(function(im){
          var url=im.currentSrc||im.getAttribute('src')||im.getAttribute('data-src');
          if(!url)return;
          try {url=new URL(url,location.href).href;}catch(e){return;}
          if(seen[url])return;
          var key=normalized((im.alt||'')+' '+(im.getAttribute('title')||'')+' '+url+' '+(node.className||''));
          var pay=/(VISA|MASTER|AMERICAN|ELO|DINERS|HIPER|BOLETO|PAGAMENTO|BANDEIRA|AURA|CARTAO)/.test(key);
          var secure=/(SEGURO|SEGURANCA|SSL|CERTIFIC|NORTON|VERISIGN|GOOGLE|SITE PROTEGIDO|TRUST)/.test(key);
          if(kind==='pay'&&!pay&&!/pagamento|bandeira/i.test(String(node.className)))return;
          if(kind==='secure'&&!secure&&!/selos|seguranca/i.test(String(node.className)))return;
          seen[url]=true;set.push({url:url,alt:im.alt||''});
        });
      });
      return set.slice(0,15);
    }
    var paymentSources='#rodape .pagamento-selos, #rodape .bandeiras, #rodape .bandeiras-pagamento, #rodape .meios-pagamento, #rodape .formas-pagamento, #rodape .pagamento';
    var securitySources='#rodape .seguranca, #rodape .selos, #rodape .selo-ssl, #rodape .pagamento-selos, #rodape .selos-seguranca';
    var payments=logoNodes(paymentSources,'pay');
    var seals=logoNodes(securitySources,'secure');
    var final=footerColumn('Pagamento','cc26-footer__payment');
    if(payments.length){
      var badges=el('div','cc26-footer__badges');
      payments.forEach(function(it){
        var i=el('img');i.src=it.url;i.alt=it.alt||'Forma de pagamento';i.loading='lazy';
        badges.appendChild(i);
      });
      final.appendChild(badges);
    }
    final.appendChild(el('h3','cc26-footer__security-title','Segurança'));
    if(seals.length){
      var sealsGrid=el('div','cc26-footer__seals');
      seals.forEach(function(it){var i=el('img');i.src=it.url;i.alt=it.alt||'Selo de segurança';i.loading='lazy';sealsGrid.appendChild(i);});
      final.appendChild(sealsGrid);
    }
    grid.appendChild(contact);grid.appendChild(account);grid.appendChild(institutional);grid.appendChild(final);
    main.appendChild(grid);f.appendChild(main);
    var bottom=el('div','cc26-footer__bottom');
    var bottomInner=wrap();bottomInner.classList.add('cc26-footer__bottom-inner');
    // Informacoes fiscais originais da LI prevalecem sobre a arte de 2025.
    var legal=native.querySelector('.direitos, .direitos-reservados, .copyright, .rodape-inferior, .credito, .institucional .copyright');
    var legalText=legal?(legal.textContent||'').replace(/\s+/g,' ').trim():'';
    if(!legalText){
      var matched=(native.textContent||'').replace(/\s+/g,' ').match(/(?:SA Digital[^.]{5,180}|(?:©|Todos os direitos reservados)[^.]{3,150})/i);
      if(matched)legalText=matched[0];
    }
    bottomInner.appendChild(el('small','cc26-footer__legal',legalText||'Cabcom — Todos os direitos reservados.'));
    var creditSource=sourceLinks.find(function(l){return /fwr|desenvolvimento/i.test((l.textContent||'')+' '+(l.href||''));});
    var brandCredit=creditSource&&hrefOf(creditSource)?a(hrefOf(creditSource),'cc26-footer__credit','FWR'):el('span','cc26-footer__credit','FWR');
    brandCredit.setAttribute('aria-label','Desenvolvimento FWR');
    bottomInner.appendChild(brandCredit);
    bottom.appendChild(bottomInner);f.appendChild(bottom);
    native.parentNode.insertBefore(f,native);
    native.classList.add('cc26-footer-source-hidden');
    state.footer={origin:'Links, contato, logos e dados nativos LI',paymentLogos:payments.length,securityLogos:seals.length};
  }
  function previewLegacy(){
    if(!preview||!home || cfg.previsualizacao.ocultarBlocosLegados===false)return;
    var matched=[].slice.call(d.querySelectorAll(
      '.banner-central, #banner-central, .banner-tarja-central, #banner-tarja-central, .banner-central-marcas, #banner-central-marcas, .box-vitrine, #box-vitrine'
    ));
    var counter=0;
    matched.forEach(function(node){
      if(node.closest('.cc26-section')||node.querySelector('.cc26-section'))return;
      var isShortcuts=node.matches('.banner-central-marcas, #banner-central-marcas');
      // Nao ocultar a fonte antes que os atalhos usem as imagens reais.
      if(isShortcuts && !d.querySelector('.cc26-shortcuts'))return;
      if(!node.classList.contains('cc26-preview-legacy-hidden')){
        node.classList.add('cc26-preview-legacy-hidden');counter++;
      }
    });
    if(counter)state.previewHidden=(state.previewHidden||0)+counter;
  }
  var fadeObserver=null;
  function initFade(){
    if(!cfg.efeitos || cfg.efeitos.ativo===false || cfg.efeitos.fadeUp===false)return;
    if(!w.IntersectionObserver)return;
    if(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    fadeObserver=new w.IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('cc26-inview');
          fadeObserver.unobserve(entry.target);
        }
      });
    },{rootMargin:'0px 0px -28px 0px',threshold:0.06});
    d.body.classList.add('cc26-motion-ready');
    watchFade();
  }
  function watchFade(){
    if(!fadeObserver)return;
    var els=d.querySelectorAll(
      '.cc26-section, .cc26-section .cc26-category-card, .cc26-section .cc26-shortcut, '+
      '.cc26-section .cc26-mini-banner, .cc26-section .cc26-brands__brand, '+
      '.cc26-footer__column, #listagemProdutos .listagem-item, '+
      '#listagemProdutos .titulo-categoria, .cc26-section .cc26-title, '+
      '.cc26-benefit, .cc26-presentation__copy, .cc26-cart-main, .cc26-cart-checkout-form'
    );
    [].slice.call(els).forEach(function(node,index){
      if(node.classList.contains('cc26-reveal'))return;
      if(node.closest('.cc26-preview-legacy-hidden'))return;
      node.classList.add('cc26-reveal');
      node.style.setProperty('--cc26-reveal-delay',String(Math.min(index%6,5)*45)+'ms');
      // Elementos acima da dobra ficam visiveis imediatamente, sem flash inicial.
      var rect=node.getBoundingClientRect();
      if(rect.bottom>0 && rect.top<w.innerHeight*.9)node.classList.add('cc26-inview');
      else fadeObserver.observe(node);
    });
  }
  function enhanceNative(){
    if(cfg.catalogo.ativo){
      [].slice.call(d.querySelectorAll('.listagem .listagem-item, .vitrine-produtos .produto')).forEach(function(item){
        item.classList.add('cc26-native-product');
        // Acoes originais da LI nunca sao removidas ou substituidas.
      });
    }
    if(cfg.produto.ativo&&d.querySelector('.pagina-produto,#produto'))d.body.classList.add('cc26-page-product');
    if(cfg.rodape.ativo){
      var f=d.querySelector('#rodape');
      if(f){f.classList.add('cc26-native-footer');footer();}
    }
    // Mensagens/cotacoes continuam nativas; sem interceptacao de eventos.
    enhanceCartPage();
  }
  var scheduled=false;
  function refresh(){
    scheduled=false;
    if(!d.body)return;
    if(home){
      enhanceShelves(d.querySelector('#corpo')||d.body);
      var corpo=d.querySelector('#corpo');
      if(corpo && !d.querySelector('.cc26-mini-banners')){
        var mini=miniBanners();
        if(mini){var brandNode=d.querySelector('.cc26-brands');if(brandNode)brandNode.parentNode.insertBefore(mini,brandNode);else corpo.appendChild(mini);}
      }
      if(corpo && !d.querySelector('.cc26-brands')){
        var brandsLate=brands();
        if(brandsLate){var company=d.querySelector('.cc26-institutional');if(company)company.parentNode.insertBefore(brandsLate,company);else corpo.appendChild(brandsLate);}
      }
    }
    decorateNativeShelves();
    enhanceNative();
    // Temas LI injetam banners/carrosseis apos DOMContentLoaded.
    if(home && !d.querySelector('.cc26-shortcuts')){
      var lateShortcuts=shortcuts(),body=d.querySelector('#corpo');
      if(lateShortcuts && body){
        var after=d.querySelector('.cc26-category-grid--cabos');
        if(after && after.parentNode)insertAfter(after,lateShortcuts);
        else body.appendChild(lateShortcuts);
      }
    }
    previewLegacy();
    if(!experience.mounted) {
      if(!d.getElementById('cc26-new-header'))enableHeader();
      initNavigationExperience();
    }
    watchFade();
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    w.requestAnimationFrame(refresh);
  }

  // v1.5 | UX lifecycle: navegação nativa intacta, loader visual não bloqueante.
  var experience={mounted:false,framePending:false,loaderDone:false,loader:null};
  function reducedMotion(){
    return !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function initLightLoader(){
    if(!cfg.efeitos||cfg.efeitos.ativo===false||cfg.efeitos.loader===false||reducedMotion())return;
    if(d.getElementById('cc26-load-indicator'))return;
    var root=el('div','cc26-load-indicator');root.id='cc26-load-indicator';
    root.setAttribute('aria-hidden','true');
    var bar=el('div','cc26-load-indicator__bar');
    var card=el('div','cc26-load-indicator__pill');
    var pulse=el('span','cc26-load-indicator__pulse');
    card.appendChild(pulse);
    card.appendChild(el('span','cc26-load-indicator__text','Carregando'));
    root.appendChild(bar);root.appendChild(card);d.body.appendChild(root);
    experience.loader=root;
    state.loader='iniciado';
    var begun=Date.now();
    function finish(){
      if(experience.loaderDone)return;
      experience.loaderDone=true;
      w.setTimeout(function(){
        if(!root.parentNode)return;
        root.classList.add('cc26-load-indicator--done');
        state.loader='finalizado';
        w.setTimeout(function(){if(root.parentNode)root.parentNode.removeChild(root);},450);
      },Math.max(0,250-(Date.now()-begun)));
    }
    if(d.readyState==='complete')w.setTimeout(finish,320);
    else w.addEventListener('load',finish,{once:true});
    // Failsafe: o carregamento nunca oculta/impede a interacao e sempre termina.
    w.setTimeout(finish,1600);
    w.addEventListener('pageshow',function(event){if(event.persisted)finish();},{once:true});
  }
  function initNavigationExperience(){
    if(experience.mounted||!cfg.efeitos||cfg.efeitos.ativo===false||cfg.efeitos.navegacao===false)return;
    var header=d.getElementById('cc26-new-header');
    if(!header)return;
    experience.mounted=true;
    header.classList.add('cc26-nav-ready');
    var current=location.pathname.replace(/\/+$/,'')||'/';
    [].slice.call(header.querySelectorAll('.cc26-site-header__navlink[href]')).forEach(function(link){
      var u;try{u=new URL(link.href,location.href)}catch(e){return}
      var path=u.pathname.replace(/\/+$/,'')||'/';
      if(u.origin===location.origin && path!=='/' && path===current){
        link.setAttribute('aria-current','page');
        link.classList.add('cc26-nav-current');
      }
    });
    function update(){
      experience.framePending=false;
      var scrollY=w.scrollY||w.pageYOffset||0;
      header.classList.toggle('cc26-header-scrolled',scrollY>48);
      if(cfg.efeitos.indicadorRolagem!==false){
        var max=(d.documentElement.scrollHeight||0)-(w.innerHeight||0);
        var percent=max>0 ? Math.min(100,Math.max(0,scrollY/max*100)):0;
        header.style.setProperty('--cc26-scroll-progress',percent.toFixed(2)+'%');
      }
    }
    function onScroll(){
      if(experience.framePending)return;
      experience.framePending=true;
      w.requestAnimationFrame(update);
    }
    w.addEventListener('scroll',onScroll,{passive:true});
    w.addEventListener('resize',onScroll,{passive:true});
    w.addEventListener('pageshow',onScroll);
    update();
    // Fecha apenas menu visual da Cabcom, sem cancelar cliques ou eventos nativos.
    header.addEventListener('click',function(event){
      var target=event.target;
      if(!target || !target.closest)return;
      if(target.closest('.cc26-site-header__nav a[href]')){
        header.classList.remove('cc26-site-header--open');
        var toggle=header.querySelector('.cc26-site-header__toggle');
        if(toggle)toggle.setAttribute('aria-expanded','false');
      }
    });
    d.addEventListener('pointerdown',function(event){
      if(!header.contains(event.target) && header.classList.contains('cc26-site-header--open')){
        header.classList.remove('cc26-site-header--open');
        var toggle=header.querySelector('.cc26-site-header__toggle');
        if(toggle)toggle.setAttribute('aria-expanded','false');
      }
    },{passive:true});
    state.navigation='fluid-ativo';
  }
  function initExperience(){
    initLightLoader();
    initNavigationExperience();
  }
  var initialized=false;
  function boot(){
    if(!active||!d.body)return;
    if(initialized){schedule();return;}
    initialized=true;
    d.body.classList.add('cc26-active');
    if(preview)d.body.classList.add('cc26-preview');
    enableHeader();
    homeContent();
    decorateNativeShelves();
    enhanceNative();
    previewLegacy();
    initFade();
    initExperience();
    var observer=new MutationObserver(schedule);
    observer.observe(d.body,{subtree:true,childList:true});
    state.initialized=true;
    log('ativo',state);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);