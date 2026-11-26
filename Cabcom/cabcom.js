/* Cabcom 2026 | FWR Agencia Digital | Integracao Loja Integrada
 * Camada visual conservadora: preserva DOM comercial, links nativos, catalogo,
 * estoque, cotacoes, busca, conta, carrinho, frete, cupom, pagamentos e checkout.
 * Preview: ?cabcom_preview=1; producao somente com publicarNaLoja:true.
 */
(function (w,d) {
  'use strict';
  if(w.Cabcom2026) return;
  var VERSION='2.2.18';
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
      textoEmpresa:["Somos a CABCOM, uma empresa especializada no fornecimento de Fios e Cabos Especiais para transmissão de dados, áudio e vídeo, bem como sinais de rádio e TV. Nosso nome representa nosso compromisso com a transmissão de comunicação confiável e de alta qualidade na era digital, onde a conectividade é fundamental para o sucesso dos negócios.","Fundada em novembro de 2011, a CABCOM está comprometida em fornecer soluções inovadoras e de alta qualidade para os setores de Telecomunicação, Broadcast, Automação e Segurança Digital. Nós fornecemos uma ampla gama de produtos, incluindo conectores, ferramentas e acessórios, além de fios e cabos especializados, para atender às necessidades específicas de cada cliente.","Nossa missão é ser um provedor confiável e eficiente de soluções de conectividade para nossos clientes, oferecendo produtos de qualidade superior e serviços excepcionais. Nós nos esforçamos para estar sempre atualizados com as tendências tecnológicas em constante evolução, para que possamos oferecer aos nossos clientes as soluções mais inovadoras e avançadas disponíveis no mercado.","Nossa visão é sermos reconhecidos como líderes de mercado no fornecimento de soluções de conectividade de alta qualidade, bem como sermos uma referência em atendimento ao cliente e satisfação do cliente.","Nossos valores são a qualidade, inovação, eficiência, integridade e comprometimento com nossos clientes. Nós valorizamos nossos clientes acima de tudo e estamos empenhados em fornecer um atendimento excepcional e personalizado a cada um deles.","Na CABCOM, acreditamos que o sucesso de nossos clientes é nosso sucesso também. Por isso, estamos comprometidos em fornecer soluções de conectividade confiáveis e eficientes para ajudá-los a alcançar seus objetivos de negócios. Como líderes em nosso setor, estamos sempre procurando maneiras de melhorar e inovar para garantir que nossos clientes tenham acesso às soluções mais avançadas disponíveis no mercado."]
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
  // Tarja global: mensagens editáveis no HTML da LI, sem alterar JS/CSS.
  var topbarController=null;
  function topbarLink(value){
    if(!value)return '';
    try{var url=new URL(value,location.href);return /^(https?:|tel:|mailto:)$/.test(url.protocol)?url.href:'';}
    catch(e){return '';}
  }
  function topbarData(){
    var admin=d.getElementById('cc26-topbar-admin');
    var source=admin&&(admin.content||admin);
    var items=[],interval=4500,autoplay=true;
    if(source){
      var configured=Number(admin.getAttribute('data-interval'));
      if(configured>0)interval=Math.max(2500,Math.min(20000,configured));
      autoplay=admin.getAttribute('data-autoplay')!=='false';
      items=[].slice.call(source.querySelectorAll('[data-cc26-message]')).map(function(node){
        var link=node.querySelector('a[href]');
        return {text:String(node.textContent||'').replace(/\s+/g,' ').trim(),
          link:topbarLink(node.getAttribute('data-link')||(link&&link.getAttribute('href')))};
      }).filter(function(item){return item.text;});
    }else{
      var promo=d.querySelector('.barra-inicial .conteiner, #barra-top .conteiner, .barra-topo .conteiner');
      var promoText=promo?String(promo.textContent||'').replace(/\s+/g,' ').trim():'';
      items=[
        {text:promoText&&promoText.length<180?promoText:'Fale Conosco Telefone: (11) 3280-2008 Whatsapp: (11) 3280-2008',link:''},
        {text:'Enviamos para todo o Brasil',link:''},
        {text:'Solicite sua cotação por WhatsApp ou e-mail',link:''}
      ].filter(function(item,i,list){return list.findIndex(function(x){return x.text===item.text;})===i;});
    }
    return {items:items,interval:interval,autoplay:autoplay,source:admin?'HTML personalizado':'Tarja padrão'};
  }
  function syncTopbar(top){
    top=top||d.querySelector('#cc26-new-header .cc26-site-header__top');
    if(!top)return;
    var data=topbarData(),signature=JSON.stringify(data);
    if(topbarController&&topbarController.top===top&&topbarController.signature===signature)return;
    if(topbarController)topbarController.destroy();
    var items=data.items;
    top.replaceChildren();
    top.classList.toggle('cc26-site-header__top--empty',!items.length);
    state.topbar={source:data.source,count:items.length,interval:data.interval,autoplay:data.autoplay};
    if(!items.length){topbarController={top:top,signature:signature,destroy:function(){}};return;}
    top.setAttribute('role','region');
    top.setAttribute('aria-label','Avisos da loja');
    var carousel=el('div','cc26-topbar__carousel');
    var slides=el('div','cc26-topbar__slides');
    var active=0,timer=0,paused=!data.autoplay||reducedMotion(),hover=false,focused=false,dead=false;
    var messages=items.map(function(item,i){
      var slide=el('div','cc26-topbar__slide');
      slide.setAttribute('role','group');slide.setAttribute('aria-label','Aviso '+(i+1)+' de '+items.length);
      if(item.link){slide.appendChild(a(item.link,'cc26-topbar__link',item.text));}
      else slide.appendChild(el('span','',item.text));
      slides.appendChild(slide);
      return slide;
    });
    function show(i,manual){
      active=(i+messages.length)%messages.length;
      slides.setAttribute('aria-live',manual?'polite':'off');
      messages.forEach(function(slide,index){
        var on=index===active;slide.classList.toggle('cc26-topbar__slide--active',on);
        slide.setAttribute('aria-hidden',String(!on));
        var link=slide.querySelector('a');if(link)link.tabIndex=on?0:-1;
      });
      top.dataset.cc26ActiveMessage=String(active+1);
      state.topbar.index=active+1;
    }
    function nextTimer(){
      w.clearTimeout(timer);
      if(dead||messages.length<2||paused||hover||focused||d.hidden)return;
      timer=w.setTimeout(function(){show(active+1,false);nextTimer();},data.interval);
    }
    function arrow(label,side){
      var b=el('button','cc26-topbar__control cc26-topbar__control--'+side);
      b.type='button';b.setAttribute('aria-label',label);b.appendChild(inlineIcon('arrow'));return b;
    }
    var prev=arrow('Aviso anterior','prev'),next=arrow('Próximo aviso','next');
    var pause=el('button','cc26-topbar__control cc26-topbar__control--pause');
    pause.type='button';var pauseGlyph=el('span','cc26-topbar__pause-glyph');pauseGlyph.setAttribute('aria-hidden','true');pause.appendChild(pauseGlyph);
    function updatePause(){
      pause.setAttribute('aria-label',paused?'Reproduzir avisos':'Pausar avisos');
      pauseGlyph.textContent=paused?'▶':'Ⅱ';
    }
    prev.addEventListener('click',function(){show(active-1,true);nextTimer();});
    next.addEventListener('click',function(){show(active+1,true);nextTimer();});
    pause.addEventListener('click',function(){paused=!paused;updatePause();nextTimer();});
    if(items.length>1){
      top.setAttribute('aria-roledescription','carrossel');
      carousel.classList.add('cc26-topbar__carousel--multiple');
      carousel.appendChild(prev);
      carousel.appendChild(slides);
      var right=el('div','cc26-topbar__right');right.appendChild(next);right.appendChild(pause);carousel.appendChild(right);
    }else{top.removeAttribute('aria-roledescription');carousel.appendChild(slides);}
    top.appendChild(carousel);
    function enter(){hover=true;nextTimer();}
    function leave(){hover=false;nextTimer();}
    function focusIn(){focused=true;nextTimer();}
    function focusOut(event){if(!event.relatedTarget||!top.contains(event.relatedTarget)){focused=false;nextTimer();}}
    top.addEventListener('mouseenter',enter);top.addEventListener('mouseleave',leave);
    top.addEventListener('focusin',focusIn);top.addEventListener('focusout',focusOut);
    d.addEventListener('visibilitychange',nextTimer);
    topbarController={top:top,signature:signature,destroy:function(){
      dead=true;w.clearTimeout(timer);
      top.removeEventListener('mouseenter',enter);top.removeEventListener('mouseleave',leave);
      top.removeEventListener('focusin',focusIn);top.removeEventListener('focusout',focusOut);
      d.removeEventListener('visibilitychange',nextTimer);
    }};
    updatePause();show(0,false);nextTimer();
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
    syncTopbar(top);
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
    // Ordem e níveis do painel: nenhum nome ou ordenação fixa.
    function menuItem(li,depth){
      var original=li.querySelector(':scope > a[href]');
      if(!original)return null;
      var row=el('li',depth?'cc26-site-header__subitem':'cc26-site-header__navitem');
      var label=(original.querySelector('.titulo')||original).textContent.trim();
      var item=a(original.href,depth?'':'cc26-site-header__navlink',label);
      row.appendChild(item);
      var childList=li.querySelector(':scope > ul');
      if(childList){
        var sub=el('ul','cc26-site-header__submenu');
        [].slice.call(childList.children).forEach(function(child){
          var nested=menuItem(child,depth+1);if(nested)sub.appendChild(nested);
        });
        if(sub.children.length){
          var toggle=el('button','cc26-menu-expand');
          toggle.type='button';toggle.setAttribute('aria-label','Expandir '+label);
          toggle.setAttribute('aria-expanded','false');toggle.appendChild(inlineIcon('arrow'));
          toggle.addEventListener('click',function(){
            var expanded=row.classList.toggle('cc26-menu-expanded');
            toggle.setAttribute('aria-expanded',String(expanded));
            toggle.setAttribute('aria-label',(expanded?'Recolher ':'Expandir ')+label);
          });
          row.appendChild(toggle);row.appendChild(sub);
        }
      }
      return row;
    }
    // Se necessário, agrupa somente o final da sequência; mobile exibe
    // todas as categorias de primeiro nível, na ordem do painel.
    var mainNodes=navItems.slice(0,7),remaining=navItems.slice(7);
    mainNodes.forEach(function(li){var row=menuItem(li,0);if(row)navList.appendChild(row);});
    if(remaining.length){
      var more=el('li','cc26-site-header__navitem cc26-site-header__more');
      var toggle=el('button','cc26-site-header__navlink cc26-more-toggle','MAIS');
      toggle.type='button';toggle.setAttribute('aria-expanded','false');
      var sub=el('ul','cc26-site-header__submenu');
      remaining.forEach(function(li){var row=menuItem(li,0);if(row)sub.appendChild(row);});
      toggle.addEventListener('click',function(){var open=more.classList.toggle('cc26-menu-expanded');toggle.setAttribute('aria-expanded',String(open));});
      more.appendChild(toggle);more.appendChild(sub);navList.appendChild(more);
    }
    state.menuOrder=navItems.map(function(li){var a=li.querySelector(':scope > a[href]');return a?(a.querySelector('.titulo')||a).textContent.trim():'';}).filter(Boolean);
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
    function syncMobileHeader(){
      var mobile=w.innerWidth<=767;
      if(mobile){
        if(toggle.parentNode!==main||toggle.nextElementSibling!==logo)main.insertBefore(toggle,logo);
        if(quote&&quote.parentNode!==main)main.appendChild(quote);
        if(actions.parentNode!==header)header.appendChild(actions);
      }else{
        if(actions.parentNode!==main)main.appendChild(actions);
        if(quote&&quote.parentNode!==actions)actions.appendChild(quote);
        if(toggle.parentNode!==actions||toggle!==actions.lastElementChild)actions.appendChild(toggle);
      }
    }
    syncMobileHeader();w.addEventListener('resize',syncMobileHeader,{passive:true});
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
  // Quantidades: única operação oficial LI, com confirmação do carrinho.
  var quoteQtyPending=false;
  async function requestQuoteQuantity(id,current,next){
    if(quoteQtyPending||!/^\d+$/.test(String(id))||!Number.isInteger(current)||!Number.isInteger(next)||next<1||next>9999||current===next)throw Error('Quantidade inválida ou atualização em andamento.');
    quoteQtyPending=true;
    try{
      var route='/carrinho/produto/'+id+'/atualizar/'+next+'/'+current;
      var response=await w.fetch(route,{method:'GET',credentials:'same-origin',cache:'no-store',redirect:'follow',headers:{Accept:'text/html'}});
      if(!response.ok||new URL(response.url,location.href).origin!==location.origin)throw Error('Não foi possível confirmar a quantidade.');
      var doc=new DOMParser().parseFromString(await response.text(),'text/html');
      var row=doc.querySelector('table.tabela-carrinho tr[data-produto-id="'+id+'"]');
      var confirmed=row&&Number(row.getAttribute('data-produto-quantidade'));
      if(!Number.isInteger(confirmed)||confirmed<1)throw Error('Quantidade não confirmada pela loja.');
      return {doc:doc,quantity:confirmed};
    }finally{quoteQtyPending=false;}
  }
  function quoteQuantityControl(id,quantity,change){
    var box=el('div','cc26-quote-qty');
    box.setAttribute('role','group');box.setAttribute('aria-label','Quantidade do produto');
    var minus=el('button','cc26-quote-qty__step','−'),plus=el('button','cc26-quote-qty__step','+');
    minus.type=plus.type='button';minus.setAttribute('aria-label','Diminuir quantidade');plus.setAttribute('aria-label','Aumentar quantidade');
    var amount=el('span','cc26-quote-qty__amount',String(quantity));amount.setAttribute('aria-live','polite');
    minus.disabled=quantity<=1;plus.disabled=quantity>=9999;
    box.appendChild(minus);box.appendChild(amount);box.appendChild(plus);
    minus.addEventListener('click',function(){if(quantity>1)change(id,quantity,quantity-1);});
    plus.addEventListener('click',function(){if(quantity<9999)change(id,quantity,quantity+1);});
    return box;
  }
  function enhanceQuoteModalQuantities(){
    var modal=d.getElementById('modalSolicitarOrcamento');
    if(!modal||!w.fetch)return;
    var table=modal.querySelector('table.tabela-carrinho');
    if(!table||table.dataset.cc26QuantityReady==='1')return;
    table.dataset.cc26QuantityReady='1';
    [].slice.call(table.querySelectorAll('tbody tr')).forEach(function(row){
      var m=String(row.className).match(/(?:^|\s)produto-item-(\d+)(?:\s|$)/);
      var cell=row.querySelector('td.text-align-center')||row.lastElementChild;
      var quantity=cell&&Number((cell.textContent||'').trim());
      if(!m||!Number.isInteger(quantity)||quantity<1)return;
      var id=m[1];
      function render(q){cell.replaceChildren(quoteQuantityControl(id,q,update));}
      async function update(product,current,next){
        if(quoteQtyPending)return;
        var send=modal.querySelector('button[type="submit"]');
        var oldDisabled=send&&send.disabled;
        var error=modal.querySelector('.cc26-quote-qty-status');
        if(!error){error=el('p','cc26-quote-qty-status');error.setAttribute('role','status');table.parentElement.appendChild(error);}
        error.textContent='Atualizando quantidade…';
        if(send)send.disabled=true;
        var controls=[].slice.call(table.querySelectorAll('.cc26-quote-qty button'));
        controls.forEach(function(btn){btn.dataset.cc26WasDisabled=btn.disabled?'1':'0';btn.disabled=true;});
        try{
          var result=await requestQuoteQuantity(product,current,next);
          // Atualiza com dados confirmados; preserva o formulário, máscaras e campos preenchidos.
          render(result.quantity);
          var liveRow=d.querySelector('#corpo table.tabela-carrinho tr[data-produto-id="'+product+'"]');
          var newRow=result.doc.querySelector('table.tabela-carrinho tr[data-produto-id="'+product+'"]');
          if(liveRow&&newRow){
            liveRow.setAttribute('data-produto-quantidade',String(result.quantity));
            ['quantidade','quantidade_atual'].forEach(function(name){
              var input=liveRow.querySelector('input[name="'+name+'"]');
              if(input){input.value=String(result.quantity);input.setAttribute('value',String(result.quantity));}
            });
            ['a.icon-minus','a.icon-plus'].forEach(function(selector){
              var link=liveRow.querySelector(selector),fresh=newRow.querySelector(selector);
              if(link&&fresh)link.setAttribute('href',fresh.getAttribute('href'));
            });
          }
          error.textContent=result.quantity===next?'Quantidade atualizada.':'Quantidade ajustada pela disponibilidade da loja.';
          if(send)send.disabled=oldDisabled;
        }catch(e){
          error.textContent='Não foi possível confirmar a quantidade. Feche e reabra a cotação para atualizar os itens.';
          // Não permite enviar um orçamento com quantidades potencialmente divergentes.
          if(send)send.disabled=true;
        }finally{
          controls.forEach(function(btn){btn.disabled=btn.dataset.cc26WasDisabled==='1';delete btn.dataset.cc26WasDisabled;});
        }
      }
      render(quantity);
    });
  }
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
      var value=item.getAttribute('data-produto-quantidade')||(input&&input.value);
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
      var skuNode=[].slice.call(row.querySelectorAll('.produto-info li')).find(function(li){return /^SKU\s*:/i.test(text(li));});
      var sku=skuNode?text(skuNode).replace(/^SKU\s*:\s*/i,''):'';
      return {id:row.getAttribute('data-produto-id')||'',name:name.slice(0,210),href:productHref,image:imageHref,quantity:readQty(row),sku:sku,price:price};
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
    var adding=false,modalLoading=false,lastOfficialCount=null;
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
          if(it.quantity!==null){
            var qtyLine=el('div','cc26-cart-sidebar__quantity');
            qtyLine.appendChild(el('span','','Quantidade'));
            if(data.source==='carrinho'&&/^\d+$/.test(it.id)&&w.fetch)qtyLine.appendChild(quoteQuantityControl(it.id,it.quantity,function(id,current,next){changeSidebarQuantity(data,id,current,next);}));
            else qtyLine.appendChild(el('strong','',String(it.quantity)));
            info.appendChild(qtyLine);
          }
          
          item.appendChild(thumb);item.appendChild(info);list.appendChild(item);
        });
        body.appendChild(list);
        var summary=el('div','cc26-cart-sidebar__summary');
        summary.appendChild(el('span','','Produtos para cotação'));
        summary.appendChild(el('strong','',String(items.length)));
        foot.appendChild(summary);
        foot.appendChild(el('small','cc26-cart-sidebar__note','Escolha como deseja receber seu orçamento. Os valores serão confirmados pela equipe Cabcom.'));
        if(data.source==='carrinho'){
          var phone=String(cfg.conteudo.contato||'').replace(/\D/g,'');
          if(/^\d{10,11}$/.test(phone)){
            var totalUnits=items.every(function(it){return Number.isInteger(it.quantity);})?items.reduce(function(n,it){return n+it.quantity;},0):null;
            var message='*SOLICITAÇÃO DE ORÇAMENTO | CABCOM*\n\nOlá! Gostaria de receber uma cotação para os seguintes produtos:\n\n'+items.map(function(it,index){
              return '*'+String(index+1).padStart(2,'0')+' — '+it.name+'*'+(it.sku?'\nCódigo: '+it.sku:'')+(it.quantity!==null?'\nQuantidade: '+it.quantity:'')+(it.href?'\nProduto: '+it.href:'');
            }).join('\n\n')+'\n\n*Resumo da solicitação*\nProdutos distintos: '+items.length+(totalUnits!==null?'\nTotal de unidades: '+totalUnits:'')+'\n\nPor favor, informar valores, disponibilidade, prazo de entrega e condições de pagamento. Obrigado!';

            var whats=a('https://wa.me/55'+phone+'?text='+encodeURIComponent(message),'cc26-cart-sidebar__whatsapp');
            whats.target='_blank';whats.rel='noopener noreferrer';
            whats.appendChild(inlineIcon('phone'));whats.appendChild(el('span','','Cotar por WhatsApp'));
            foot.appendChild(whats);
          }
          var email=el('button','cc26-cart-sidebar__email');
          email.type='button';email.appendChild(inlineIcon('mail'));email.appendChild(el('span','','Cotar por E-mail'));
          email.addEventListener('click',function(){openNativeQuote(email);});
          foot.appendChild(email);
        }
        foot.appendChild(a(url,'cc26-cart-sidebar__manage','Editar produtos e quantidades'));
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
        if(mode!=='items')foot.appendChild(a(mode==='empty'?location.origin+'/':url,'cc26-cart-sidebar__checkout',mode==='empty'?'CONTINUAR NA LOJA':'VER LISTA DE ORÇAMENTO'));
        var back=el('button','cc26-cart-sidebar__continue','Continuar comprando');
        back.type='button';back.addEventListener('click',closeSidebar);
        foot.appendChild(back);
      }
      if(data){if(data.source==='carrinho'&&Number.isFinite(data.count))lastOfficialCount=data.count;updateBadge(data.count);}
      state.cartSidebar={open:open,mode:mode,source:data&&data.source||'sem-dados'};
    }
    async function changeSidebarQuantity(data,id,current,next){
      if(adding||modalLoading||quoteQtyPending)return;
      adding=true;
      if(fetchController)fetchController.abort();
      ++fetchSeq;
      var scroll=body.scrollTop;
      show(null,'loading');
      try{
        var result=await requestQuoteQuantity(id,current,next);
        var official=parseSource(result.doc,'carrinho');
        official.count=official.items.every(function(it){return Number.isInteger(it.quantity);})?official.items.reduce(function(n,it){return n+it.quantity;},0):null;
        if(open){show(official,'items');body.scrollTop=scroll;}
        else{lastOfficialCount=official.count;updateBadge(official.count);}
        if(result.quantity!==next&&open){var note=el('p','cc26-quote-qty-status','Quantidade ajustada pela disponibilidade da loja.');body.prepend(note);}
      }catch(e){
        if(open){show(null,'loading');fetchOfficial(null);}
      }finally{adding=false;}
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
            var q=official.items.every(function(it){return Number.isInteger(it.quantity)&&it.quantity>0;});
            official.count=q?official.items.reduce(function(acc,it){return acc+it.quantity;},0):(existing?existing.count:null);
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
      if(adding||modalLoading||quoteQtyPending)return;
      if(!open){updateBadge(lastOfficialCount===null?parseSource(d,'minicart').count:lastOfficialCount);return;}
      if(fallback&&w.fetch)fetchOfficial(null);
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
    // Modal remoto oficial da LI: mesmos campos, máscaras, CAPTCHA e envio.
    function openNativeQuote(button){
      if(modalLoading||adding||quoteQtyPending)return;
      var $=w.jQuery,endpoint='/checkout/orcamento.json';
      if(!$||!$.fn||!$.fn.modal||!$.fn.load){w.location.assign(url);return;}
      modalLoading=true;button.disabled=true;button.setAttribute('aria-busy','true');
      var modal=d.getElementById('modalSolicitarOrcamento');
      if(modal && !modal.classList.contains('cc26-owned-quote-modal')){
        var nativeTrigger=d.querySelector('a[data-target="#modalSolicitarOrcamento"][data-toggle="modal"]');
        if(nativeTrigger){
          modalLoading=false;button.disabled=false;button.removeAttribute('aria-busy');
          closeSidebar();nativeTrigger.click();return;
        }
        w.location.assign(url);return;
      }
      if(modal)modal.remove();
      modal=el('div','modal hide fade cc26-owned-quote-modal');modal.id='modalSolicitarOrcamento';
      modal.setAttribute('role','dialog');modal.setAttribute('aria-labelledby','cc26-native-quote-title');
      modal.setAttribute('aria-hidden','true');modal.setAttribute('tabindex','-1');
      var mh=el('div','modal-header');
      var cross=el('button','close','×');cross.type='button';cross.setAttribute('data-dismiss','modal');cross.setAttribute('aria-label','Fechar');
      var mt=el('span','titulo cor-secundaria','Solicitar orçamento');mt.id='cc26-native-quote-title';
      mh.appendChild(cross);mh.appendChild(mt);
      var form=el('form');form.id='formOrcamento';form.action=endpoint;form.method='post';
      var mb=el('div','modal-body borda-principal'),mf=el('div','modal-footer');
      var cancel=el('button','botao','Fechar');cancel.type='button';cancel.setAttribute('data-dismiss','modal');
      var send=el('button','botao principal grande','Enviar orçamento');send.type='submit';send.disabled=true;
      mf.appendChild(cancel);mf.appendChild(send);form.appendChild(mb);form.appendChild(mf);modal.appendChild(mh);modal.appendChild(form);d.body.appendChild(modal);
      $(mb).load(endpoint,function(response,status){
        modalLoading=false;button.disabled=false;button.removeAttribute('aria-busy');
        if((status!=='success'&&status!=='notmodified')||!mb.querySelector('#id_nome')||!mb.querySelector('#id_email')||!mb.querySelector('.tabela-carrinho tbody tr')){
          modal.remove();w.location.assign(url);return;
        }
        if(!open){modal.remove();return;}
        send.disabled=false;enhanceQuoteModalQuantities();closeSidebar();
        $(modal).on('hidden',function(){if(d.contains(modal))modal.remove();});
        $(modal).modal('show');
      });
    }
    function officialAddLink(node){
      if(!node)return null;
      try{
        var action=new URL(node.getAttribute('href'),location.href);
        return action.origin===location.origin&&/^\/carrinho\/produto\/\d+\/adicionar\/?$/i.test(action.pathname)?action:null;
      }catch(e){return null;}
    }
    function handleQuoteClick(event){
      if(!active||!cartSidebarApi||!w.fetch||event.defaultPrevented)return;
      if(typeof event.button==='number'&&event.button!==0)return;
      if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
      var clicked=event.target&&event.target.closest&&event.target.closest('a[href]');
      if(!clicked||clicked.closest('#cc26-cart-sidebar,#cc26-new-header,#modalSolicitarOrcamento'))return;
      var caption=normalized(clicked.textContent||clicked.getAttribute('aria-label')||'');
      var isEmail=/COTAR\s+POR\s+E.?MAIL|COTAR\s+E.?MAIL/.test(caption)||clicked.matches('.cc26-card-quote-actions__email,.cotar-email,.botao-cotar-email,[data-cc26-cotar-email]');
      var isWhats=clicked.matches('.cc26-card-quote-actions__whatsapp,.cc26-pdp__cta--whatsapp,.cotar-whats a')||!!clicked.closest('.cotar-whats');
      if(!isEmail&&!isWhats)return;
      var action=officialAddLink(clicked);
      if(!action){
        var scope=clicked.closest('.cc26-card-two-cta,.cc26-pdp__details,.produto');
        if(scope)action=[].slice.call(scope.querySelectorAll('a[href*="/carrinho/produto/"]')).map(officialAddLink).find(Boolean);
      }
      if(!action)return; // Sem rota oficial: manter a seleção de variantes original.
      event.preventDefault();event.stopImmediatePropagation();
      if(adding||modalLoading)return;
      adding=true;cartSidebarApi.open();
      if(fetchController)fetchController.abort();
      ++fetchSeq;show(null,'loading');
      clicked.classList.add('cc26-quote-adding');clicked.setAttribute('aria-busy','true');
      w.fetch(action.href,{method:'GET',credentials:'same-origin',cache:'no-store',redirect:'follow',headers:{Accept:'text/html'}})
      .then(function(response){
        if(!response.ok||new URL(response.url,location.href).origin!==location.origin)throw Error('Não foi possível confirmar a inclusão');
        return response.text();
      }).then(function(html){
        var official=parseSource(new DOMParser().parseFromString(html,'text/html'),'carrinho');
        if(open&&official.items.length){
          var quantities=official.items.every(function(it){return Number.isInteger(it.quantity)&&it.quantity>0;});
          official.count=quantities?official.items.reduce(function(n,it){return n+it.quantity;},0):null;
          show(official,'items');
        }else if(open)fetchOfficial(null);
      }).catch(function(){
        // Não repetir automaticamente uma inclusão possivelmente concluída.
        if(open)fetchOfficial(null);
      }).finally(function(){
        adding=false;clicked.classList.remove('cc26-quote-adding');clicked.removeAttribute('aria-busy');
      });
    }
    d.addEventListener('click',handleQuoteClick,true);
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
    content.setAttribute('aria-label','Benefícios da Cabcom');
    var controls=el('div','cc26-benefits__controls');
    var prev=el('button','cc26-benefits__prev'),next=el('button','cc26-benefits__next'),status=el('span','cc26-benefits__status','1 / '+items.length);
    prev.type=next.type='button';prev.setAttribute('aria-label','Benefício anterior');next.setAttribute('aria-label','Próximo benefício');
    prev.appendChild(inlineIcon('arrow'));next.appendChild(inlineIcon('arrow'));status.setAttribute('aria-live','polite');
    controls.appendChild(prev);controls.appendChild(status);controls.appendChild(next);
    function index(){var slides=[].slice.call(content.children);var first=slides[0];return slides.reduce(function(best,slide,i){return Math.abs(slide.offsetLeft-first.offsetLeft-content.scrollLeft)<Math.abs(slides[best].offsetLeft-first.offsetLeft-content.scrollLeft)?i:best;},0);}
    function showIndex(){var i=index();status.textContent=(i+1)+' / '+items.length;prev.disabled=i===0;next.disabled=i===items.length-1;}
    function step(delta){var i=Math.max(0,Math.min(items.length-1,index()+delta));var target=content.children[i].offsetLeft-content.children[0].offsetLeft;content.scrollTo({left:target,behavior:reducedMotion()?'auto':'smooth'});}
    prev.addEventListener('click',function(){step(-1);});next.addEventListener('click',function(){step(1);});
    content.addEventListener('scroll',showIndex,{passive:true});prev.disabled=true;
    s.appendChild(content);s.appendChild(controls);return s;
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
    // Módulos legados: ocultar após inserir o HTML manual.
    var selectors=[
      '#corpo .banner.mini','#corpo .mini-banner','#corpo .mini-banners',
      '#corpo .banner-mini','#corpo .banners-mini',
      '#corpo [data-posicao="minibanner"]','#corpo [data-posicao="mini-banner"]',
      '#corpo [data-banner-position="mini"]','#corpo [data-banner-type="mini"]',
      '#corpo [data-banner-posicao="mini"]',
      '.mini-banner','.mini-banners','.banner-mini','.banners-mini',
      '[id*="mini-banner"]','[class*="mini_banner"]',
      '[data-posicao="minibanner"]','[data-banner-type="mini"]'
    ];
    var candidates=[].slice.call(d.querySelectorAll(selectors.join(','))).filter(function(node){
      return !node.closest('.cc26-section') &&
             !node.closest('#cc26-footer') &&
             !node.closest('.cc26-cart-sidebar');
    });
    // A div de grupo abrange todas as banners sem selecionar suas filhas duas vezes.
    return candidates.filter(function(node){
      return !candidates.some(function(parent){return parent!==node && parent.contains(node);});
    });
  }
  // Quatro posições administradas exclusivamente pelo HTML personalizado.
  // O painel de mini banners nativo deixa de ser fonte do componente.
  function miniBanners(){
    if(!cfg.home.miniBanners)return null;
    var admin=d.getElementById('cc26-banners-admin');
    var source=admin&&(admin.content||admin);
    if(!source)return null; // Até instalar o HTML, preservar os banners nativos.
    function safeURL(value){
      value=String(value||'').trim();if(!value)return '';
      try{var u=new URL(value,location.href);return /^https?:$/.test(u.protocol)?u.href:'';}catch(e){return '';}
    }
    var slots=[].slice.call(source.querySelectorAll('[data-cc26-banner]')).slice(0,4);
    var items=slots.map(function(slot,i){
      return {image:safeURL(slot.getAttribute('data-imagem')),link:safeURL(slot.getAttribute('data-link')),
        alt:slot.getAttribute('data-alt')||('Banner '+(i+1))};
    });
    var count=items.filter(function(it){return !!it.image;}).length;
    var existing=d.querySelector('.cc26-mini-banners');
    if(!count){if(existing)existing.remove();return null;}
    var signature=JSON.stringify(items);
    var s=existing||section('cc26-mini-banners');
    var grid=s.querySelector('.cc26-mini-banners__grid');
    if(!grid){grid=wrap();grid.classList.add('cc26-mini-banners__grid');s.appendChild(grid);}
    if(s.dataset.cc26Signature!==signature){
      grid.replaceChildren();
      items.forEach(function(item){
        if(!item.image&&!preview)return;
        var tile=item.image&&item.link?a(item.link,'cc26-mini-banner'):el('div','cc26-mini-banner');
        if(item.image){
          var picture=el('img');picture.alt=item.alt;picture.loading='lazy';picture.decoding='async';picture.src=item.image;
          tile.appendChild(picture);
        }else{
          tile.classList.add('cc26-mini-banner--placeholder');
          tile.appendChild(el('span','','Imagem pendente: '+item.alt));
        }
        grid.appendChild(tile);
      });
      s.dataset.cc26Signature=signature;
      s.dataset.cc26Count=String(count);
      s.dataset.cc26Slots=String(slots.length);
      s.dataset.nativeSource='html-admin';
    }
    findNativeMiniSources().forEach(function(node){
      if(node!==admin&&!node.contains(admin))node.classList.add('cc26-mini-native-hidden');
    });
    state.miniBanners={origin:'HTML personalizado',count:count,expected:4,complete:count===4,slots:slots.length};
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
  // Conteúdo institucional administrável por HTML, sem duplicar o logotipo.
  function syncInstitutional(sectionNode){
    if(!sectionNode)return;
    var admin=d.getElementById('cc26-institutional-content');
    var source=admin&&(admin.content||admin);
    var paragraphs=source?[].slice.call(source.querySelectorAll('p')).map(function(p){
      return (p.textContent||'').trim();
    }).filter(Boolean):[];
    var configured=cfg.conteudo.textoEmpresa;
    if(!paragraphs.length)paragraphs=(Array.isArray(configured)?configured:String(configured||'').split(/\n\s*\n/))
      .map(function(p){return String(p).trim();}).filter(Boolean);
    var copy=sectionNode.querySelector('.cc26-institutional__copy');
    var signature=JSON.stringify(paragraphs);
    if(copy && copy.dataset.cc26Text!==signature){
      copy.replaceChildren.apply(copy,paragraphs.map(function(p){return el('p','',p);}));
      copy.dataset.cc26Text=signature;
    }
    var headerLogo=d.querySelector('#cc26-new-header .cc26-site-header__brand img[src]')||
                   d.querySelector('#cabecalho .logo img[src]');
    var logo=sectionNode.querySelector('.cc26-institutional__logo');
    var src=headerLogo&&(headerLogo.currentSrc||headerLogo.getAttribute('src'));
    if(logo&&src){
      if(logo.getAttribute('src')!==src)logo.setAttribute('src',src);
      var alt=headerLogo.alt||'Cabcom';
      if(logo.alt!==alt)logo.alt=alt;
      logo.hidden=false;
    }
    state.institutional={source:source&&source.querySelector('p')?'HTML da Loja Integrada':'configuração padrão',
      paragraphs:paragraphs.length,logo:src?'logo do topo':'aguardando logo do topo'};
  }
  function institutional(){
    if(!cfg.home.institucional)return null;
    var s=section('cc26-institutional');
    var c=wrap(),panel=el('div','cc26-institutional__panel');
    var logo=el('img','cc26-institutional__logo');
    logo.alt='Cabcom';logo.decoding='async';logo.loading='lazy';logo.hidden=true;
    panel.appendChild(logo);
    panel.appendChild(el('div','cc26-institutional__copy'));
    c.appendChild(panel);s.appendChild(c);
    s.setAttribute('aria-label','Sobre a Cabcom');
    syncInstitutional(s);
    return s;
  }
  function instagram(){
    if(!cfg.home.instagram)return null;
    var link=safeInstagram(cfg.conteudo.instagram);
    var s=section('cc26-instagram');
    var c=wrap(), heading=link?a(link,'cc26-instagram__title'):el('div','cc26-instagram__title');
    if(link){heading.target='_blank';heading.rel='noopener noreferrer';}
    heading.appendChild(inlineIcon('instagram'));
    var copy=el('div','cc26-instagram__heading-copy');
    copy.appendChild(el('span','','Siga-nos no Instagram'));
    copy.appendChild(el('strong','','@cabcomoficial'));heading.appendChild(copy);
    c.appendChild(heading);
    var scroll=el('div','cc26-instagram__scroll');
    scroll.setAttribute('aria-label','Publicações do Instagram da Cabcom');
    var media=link?a(link,'cc26-instagram__link'):el('div','cc26-instagram__link');
    if(link){media.target='_blank';media.rel='noopener noreferrer';}
    var picture=el('img');picture.src='https://cdn.awsli.com.br/80/80577/arquivos/insta.png';
    picture.alt='Quatro publicações da Cabcom no Instagram';picture.width=1730;picture.height=525;
    picture.loading='lazy';picture.decoding='async';
    media.appendChild(picture);scroll.appendChild(media);c.appendChild(scroll);s.appendChild(c);return s;
  }
  // Normalização visual progressiva das vitrines sem clonar produtos nem slider LI.
  function labelHomeShelves(listing){
    [].slice.call(listing.querySelectorAll('.titulo-categoria')).forEach(function(heading){
      var label=normalized(heading.textContent||'');
      var type=/LANCAMENTO|NOVIDADE/.test(label)?'launches':(/MAIS VENDIDOS|DESTAQUE|BEST/.test(label)?'bestsellers':'');
      if(!type)return;
      heading.classList.add('cc26-shelf-heading--'+type);
      var candidate=heading.closest('.listagem, .vitrine-produtos, .listagem-linha, .listagem-item');
      if(!candidate || candidate===listing || candidate.querySelectorAll('.titulo-categoria').length>1){
        candidate=heading.parentElement;
        while(candidate && candidate!==listing &&
              !candidate.querySelector('.produtos-carrossel,.listagem-linha,.listagem-item')){
          candidate=candidate.parentElement;
        }
      }
      if(candidate && candidate!==listing && candidate.querySelectorAll('.titulo-categoria').length===1)
        candidate.classList.add('cc26-shelf-block--'+type);
    });
  }
  // Card de catálogo aprovado: duas ações de contato, nunca "Ver mais" sozinho.
  // Preserve o link/ação nativa quando existir; os outros só usam dados reais LI.
  // Card de cotação: estrutura idêntica à referência, SEM "Ver mais" e
  // sem selos de desconto que a LI gera mesmo em produtos sem preço.
  // Os links reais do produto e do carrinho permanecem acessíveis.
  // Paginação Cabcom: scroll nativo com cinco colunas reais no desktop.
  // Não altera produtos, links ou handlers comerciais. Não depende dos
  // cálculos/width/transform do FlexSlider legado da Loja Integrada.
  var catalogPaging=new WeakMap();
  // O tema antigo da Cabcom troca o FlexSlider pelo Owl no window.load.
  // Configurar a instância efetiva, não o wrapper descartado pelo tema.
  function configureLegacyOwl(list){
    if(!w.jQuery)return false;
    var $list=w.jQuery(list),owl=$list.data('owl.carousel');
    if(!owl||!owl.options||typeof owl.refresh!=='function')return false;
    var responsive=owl.options.responsive||{},changed=false;
    // Owl multiplica a duração pela distância entre slides: 220 ms x 5
    // resulta em aproximadamente 1,1 s de transição no desktop.
    function timing(desktop){
      var speed=desktop?220:500;
      return {smartSpeed:speed,navSpeed:speed,autoplaySpeed:speed,
        autoplayTimeout:7500,autoplayHoverPause:true};
    }
    function set(target,settings){
      Object.keys(settings).forEach(function(key){
        if(target[key]!==settings[key]){target[key]=settings[key];changed=true;}
      });
    }
    set(owl.options,timing(false));
    Object.keys(responsive).forEach(function(key){
      if(!responsive[key])return;
      var desktop=Number(key)>=1024;
      set(responsive[key],timing(desktop));
      set(responsive[key],{items:desktop?5:Number(key)>=850?3:2,slideBy:desktop?5:1});
    });
    if(!responsive[0]){responsive[0]={};changed=true;}
    set(responsive[0],Object.assign(timing(false),{items:2,slideBy:1}));
    if(!responsive[850]){responsive[850]={};changed=true;}
    set(responsive[850],Object.assign(timing(false),{items:3,slideBy:1}));
    if(!responsive[1024]){responsive[1024]={};changed=true;}
    set(responsive[1024],Object.assign(timing(true),{items:5,slideBy:5}));
    owl.options.responsive=responsive;
    var expected=timing(w.innerWidth>=1024);
    expected.items=w.innerWidth>=1024?5:w.innerWidth>=850?3:2;expected.slideBy=w.innerWidth>=1024?5:1;
    if(typeof owl.items==='function'&&typeof owl.remove==='function'){
      var slides=owl.items(),hasProduct=slides.some(function(item){return item.is('.listagem-item')||item.find('.listagem-item').length;});
      if(hasProduct)for(var i=slides.length-1;i>=0;i--){if(!slides[i].is('.listagem-item')&&!slides[i].find('.listagem-item').length){owl.remove(i);changed=true;}}
    }
    [].slice.call(list.querySelectorAll('.listagem-item.cc26-reveal')).forEach(function(card){card.classList.remove('cc26-reveal','cc26-inview');});
    if(owl.settings&&Object.keys(expected).some(function(key){return owl.settings[key]!==expected[key];}))changed=true;
    if(changed){
      owl.invalidate('settings');
      owl.refresh();
      // Reiniciar apenas o timer existente, sem ativar autoplay em uma
      // vitrine cujo painel o tenha desabilitado.
      if(owl.settings&&owl.settings.autoplay){
        $list.trigger('stop.owl.autoplay');
        $list.trigger('play.owl.autoplay',[7500,owl.settings.autoplaySpeed]);
      }
    }
    if(!list.classList.contains('cc26-owl-managed'))list.classList.add('cc26-owl-managed');
    return true;
  }
  function mountCatalogPaging(list){
    // LI entrega data-produtos-linha="4" do painel; sobrescrever na camada
    // de prévia ANTES de a grade/slider fazer o cálculo responsivo.
    var columns=w.innerWidth>=1024?5:w.innerWidth>=850?3:2;
    var configured=list.getAttribute('data-produtos-linha');
    if(configured!==String(columns))list.setAttribute('data-produtos-linha',String(columns));
    if(w.jQuery)w.jQuery(list).data('produtos-linha',columns);
    [].slice.call(list.querySelectorAll('.listagem-linha')).forEach(function(row){
      var track=row.querySelector(':scope > .flex-viewport > ul, :scope > ul');
      if(!track)return;
      var cards=[].slice.call(track.children).filter(function(slot){
        return slot.matches('li')&&!slot.matches('.clone,.flex-clone,.slick-cloned')&&!!slot.querySelector('.cc26-card-two-cta');
      });
      if(!cards.length)return;
      // Desativa apenas autoplay legado; as ações nativas dos produtos ficam intactas.
      var native=w.jQuery&&w.jQuery(row).data('flexslider');
      if(native && native!==row.cc26PausedSlider){
        try{if(typeof native.stop==='function')native.stop();else if(typeof native.pause==='function')native.pause();}
        catch(e){warn('Cabcom: autoplay legado não pôde ser pausado.');}
        row.cc26PausedSlider=native;
      }
      row.classList.add('cc26-page-carousel');
      track.classList.add('cc26-page-track');
      row.dataset.cc26CarouselColumns=String(columns);
      track.style.setProperty('--cc26-cols',String(columns));
      // Caso o plugin LI recalcule o slide depois do carregamento, manter
      // transform e largura do track entregues ao CSS da Cabcom.
      track.style.setProperty('transform','none','important');
      track.style.setProperty('width','100%','important');
      track.style.setProperty('max-width','100%','important');
      if(native && native.vars){
        native.vars.slideshow=false;
        native.vars.move=columns;
      }
      var current=catalogPaging.get(row);
      if(current&&current.track===track){
        row.dataset.cc26CarouselColumns=String(columns);
        track.style.setProperty('--cc26-cols',String(columns));
        current.sync();return;
      }
      if(current){current.track.removeEventListener('scroll',current.sync);current.controls.remove();}
      var controls=el('div','cc26-page-controls');
      function arrow(direction,label){
        var button=el('button','cc26-page-arrow cc26-page-arrow--'+direction);
        button.type='button';button.setAttribute('aria-label',label);
        button.appendChild(inlineIcon('arrow'));return button;
      }
      var prev=arrow('prev','Produtos anteriores'),next=arrow('next','Próximos produtos');
      controls.appendChild(prev);controls.appendChild(next);row.appendChild(controls);
      track.setAttribute('aria-label','Vitrine de produtos');
      track.tabIndex=0;
      function sync(){
        var max=Math.max(0,track.scrollWidth-track.clientWidth);
        prev.disabled=track.scrollLeft<=2;
        next.disabled=track.scrollLeft>=max-2;
        controls.hidden=max<=2;
      }
      function advance(direction){
        var slots=[].slice.call(track.children).filter(function(slot){
          return slot.matches('li')&&!slot.matches('.clone,.flex-clone,.slick-cloned')&&slot.getClientRects().length;
        });
        if(!slots.length)return;
        var columns=w.innerWidth>=1024?5:w.innerWidth>=850?3:2;
        var gap=parseFloat(w.getComputedStyle(track).columnGap)||0;
        var stride=slots[0].getBoundingClientRect().width+gap;
        if(!stride)return;
        var step=w.innerWidth>=1024?columns:1;
        var position=Math.round(track.scrollLeft/stride);
        var target=Math.max(0,Math.min(track.scrollWidth-track.clientWidth,(position+direction*step)*stride));
        track.scrollTo({left:target,behavior:reducedMotion()?'instant':'smooth'});
      }
      prev.addEventListener('click',function(){advance(-1);});
      next.addEventListener('click',function(){advance(1);});
      track.addEventListener('scroll',sync,{passive:true});
      catalogPaging.set(row,{track:track,controls:controls,sync:sync});
      w.requestAnimationFrame(sync);
    });
  }
  function decorateQuoteCards(){
    if(!cfg.catalogo.ativo)return;
    var scope=d.querySelector('#corpo');
    if(!scope)return;
    var nodes=[].slice.call(scope.querySelectorAll(
      '.listagem-item, .listagem li.produto, .vitrine-produtos .produto, '+
      '.produtos-carrossel li.produto, .produtos-relacionados .produto, '+
      '.aproveite-tambem .produto, #aproveite-tambem .produto'
    )).filter(function(card){
      // Nunca aplicar o card à ficha PDP, carrinho ou a um wrapper de outros cards.
      if(card.closest('.cc26-cart-sidebar,.tabela-carrinho,.cc26-pdp__grid'))return false;
      if(card.querySelector('.listagem-item'))return false;
      return !!card.querySelector('.imagem-produto img') && !!card.querySelector('.nome-produto,.produto-nome');
    });
    function isMore(node){
      var label=normalized(node.textContent||node.value||node.getAttribute('aria-label')||'').trim();
      return /^(VER MAIS|SAIBA MAIS|VER PRODUTO|VER DETALHES)$/i.test(label);
    }
    function hideLegacy(card){
      [].slice.call(card.querySelectorAll('a,button,input[type="button"],input[type="submit"]'))
        .forEach(function(node){
          if(isMore(node))node.classList.add('cc26-card-legacy-action');
        });
      // A barra azul e o badge porcentual pertencem ao card legado, não ao
      // padrão com cotação. Nada é removido do DOM ou das ações nativas.
      [].slice.call(card.querySelectorAll(
        '.acoes-produto-responsiva,.barra-progresso,.barra-de-progresso,.progress-bar,.progresso,'+
        '.fundo-principal.borda-principal,.desconto,.desconto-produto,'+
        '.selo-desconto,.tag-desconto,.desconto-porcentagem'
      )).forEach(function(node){node.classList.add('cc26-card-legacy-visual');});
    }
    var completed=0;
    nodes.forEach(function(card){
      if(card.classList.contains('cc26-card-two-cta') &&
         card.querySelector(':scope > .cc26-card-quote-actions')){
        var legacy=card.querySelector('.acoes-produto');
        if(legacy)legacy.classList.add('cc26-card-legacy-visual');
        hideLegacy(card);
        completed++;
        return;
      }
      var productLink=card.querySelector(
        '.nome-produto a[href],a.nome-produto[href],.imagem-produto a[href],a.imagem-produto[href],a.produto-nome[href]'
      );
      if(!productLink)return;
      var productURL,href;
      try{
        productURL=new URL(productLink.getAttribute('href'),location.href);
        if(productURL.origin!==location.origin || !/^https?:$/.test(productURL.protocol))return;
        if(preview && !productURL.searchParams.has('cabcom_preview'))
          productURL.searchParams.set('cabcom_preview','1');
        href=productURL.href;
      }catch(e){return;}
      var labelNode=card.querySelector('.nome-produto,.produto-nome');
      var productName=(labelNode?labelNode.textContent:productLink.textContent||'')
        .replace(/\s+/g,' ').trim();
      if(!productName)return;
      var actions=card.querySelector('.acoes-produto');
      var existing=[].slice.call(card.querySelectorAll('a[href]'));
      var whatsExisting=existing.find(function(anchor){
        return /WHATSAPP/.test(normalized(anchor.textContent||anchor.getAttribute('aria-label')||'')) ||
          /wa\.me|api\.whatsapp\.com/i.test(anchor.href||'');
      });
      var emailExisting=existing.find(function(anchor){
        return /COTAR\s+POR\s+E.?MAIL|COTAR\s+E.?MAIL|LISTA.*ORCAMENTO/.test(
          normalized(anchor.textContent||anchor.getAttribute('aria-label')||''));
      });
      var addExisting=existing.find(function(anchor){
        try {
          var u=new URL(anchor.href,location.href);
          return u.origin===location.origin &&
            /^\/carrinho\/produto\/\d+\/adicionar\/?$/i.test(u.pathname);
        }catch(e){return false;}
      });
      var whats=whatsExisting;
      if(!whats){
        var phone=String(cfg.conteudo.contato||'').replace(/\D/g,'');
        if(!/^\d{10,11}$/.test(phone))return;
        var url='https://wa.me/55'+phone+'?text='+
          encodeURIComponent('Olá! Gostaria de cotar o produto: '+productName+' — '+href);
        whats=a(url,'cc26-card-quote-actions__whatsapp','');
        whats.target='_blank';whats.rel='noopener noreferrer';
      }
      var email=emailExisting||addExisting;
      if(!email){
        var id=card.getAttribute('data-produto-id')||card.getAttribute('data-product-id')||
          card.getAttribute('data-id')||
          card.querySelector('[data-produto-id]')?.getAttribute('data-produto-id')||'';
        if(/^\d+$/.test(id)){
          email=a('/carrinho/produto/'+id+'/adicionar','cc26-card-quote-actions__email','');
        }else{
          email=a(href,'cc26-card-quote-actions__email','');
          email.dataset.cc26QuoteFallback='pdp';
        }
      }
      // CTA independente: jamais herda a altura, hover, opacity ou display
      // da .acoes-produto original. Ações LI ficam disponíveis no DOM.
      var newActions=el('div','cc26-card-quote-actions');
      function visibleCTA(original,kind,label,icon){
        var link=a(original.getAttribute('href')||href,'cc26-card-quote-actions__'+kind);
        link.appendChild(inlineIcon(icon));
        link.appendChild(el('span','',label));
        link.setAttribute('aria-label',label);
        if(original.target){link.target=original.target;link.rel='noopener noreferrer';}
        if(original.dataset.cc26QuoteFallback)link.dataset.cc26QuoteFallback=original.dataset.cc26QuoteFallback;
        // Se o tema usar ação própria, delega ao original; a rota de cotação
        // oficial é interceptada pelo sidebar no clique do link novo.
        if(existing.indexOf(original)>=0){
          var nativeURL;
          try{nativeURL=new URL(original.href,location.href);}catch(e){}
          var official=kind==='email'&&nativeURL&&nativeURL.origin===location.origin&&/^\/carrinho\/produto\/\d+\/adicionar\/?$/i.test(nativeURL.pathname);
          var directWhats=kind==='whatsapp'&&nativeURL&&/^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)$/i.test(nativeURL.hostname);
          if(!official&&!directWhats){
            link.addEventListener('click',function(ev){
              if(ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
              ev.preventDefault();original.click();
            });
          }
          original.classList.add('cc26-card-legacy-action');
        }
        return link;
      }
      newActions.appendChild(visibleCTA(whats,'whatsapp','Cotar por WhatsApp','phone'));
      newActions.appendChild(visibleCTA(email,'email','Cotar por e-mail','mail'));
      existing.forEach(function(node){
        if((actions&&actions.contains(node))||isMore(node))node.classList.add('cc26-card-legacy-action');
      });
      // Composição fixa: foto, título, dois CTAs. Ações ficam no rodapé
      // sem depender de .info-produto ou do posicionamento legado.
      var photo=card.querySelector('.imagem-produto');
      var title=card.querySelector('.nome-produto,.produto-nome');
      if(photo)photo.classList.add('cc26-card-photo');
      if(title)title.classList.add('cc26-card-name');
      var info=card.querySelector('.info-produto');
      if(info)info.classList.add('cc26-card-info');
      // Mantém foto e título no lugar original; o CTA é filho direto do card.
      if(actions)actions.classList.add('cc26-card-legacy-visual');
      card.appendChild(newActions);
      card.classList.add('cc26-card-two-cta');
      // Mantém elementos LI no DOM; não deixa preços/selos ocupar o card de cotação.
      [].slice.call(card.querySelectorAll('.preco-produto,.bandeiras-produto,.bandeiras,.bandeira-promocao,.produto-selo,.produto-bandeiras,.avaliacao,.avaliacoes,.produto-avaliacoes')).forEach(function(node){
        if(!node.contains(newActions))node.classList.add('cc26-card-legacy-visual');
      });
      hideLegacy(card);
      completed++;
    });
    state.catalogCards={visual:'dois-ctas',total:nodes.length,decorated:completed,requested:2};
    // Uma mesma grade para resultados, categorias, home e relacionados.
    // Carrosséis existentes mantêm seus controles e cálculos nativos.
    var lists=scope.querySelectorAll('.listagem-linha>ul, .produtos-carrossel, .vitrine-produtos>ul, .listagem .slick-initialized, .vitrine-produtos .slick-initialized');
    var mountedCarousels=0;
    [].slice.call(lists).forEach(function(list){
      if(list.matches('.produtos-carrossel')){
        var desired=w.innerWidth>=1024?5:w.innerWidth>=850?3:2;
        if(list.getAttribute('data-produtos-linha')!==String(desired))
          list.setAttribute('data-produtos-linha',String(desired));
        if(w.jQuery)w.jQuery(list).data('produtos-linha',desired);
      }
      if(!list.querySelector('.cc26-card-two-cta'))return;
      var isSlider=list.matches('.produtos-carrossel,.slick-slider,.slick-initialized,.owl-carousel,.swiper-wrapper,.slides') ||
        !!list.closest('.slick-slider,.slick-initialized,.owl-carousel,.swiper,.flexslider,.bx-wrapper') ||
        !!list.querySelector('.slick-track,.owl-stage,.swiper-wrapper,.bx-viewport');
      if(isSlider){
        list.classList.remove('cc26-catalog-grid');
        if(list.matches('.produtos-carrossel')){
          if(!configureLegacyOwl(list)){
            // Não criar controles dentro da estrutura que o tema legado desmontará.
            var legacy=d.querySelector('script[src*="newfwrnewnovo2"]');
            if(!legacy||d.readyState==='complete'&&list.querySelector('.listagem-linha')&&!(w.jQuery&&w.jQuery.fn&&w.jQuery.fn.owlCarousel))mountCatalogPaging(list);
          }
          mountedCarousels++;
        }
        // Quando a LI usa Slick, configura cinco cards em telas largas pelo
        // próprio plugin (sem reescrever track ou clonar produtos).
        var slider=list.matches('.slick-initialized')?list:list.querySelector('.slick-initialized');
        if(slider && slider.slick && w.jQuery && slider.dataset.cc26CatalogSlick!=='1'){
          try{
            var instance=slider.slick, opts=instance.originalSettings||instance.options||{};
            var responsive=(Array.isArray(opts.responsive)?opts.responsive:[]).map(function(entry){
              return Object.assign({},entry,{settings:entry.settings==='unslick'?'unslick':Object.assign({},entry.settings)});
            });
            function addBreakpoint(bp,n){
              var found=responsive.find(function(x){return x.breakpoint===bp;});
              if(found){if(found.settings!=='unslick'){found.settings.slidesToShow=n;found.settings.slidesToScroll=n===5?5:1;}}
              else responsive.push({breakpoint:bp,settings:{slidesToShow:n,slidesToScroll:n===5?5:1}});
            }
            // Preserva ajustes nativos extras; padroniza quantidade por faixa.
            responsive.forEach(function(entry){
              if(entry.settings==='unslick')return;
              entry.settings.slidesToShow=entry.breakpoint<=850?2:entry.breakpoint<=1024?3:5;
              entry.settings.slidesToScroll=entry.settings.slidesToShow===5?5:1;
            });
            if(!opts.mobileFirst){
              addBreakpoint(1024,3);addBreakpoint(850,2);
              slider.dataset.cc26CatalogSlick='1';
              w.jQuery(slider).slick('slickSetOption',{slidesToShow:5,slidesToScroll:5,speed:550,responsive:responsive},true);
            }
          }catch(err){warn('Vitrine: configuração Slick mantida no padrão nativo.');}
        }
        [].slice.call(list.querySelectorAll('.slick-slide,.owl-item,.swiper-slide,.slides>li')).forEach(function(slide){
          if(!slide.matches('.cc26-card-two-cta')&&slide.querySelector('.cc26-card-two-cta'))slide.classList.add('cc26-catalog-slide');
        });
      }else if([].slice.call(list.children).some(function(child){
        return child.matches('.cc26-card-two-cta') || !!child.querySelector('.cc26-card-two-cta');
      })){
        list.classList.add('cc26-catalog-grid');
      }
    });
    state.carouselAudit={version:'2.2.15',source:'Loja Integrada',desktopProducts:5,
      mounted:mountedCarousels,windowWidth:w.innerWidth};
  }
  function decorateNativeShelves(){
    decorateQuoteCards();
    var listing=d.querySelector('#listagemProdutos');
    if(!listing)return;
    listing.classList.add('cc26-native-listing');
    if(home)labelHomeShelves(listing);
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
  // Ordem única da home aprovada. Os dois pares título/carrossel são os
  // elementos reais de #listagemProdutos, não cópias nem vitrines estáticas.
  function orderHomeSections(){
    if(!home||!cfg.home.ativo)return;
    var corpo=d.querySelector('#corpo');
    if(!corpo)return;
    var listing=corpo.querySelector('#listagemProdutos');
    function component(name){return corpo.querySelector('[data-cc26-component="'+name+'"]');}
    function place(parent,node,previous){
      if(!node||node===previous)return previous;
      var next=previous?previous.nextElementSibling:parent.firstElementChild;
      if(node.parentElement!==parent||node!==next){
        parent.insertBefore(node,next||null);
      }
      return node;
    }
    function shelf(type,selector,pattern){
      if(!listing)return null;
      var heading=listing.querySelector(selector)||[].slice.call(listing.querySelectorAll('.titulo-categoria')).find(function(h){
        return pattern.test(normalized(h.textContent||''));
      });
      if(!heading)return null;
      var wrapper=heading.closest('.cc26-home-shelf');
      if(wrapper&&listing.contains(wrapper))return wrapper;
      // No HTML da LI o UL do carrossel é o irmão imediatamente seguinte.
      var track=heading.nextElementSibling;
      if(!track||!track.matches('.produtos-carrossel,.listagem-linha,.vitrine-produtos'))return null;
      wrapper=el('section','cc26-home-shelf cc26-shelf-block--'+type);
      wrapper.dataset.cc26Shelf=type;
      heading.parentNode.insertBefore(wrapper,heading);
      wrapper.appendChild(heading);wrapper.appendChild(track);
      return wrapper;
    }
    var launches=shelf('launches','.titulo-categoria.vitrine-lancamento',/LANCAMENTO|NOVIDADE/);
    var best=shelf('bestsellers','.titulo-categoria.vitrine-mas-vendido,.titulo-categoria.vitrine-mais-vendido',/MAIS VENDIDOS/);
    var benefitsNode=component('cc26-benefits'),presentNode=component('cc26-presentation');
    // Hero e cabeçalho não fazem parte da ordenação solicitada.
    var heroNode=corpo.querySelector(':scope > .cc26-hero,:scope > .cc26-native-hero');
    var cursor=heroNode||null;
    cursor=place(corpo,benefitsNode,cursor);
    cursor=place(corpo,presentNode,cursor);
    var middle=[
      component('cc26-category-grid cc26-category-grid--cabos'),
      component('cc26-shortcuts'),
      component('cc26-category-grid cc26-category-grid--conectores')
    ];
    if(listing&&launches&&best&&launches!==best){
      listing.classList.add('cc26-home-ordered-listing');
      cursor=place(corpo,listing,cursor);
      var shelfCursor=place(listing,launches,null);
      middle.forEach(function(node){shelfCursor=place(listing,node,shelfCursor);});
      place(listing,best,shelfCursor);
    }else{
      // Não adivinhar a identidade de vitrines nem esconder produtos se
      // o painel ainda não entregou os dois títulos esperados.
      if(listing)cursor=place(corpo,listing,cursor);
      middle.forEach(function(node){cursor=place(corpo,node,cursor);});
    }
    ['cc26-mini-banners','cc26-brands','cc26-institutional','cc26-instagram'].forEach(function(name){
      cursor=place(corpo,component(name),cursor);
    });
    var order=[].slice.call(corpo.querySelectorAll('[data-cc26-component],.cc26-home-shelf'))
      .map(function(node){return node.dataset.cc26Shelf||node.getAttribute('data-cc26-component');})
      .filter(function(name){return name&&name!=='cc26-hero cc26-approved-preview-hero'&&name!=='cc26-hero';});
    state.homeOrder={launches:!!launches,bestsellers:!!best,order:order};
  }
  function homeContent(){
    if(!home||!cfg.home.ativo)return;
    var corpo=d.querySelector('#corpo');
    if(!corpo)return;
    if(!corpo.classList.contains('cc26-native-home')){
      hero(corpo);
      corpo.classList.add('cc26-native-home');
    }
    function ensure(selector,factory){
      if(corpo.querySelector(selector))return;
      var node=factory();
      if(node&&!node.parentNode)corpo.appendChild(node);
    }
    ensure('.cc26-benefits',benefits);
    ensure('.cc26-presentation',presentation);
    ensure('.cc26-category-grid--cabos',function(){return categoryGrid('cabos');});
    ensure('.cc26-shortcuts',shortcuts);
    ensure('.cc26-category-grid--conectores',function(){return categoryGrid('conectores');});
    var mini=miniBanners();if(mini&&!mini.parentNode)corpo.appendChild(mini);
    ensure('.cc26-brands',brands);
    ensure('.cc26-institutional',institutional);
    ensure('.cc26-instagram',instagram);
    enhanceShelves(corpo);
    orderHomeSections();
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
  // Lê exclusivamente dados da loja: imagens e sprites reais de pagamento.
  function syncFooterCommerce(native,f){
    var payPattern=/VISA|MASTER|AMERICAN|ELO\b|DINERS|HIPER|BOLETO|AURA\b|CARTAO|PIX\b|PAGSEGURO|MERCADO PAGO|PAYPAL/;
    var securePattern=/SEGURO|SEGURANCA|SSL|CERTIFIC|NORTON|VERISIGN|TRUST|GOOGLE/;
    var paymentScope='.formas-pagamento,.meios-pagamento,.bandeiras-pagamento,.pagamento,.bandeiras,.pagamento-selos .pagamento';
    var securityScope='.selos,.seguranca,.selos-seguranca,.selo-ssl';
    function read(selector,pattern,security){
      var result=[],seen=new Set();
      function add(entry,key){if(!seen.has(key)){seen.add(key);result.push(entry);}}
      [].slice.call(native.querySelectorAll(selector)).forEach(function(group){
        [].slice.call(group.querySelectorAll('img,i,span[class],li[class]')).forEach(function(node){
          var img=node.matches('img');
          var label=(node.getAttribute('alt')||node.getAttribute('title')||node.getAttribute('aria-label')||'').trim();
          if(!label&&!img)label=(node.textContent||'').trim();
          var raw=img?(node.getAttribute('data-original')||node.getAttribute('data-src')||node.currentSrc||node.getAttribute('src')||''):'';
          var key=normalized(label+' '+(node.className||'')+' '+raw);
          if(security?!pattern.test(key):(!pattern.test(key)||securePattern.test(key)))return;
          if(img&&raw){
            try{var u=new URL(raw,location.href);if(!/^https?:$/.test(u.protocol))return;raw=u.href;}catch(e){return;}
            add({url:raw,label:label|| (security?'Selo de segurança':'Forma de pagamento')},raw);
          }else if(!img&&!node.querySelector('img,i,span[class]')){
            var cs=w.getComputedStyle(node),bg=cs.backgroundImage;
            var width=parseFloat(cs.width),height=parseFloat(cs.height);
            if(bg&&bg!=='none'&&width>=10&&width<=300&&height>=10&&height<=100){
              add({sprite:bg,position:cs.backgroundPosition,size:cs.backgroundSize,width:width,height:height,label:label||node.className},bg+'|'+cs.backgroundPosition);
            }else if(label&&label.length<=45&&pattern.test(normalized(label))){
              add({label:label},'label:'+normalized(label));
            }
          }
        });
      });
      return result.slice(0,18);
    }
    function render(target,entries,empty){
      if(!target)return;
      var signature=JSON.stringify(entries);
      if(target.dataset.cc26SourceSignature===signature)return;
      target.dataset.cc26SourceSignature=signature;
      var children=entries.map(function(item){
        if(item.url){var image=el('img');image.src=item.url;image.alt=item.label;image.loading='lazy';return image;}
        if(item.sprite){
          var icon=el('span','cc26-footer__payment-sprite');
          icon.setAttribute('role','img');icon.setAttribute('aria-label',item.label);
          icon.style.backgroundImage=item.sprite;icon.style.backgroundPosition=item.position;
          icon.style.backgroundSize=item.size;icon.style.width=item.width+'px';icon.style.height=item.height+'px';
          return icon;
        }
        return el('span','cc26-footer__payment-label',item.label);
      });
      if(!children.length&&empty)children.push(el('p','cc26-footer__payment-note',empty));
      target.replaceChildren.apply(target,children);
    }
    var payments=read(paymentScope,payPattern,false),seals=read(securityScope,securePattern,true);
    render(f.querySelector('.cc26-footer__badges'),payments,'Consulte as condições de pagamento na cotação.');
    render(f.querySelector('.cc26-footer__seals'),seals,'');
    // A LI fornece o copyright em um <p> sem classe: manter o texto integral,
    // inclusive razão social, CNPJ, pontuação e ano, sem cortar no primeiro ponto.
    var legal=[].slice.call(native.querySelectorAll('p,.direitos-reservados,.copyright,.direitos')).find(function(n){
      return /TODOS OS DIREITOS RESERVADOS|COPYRIGHT/.test(normalized(n.textContent||''));
    });
    var legalText=legal?(legal.textContent||'').replace(/\s+/g,' ').trim():'';
    var target=f.querySelector('.cc26-footer__legal');
    if(target&&target.textContent!==legalText)target.textContent=legalText;
    state.footer={origin:'Loja Integrada',paymentLogos:payments.length,securityLogos:seals.length,
      copyright:!!legalText,credit:'FWR'};
  }
  function footer(){
    if(!cfg.rodape.ativo)return;
    var native=d.querySelector('#rodape');
    if(!native)return;
    var existing=d.getElementById('cc26-footer');
    if(existing){syncFooterCommerce(native,existing);return;}
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
    var final=footerColumn('Pagamento','cc26-footer__payment');
    final.appendChild(el('div','cc26-footer__badges'));
    final.appendChild(el('h3','cc26-footer__security-title','Segurança'));
    final.appendChild(el('div','cc26-footer__seals'));
    grid.appendChild(contact);grid.appendChild(account);grid.appendChild(institutional);grid.appendChild(final);
    [].slice.call(grid.children).forEach(function(col,index){
      var heading=col.querySelector(':scope > h3');
      if(!heading)return;
      var label=heading.textContent,body=el('div','cc26-footer__column-content'),toggle=el('button','cc26-footer__toggle');
      body.id='cc26-footer-content-'+index;toggle.type='button';toggle.setAttribute('aria-controls',body.id);
      toggle.appendChild(el('span','',label));toggle.appendChild(inlineIcon('arrow'));
      heading.replaceChildren(toggle);
      [].slice.call(col.children).filter(function(n){return n!==heading;}).forEach(function(n){body.appendChild(n);});
      col.appendChild(body);
      function sync(){var mobile=w.innerWidth<=767,expanded=!mobile||col.classList.contains('cc26-footer--expanded');toggle.disabled=!mobile;toggle.setAttribute('aria-expanded',String(expanded));body.hidden=!expanded;}
      toggle.addEventListener('click',function(){if(w.innerWidth<=767){col.classList.toggle('cc26-footer--expanded');sync();}});
      sync();w.addEventListener('resize',sync,{passive:true});
    });
    main.appendChild(grid);f.appendChild(main);
    var bottom=el('div','cc26-footer__bottom');
    var bottomInner=wrap();bottomInner.classList.add('cc26-footer__bottom-inner');
    bottomInner.appendChild(el('small','cc26-footer__legal'));
    var brandCredit=a('https://fwragenciadigital.com.br/','cc26-footer__credit');
    brandCredit.setAttribute('aria-label','Desenvolvimento FWR Agência Digital');
    brandCredit.target='_blank';brandCredit.rel='noopener noreferrer';
    var creditLogo=el('img');creditLogo.src=asset('fwr.png');creditLogo.alt='FWR Agência Digital';
    creditLogo.width=43;creditLogo.height=16;
    brandCredit.appendChild(creditLogo);
    bottomInner.appendChild(brandCredit);
    bottom.appendChild(bottomInner);f.appendChild(bottom);
    native.parentNode.insertBefore(f,native);
    native.classList.add('cc26-footer-source-hidden');
    syncFooterCommerce(native,f);
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
      // Animar a seção, não slides individuais clonados pelo Owl.
      if(node.matches('.listagem-item,.cc26-benefit')&&node.closest('.produtos-carrossel,.cc26-benefits')){
        node.classList.remove('cc26-reveal','cc26-inview');return;
      }
      if(w.innerWidth<=767&&d.body.matches('.pagina-categoria,.pagina-busca')&&node.matches('.listagem-item')){
        node.classList.remove('cc26-reveal','cc26-inview');return;
      }
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
  // Produto Cabcom | conversao para orcamento sem alterar o HTML comercial LI.
  function enhanceProductPage(){
    if(!cfg.produto || cfg.produto.ativo===false || !d.body)return;
    var mainPicture=d.querySelector('#corpo #imagemProduto');
    if(!d.body.classList.contains('pagina-produto') && !mainPicture)return;
    if(d.body.classList.contains('cc26-pdp-ready'))return;
    var titleSource=d.querySelector('#corpo .info-principal-produto') ||
                    d.querySelector('#corpo .principal h1.nome-produto') ||
                    d.querySelector('#corpo h1.nome-produto');
    if(!mainPicture || !titleSource){
      state.product={active:false,reason:'imagem ou bloco de informações não localizado'};
      return;
    }
    function directChild(container,target){
      var node=target;
      while(node && node.parentElement!==container)node=node.parentElement;
      return node&&node.parentElement===container?node:null;
    }
    // Busca o menor container comum de foto e informações.
    // Aceita colunas span5/span7, span6, bootstrap ou tema customizado.
    var layout=null;
    for(var ancestor=mainPicture.parentElement;ancestor && ancestor!==d.body;ancestor=ancestor.parentElement){
      if(!ancestor.contains(titleSource))continue;
      var left=directChild(ancestor,mainPicture);
      var right=directChild(ancestor,titleSource);
      if(left && right && left!==right) {
        layout={grid:ancestor,media:left,info:right};
        break;
      }
    }
    if(!layout || !d.querySelector('#corpo').contains(layout.grid)){
      state.product={active:false,reason:'colunas da página não reconhecidas'};
      warn('PDP: colunas não reconhecidas; mantendo os controles nativos.');
      return;
    }
    var grid=layout.grid,media=layout.media,info=layout.info;
    var root=grid.closest('.produto, #produto')||grid.parentElement;
    if(!root || root===d.body)root=grid;
    state.product={active:false,reason:'estrutura reconhecida',gridClass:grid.className||'',mediaClass:media.className||'',detailsClass:info.className||''};
    var name=info.querySelector('.info-principal-produto h1, h1.nome-produto') ||
             root.querySelector('h1.nome-produto');
    var description=root.querySelector('.produto-descricao, .tab-content, #descricao, .descricao') ||
                    d.querySelector('#corpo .produto-descricao, #corpo .tab-content, #descricao');
    var nativeActions=info.querySelector('.acoes-produto')||info;
    var buttons=[].slice.call(nativeActions.querySelectorAll('a[href],button[type="submit"],button[type="button"],input[type="submit"]'));
    function btnLabel(elm){return normalized((elm.textContent||elm.value||elm.getAttribute('aria-label')||'').replace(/\s+/g,' '));}
    function containsWhatsapp(elm){
      var href=elm.getAttribute('href')||'';
      return /WHATSAPP/.test(btnLabel(elm))||/wa\.me|api\.whatsapp\.com|web\.whatsapp\.com/i.test(href);
    }
    function containsQuote(elm){
      return /COTAR\s+POR\s+E.?MAIL|COTAR\s+E.?MAIL|ADICIONAR.*ORCAMENTO|LISTA.*ORCAMENTO/.test(btnLabel(elm));
    }
    var whatsapp=buttons.find(containsWhatsapp);
    var quote=buttons.find(containsQuote);
    // A ficha deve continuar funcional mesmo se o tema usa um botão em outra coluna.
    if(!whatsapp || !quote){
      var extra=[].slice.call(info.querySelectorAll('a[href],button,input[type="submit"]'));
      whatsapp=whatsapp||extra.find(containsWhatsapp);
      quote=quote||extra.find(containsQuote);
    }
    // O tema legado deixa .cotar-whats fora da ficha antes de movê-lo no load.
    if(!whatsapp)whatsapp=d.querySelector('.cotar-whats a[href]');
    root.classList.add('cc26-pdp','cc26-pdp--editorial');
    grid.classList.add('cc26-pdp__grid');
    media.classList.add('cc26-pdp__media');
    info.classList.add('cc26-pdp__details');
    var stage=media.querySelector('.conteiner-imagem');
    if(stage)stage.classList.add('cc26-pdp__image-stage');
    // O tema Cabcom utiliza .thumbs-vertical, não apenas .produto-thumbs.
    // Movemos o mesmo elemento nativo (sem cloná-lo) abaixo da foto;
    // os handlers de imagem/zoom e a escolha de miniatura continuam na LI.
    var thumbs=media.querySelector('.thumbs-vertical, .produto-thumbs')||
               root.querySelector('.thumbs-vertical, .produto-thumbs');
    if(thumbs){
      thumbs.classList.add('cc26-pdp__thumbs');
      var imageBlock=stage && directChild(media,stage);
      var thumbBlock=directChild(media,thumbs);
      if(imageBlock && thumbBlock && imageBlock!==thumbBlock){
        if(thumbBlock!==imageBlock.nextElementSibling)media.insertBefore(thumbBlock,imageBlock.nextSibling);
      }else if(imageBlock && imageBlock.contains(thumbs)){
        media.insertBefore(thumbs,imageBlock.nextSibling);
      }else if(imageBlock && !media.contains(thumbs) && !thumbs.contains(media)){
        media.insertBefore(thumbs,imageBlock.nextSibling);
      }
      state.productGallery={source:thumbs.classList.contains('thumbs-vertical')?'thumbs-vertical':'produto-thumbs',movedBelowImage:true};
    }
    var heading=info.querySelector('.info-principal-produto') || titleSource;
    heading.classList.add('cc26-pdp__heading');
    if(name){
      name.classList.add('cc26-pdp__name');
      var eyebrow=el('div','cc26-pdp__eyebrow');
      eyebrow.appendChild(inlineIcon('shield'));
      name.parentNode.insertBefore(eyebrow,name);
      var brand=heading.querySelector('.marca-produto');
      if(brand)eyebrow.appendChild(brand);
    }
    var price=info.querySelector('.preco-produto');
    if(price)price.classList.add('cc26-pdp__native-price');
    var controls=info.querySelector('.acoes-produto');
    if(controls)controls.classList.add('cc26-pdp__native-actions');
    var purchase=info.querySelector('.principal');
    if(purchase)purchase.classList.add('cc26-pdp__purchase');
    if(whatsapp){
      whatsapp.classList.add('cc26-pdp__cta','cc26-pdp__cta--whatsapp');
      if(!whatsapp.getAttribute('aria-label'))whatsapp.setAttribute('aria-label','Solicitar cotação por WhatsApp');
    }
    if(quote){
      quote.classList.add('cc26-pdp__cta','cc26-pdp__cta--quote');
      if(!quote.getAttribute('aria-label'))quote.setAttribute('aria-label','Adicionar à lista de orçamento por e-mail');
    }
    if(quote){
      // Mantém o botão real da LI; apenas orienta o contato por orçamento.
      var hint=el('p','cc26-pdp__quote-hint','Solicite valores e condições para este produto.');
      var container=quote.closest('.comprar')||quote;
      if(container && container.parentNode)container.parentNode.insertBefore(hint,container);
      if(whatsapp&&container.parentNode){
        var whatsBlock=whatsapp.closest('.cotar-whats')||whatsapp;
        if(!whatsBlock.contains(container))container.parentNode.insertBefore(whatsBlock,container);
      }
    }
    var code=info.querySelector('.codigo-produto');
    if(code)code.classList.add('cc26-pdp__code');
    var availability=info.querySelector('.disponibilidade-produto, .estoque, .disponibilidade');
    if(availability)availability.classList.add('cc26-pdp__stock');
    var crumbs=root.querySelector('.breadcrumbs')||d.querySelector('#corpo .breadcrumbs');
    if(crumbs)crumbs.classList.add('cc26-pdp__breadcrumbs');
    // Compartilhamento é movido após o resumo, antes de ocultar o breadcrumb.
    if(description)description.classList.add('cc26-pdp__description');

    // Conteudo de apoio sem prometer estoque, prazo ou preço nao confirmados.
    var assistance=el('section','cc26-pdp__assistance');
    assistance.setAttribute('aria-label','Como solicitar orçamento');
    var aHeading=el('div','cc26-pdp__assistance-heading');
    aHeading.appendChild(inlineIcon('phone'));
    aHeading.appendChild(el('strong','','Precisa de ajuda para escolher?'));
    assistance.appendChild(aHeading);
    assistance.appendChild(el('p','','Converse com nossa equipe ou adicione este produto à lista para solicitar uma cotação.'));
    var steps=el('div','cc26-pdp__steps');
    [['1','Escolha os produtos'],['2','Monte sua lista'],['3','Solicite o orçamento']].forEach(function(it){
      var step=el('span','cc26-pdp__step');
      step.appendChild(el('b','',it[0]));step.appendChild(el('span','',it[1]));steps.appendChild(step);
    });
    assistance.appendChild(steps);
    if(controls && controls.parentNode)controls.parentNode.insertBefore(assistance,controls.nextSibling);
    else info.appendChild(assistance);

    // Breve descrição técnica a partir do conteúdo real cadastrado na LI.
    // Não acrescentar características ou promessas que não estejam na página.
    function productSummaryText(){
      var candidates=[
        description,
        d.querySelector('#descricao .tab-pane.active, #descricao .tab-pane, #descricao .texto'),
        d.querySelector('#corpo .produto-descricao, #corpo .descricao-produto, #corpo .tab-content .active'),
        d.querySelector('#corpo .aba-descricao .tab-pane, #corpo [itemprop="description"]')
      ];
      for(var j=0;j<candidates.length;j++){
        var candidate=candidates[j];
        if(!candidate || info.contains(candidate))continue;
        var paragraphs=[].slice.call(candidate.querySelectorAll('p')).map(function(n){
          return (n.textContent||'').replace(/\s+/g,' ').trim();
        }).filter(function(x){return x.length>=55;});
        var raw=paragraphs.length?paragraphs.join(' '):(candidate.textContent||'').replace(/\s+/g,' ').trim();
        raw=raw.replace(/^(?:Descrição(?: do produto)?|Detalhes(?: do produto)?)\s*[:\-–]?\s*/i,'').trim();
        if(raw.length<65)continue;
        if(raw.length<=290)return raw;
        var snippet=raw.slice(0,290);
        var lastStop=snippet.lastIndexOf('. ');
        if(lastStop>=125)return snippet.slice(0,lastStop+1);
        var lastSpace=snippet.lastIndexOf(' ');
        return snippet.slice(0,lastSpace>150?lastSpace:285).trim().replace(/[,;:]$/,'')+'…';
      }
      return '';
    }
    var summaryText=productSummaryText();
    if(summaryText){
      var synopsis=el('section','cc26-pdp__synopsis');
      synopsis.setAttribute('aria-label','Resumo do produto');
      synopsis.appendChild(el('h2','cc26-pdp__synopsis-title','Sobre este produto'));
      synopsis.appendChild(el('p','cc26-pdp__synopsis-text',summaryText));
      assistance.parentNode.insertBefore(synopsis,assistance.nextSibling);
      state.productSummary={source:'descrição nativa LI',characters:summaryText.length};
    }else warn('PDP: sem descrição técnica legível para resumir; descrição original preservada.');

    // Acoes no mobile encaminham o clique para o botao nativo real.
    if(whatsapp || quote){
      var bar=el('div','cc26-pdp__mobile-bar');
      var label=el('div','cc26-pdp__mobile-copy');
      label.appendChild(el('strong','','Solicitar cotação'));
      label.appendChild(el('span','','Escolha como deseja falar com a Cabcom'));
      bar.appendChild(label);
      var mobileActions=el('div','cc26-pdp__mobile-buttons');
      if(whatsapp){
        var whatsBtn=el('button','cc26-pdp__mobile-whatsapp');
        whatsBtn.type='button';whatsBtn.appendChild(inlineIcon('phone'));
        whatsBtn.appendChild(el('span','','WhatsApp'));
        whatsBtn.addEventListener('click',function(){whatsapp.click();});
        mobileActions.appendChild(whatsBtn);
      }
      if(quote){
        var budgetBtn=el('button','cc26-pdp__mobile-quote');
        budgetBtn.type='button';budgetBtn.appendChild(inlineIcon('cart'));
        budgetBtn.appendChild(el('span','','Orçamento'));
        budgetBtn.addEventListener('click',function(){quote.click();});
        mobileActions.appendChild(budgetBtn);
      }
      bar.appendChild(mobileActions);d.body.appendChild(bar);
      if(w.IntersectionObserver){
        var anchor=quote||whatsapp;
        var viewWatcher=new w.IntersectionObserver(function(entries){
          entries.forEach(function(entry){bar.classList.toggle('cc26-pdp__mobile-bar--visible',!entry.isIntersecting);});
        },{threshold:0,rootMargin:'0px 0px -50px 0px'});
        viewWatcher.observe(anchor);
      }else bar.classList.add('cc26-pdp__mobile-bar--visible');
    }
    d.body.classList.add('cc26-pdp-ready');
    state.product={active:true,visual:'editorial-minimal',source:'PDP nativa LI',whatsapp:!!whatsapp,quote:!!quote};
  }
  function syncPdpQuoteOrder(){
    var info=d.querySelector('.cc26-pdp__details');
    if(!info)return;
    var quote=info.querySelector('.cc26-pdp__cta--quote'),hint=info.querySelector('.cc26-pdp__quote-hint');
    var whatsapp=info.querySelector('.cc26-pdp__cta--whatsapp,.cotar-whats a[href]')||d.querySelector('.cotar-whats a[href]');
    if(!quote||!hint||!whatsapp)return;
    var container=quote.closest('.comprar')||quote,block=whatsapp.closest('.cotar-whats')||whatsapp;
    if(!container.parentNode||block.contains(container))return;
    whatsapp.classList.add('cc26-pdp__cta','cc26-pdp__cta--whatsapp');
    if(block.parentNode!==container.parentNode||block.nextElementSibling!==container)container.parentNode.insertBefore(block,container);
    if(hint.parentNode!==container.parentNode||hint.nextElementSibling!==block)container.parentNode.insertBefore(hint,block);
  }
  // v2.2.17 — galeria responsiva sobre os links originais da Loja Integrada.
  // Cada faixa é uma área de rolagem independente, sem barra visual nem clones.
  var pdpThumbRecords=new WeakMap();
  function pdpImageKey(url){
    if(!url)return '';
    try{return new URL(url,location.href).pathname.split('/').pop();}catch(e){return '';}
  }
  function pdpLinkKey(link){
    var img=link.querySelector('img');
    return pdpImageKey((img&&img.getAttribute('data-mediumimg'))||link.getAttribute('data-imagem-grande')||(img&&img.getAttribute('src'))||'');
  }
  function pdpArrow(label,side,kind){
    var btn=el('button','cc26-pdp__arrow cc26-pdp__arrow--'+kind+' cc26-pdp__arrow--'+side);
    btn.type='button';btn.setAttribute('aria-label',label);
    btn.appendChild(inlineIcon('arrow'));
    return btn;
  }
  function pdpGalleryRecords(media){
    var wrappers=[].slice.call(media.querySelectorAll('.thumbs-vertical,.thumbs-horizontal'));
    if(!wrappers.length){
      var fallback=media.querySelector('.cc26-pdp__thumbs,.produto-thumbs');
      if(fallback)wrappers.push(fallback);
    }
    return wrappers.map(function(wrapper){
      wrapper.classList.toggle('cc26-pdp__thumb--only',wrappers.length===1);
      var track=wrapper.querySelector('ul.miniaturas,ul.slides')||
        (wrapper.matches('ul')?wrapper:null);
      if(!track)return null;
      var links=[].slice.call(track.querySelectorAll('a[data-imagem-grande],a[data-imagem-id],a[href]')).filter(function(a){
        return a.querySelector('img')&&!a.closest('.clone,.flex-clone,.slick-cloned');
      });
      if(!links.length)return null;
      wrapper.classList.add('cc26-pdp__thumbs','cc26-pdp__thumb-carousel');
      track.classList.add('cc26-pdp__thumb-track');
      links.forEach(function(link,i){link.setAttribute('aria-label','Ver imagem '+(i+1)+' do produto');});
      var rec=pdpThumbRecords.get(wrapper);
      if(rec&&rec.track!==track){
        rec.track.removeEventListener('scroll',rec.update);
        rec.track.removeEventListener('click',rec.onClick);
        rec.prev.remove();rec.next.remove();if(rec.resizeObserver)rec.resizeObserver.disconnect();rec=null;
      }
      if(!rec){
        var prev=pdpArrow('Miniaturas anteriores','prev','thumb');
        var next=pdpArrow('Próximas miniaturas','next','thumb');
        // A faixa permanece a mesma; controles são irmãos da estrutura FlexSlider.
        if(wrapper===track)return null;
        wrapper.appendChild(prev);wrapper.appendChild(next);
        rec={wrapper:wrapper,track:track,prev:prev,next:next,links:links,lastKey:null,visible:false};
        rec.update=function(){
          var visible=wrapper.clientWidth>0&&track.clientWidth>0;
          if(!visible){rec.visible=false;return;}
          var slots=rec.links.map(function(a){return a.closest('li')||a;});
          var first=slots[0].getBoundingClientRect(),last=slots[slots.length-1].getBoundingClientRect();
          var needed=last.right-first.left+2;
          wrapper.classList.toggle('cc26-pdp__thumb-overflow',needed>wrapper.clientWidth+1);
          var max=Math.max(0,track.scrollWidth-track.clientWidth);
          prev.hidden=next.hidden=max<=2;
          prev.disabled=track.scrollLeft<=2;
          next.disabled=track.scrollLeft>=max-2;
        };
        function scroll(direction){
          track.scrollBy({left:direction*Math.max(64,track.clientWidth*.78),behavior:reducedMotion()?'instant':'smooth'});
        }
        prev.addEventListener('click',function(){scroll(-1);});
        next.addEventListener('click',function(){scroll(1);});
        track.addEventListener('scroll',rec.update,{passive:true});
        rec.onClick=function(event){
          var target=event.target.closest&&event.target.closest('a');
          if(!target||rec.links.indexOf(target)<0)return;
          // Deixar o evento original atualizar a imagem e o zoom da LI.
          w.requestAnimationFrame(syncPdpEditorial);
        };
        track.addEventListener('click',rec.onClick);
        pdpThumbRecords.set(wrapper,rec);
        if(w.ResizeObserver){rec.resizeObserver=new w.ResizeObserver(function(){w.requestAnimationFrame(syncPdpEditorial);});rec.resizeObserver.observe(wrapper);}
      }
      rec.links=links;
      return rec;
    }).filter(Boolean);
  }
  function syncPdpGallery(media){
    var stage=media.querySelector('.cc26-pdp__image-stage'),main=media.querySelector('#imagemProduto');
    if(!stage||!main)return;
    var records=pdpGalleryRecords(media);
    if(!records.length)return;
    var visible=records.find(function(r){return r.wrapper.clientWidth>0&&r.track.clientWidth>0;})||records[0];
    var key=pdpImageKey(main.getAttribute('src')||main.currentSrc);
    var selected=visible.links.findIndex(function(link){return pdpLinkKey(link)===key;});
    if(selected<0){
      selected=visible.links.findIndex(function(link){return link.closest('li.active')||link.classList.contains('cc26-pdp__thumb-selected');});
      if(selected<0)selected=0;
      key=pdpLinkKey(visible.links[selected]);
    }
    records.forEach(function(rec){
      var active=rec.links.find(function(link){return pdpLinkKey(link)===key;});
      rec.links.forEach(function(link){
        var on=link===active;
        link.classList.toggle('cc26-pdp__thumb-selected',on);
        if(on){if(link.getAttribute('aria-current')!=='true')link.setAttribute('aria-current','true');}
        else if(link.hasAttribute('aria-current'))link.removeAttribute('aria-current');
      });
      var wasVisible=rec.visible;
      rec.update();
      rec.visible=rec.wrapper.clientWidth>0&&rec.track.clientWidth>0;
      if(rec.visible&&active&&(!wasVisible||rec.lastKey!==key)){
        var tr=rec.track.getBoundingClientRect(),ar=active.getBoundingClientRect();
        if(ar.left<tr.left)rec.track.scrollBy({left:ar.left-tr.left,behavior:'instant'});
        else if(ar.right>tr.right)rec.track.scrollBy({left:ar.right-tr.right,behavior:'instant'});
        rec.update();
      }
      rec.lastKey=key;
    });
    if(!stage.cc26GalleryArrows){
      var prev=pdpArrow('Imagem anterior','prev','main'),next=pdpArrow('Próxima imagem','next','main');
      stage.appendChild(prev);stage.appendChild(next);
      function advance(direction){
        var current=pdpGalleryRecords(media);
        var rec=current.find(function(r){return r.wrapper.clientWidth>0&&r.track.clientWidth>0;})||current[0];
        if(!rec||rec.links.length<2)return;
        var image=media.querySelector('#imagemProduto');
        var now=pdpImageKey(image&&image.getAttribute('src'));
        var i=rec.links.findIndex(function(link){return pdpLinkKey(link)===now;});
        if(i<0)i=rec.links.findIndex(function(link){return link.classList.contains('cc26-pdp__thumb-selected');});
        if(i<0)i=0;
        var target=rec.links[(i+direction+rec.links.length)%rec.links.length];
        target.click();
        w.requestAnimationFrame(syncPdpEditorial);
      }
      prev.addEventListener('click',function(){advance(-1);});
      next.addEventListener('click',function(){advance(1);});
      stage.cc26GalleryArrows=[prev,next];
    }
    stage.cc26GalleryArrows.forEach(function(btn){btn.hidden=visible.links.length<2;});
  }
  function syncPdpEditorial(){
    if(!d.body.classList.contains('cc26-pdp-ready'))return;
    var info=d.querySelector('#corpo .cc26-pdp__details'),media=d.querySelector('#corpo .cc26-pdp__media');
    if(!info||!media)return;
    var eyebrow=info.querySelector('.cc26-pdp__eyebrow'),brand=info.querySelector('.marca-produto');
    if(eyebrow&&brand&&!eyebrow.contains(brand))eyebrow.appendChild(brand);
    var summary=info.querySelector('.cc26-pdp__synopsis')||info.querySelector('.cc26-pdp__assistance');
    var share=d.querySelector('#corpo .abriga-compartilhamento')||media.querySelector('.produto-compartilhar');
    // Alguns temas mantêm o compartilhamento dentro de um wrapper fora de #corpo.
    if(!share)share=d.querySelector('.abriga-compartilhamento');
    if(share&&summary&&summary.parentNode&&!share.contains(summary)){
      share.classList.add('cc26-pdp__share');
      if(share.parentNode!==summary.parentNode||summary.nextElementSibling!==share)summary.parentNode.insertBefore(share,summary.nextSibling);
    }
    syncPdpGallery(media);
  }
  function enhanceNative(){
    if(cfg.catalogo.ativo){
      [].slice.call(d.querySelectorAll('.listagem .listagem-item, .vitrine-produtos .produto')).forEach(function(item){
        item.classList.add('cc26-native-product');
        // Acoes originais da LI nunca sao removidas ou substituidas.
      });
    }
    if(cfg.produto.ativo&&(d.body.classList.contains('pagina-produto')||d.querySelector('#corpo #imagemProduto')))d.body.classList.add('cc26-page-product');
    enhanceProductPage();
    syncPdpQuoteOrder();
    syncPdpEditorial();
    if(cfg.rodape.ativo){
      var f=d.querySelector('#rodape');
      if(f){f.classList.add('cc26-native-footer');footer();}
    }
    // Mensagens/cotacoes continuam nativas; sem interceptacao de eventos.
    enhanceCartPage();
    enhanceQuoteModalQuantities();
  }
  var scheduled=false;
  function refresh(){
    scheduled=false;
    if(!d.body)return;
    if(home)homeContent();
    decorateNativeShelves();
    enhanceNative();
    previewLegacy();
    if(!experience.mounted) {
      if(!d.getElementById('cc26-new-header'))enableHeader();
      initNavigationExperience();
    }
    syncTopbar();
    if(home)syncInstitutional(d.querySelector('.cc26-institutional'));
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
    if(home){
      if(typeof w.vitrineProdutos!=='undefined')w.vitrineProdutos=5;
      w.addEventListener('load',schedule,{once:true});
      [600,1800].forEach(function(ms){w.setTimeout(schedule,ms);});
    }
    w.addEventListener('resize',schedule,{passive:true});
    var observer=new MutationObserver(schedule);
    observer.observe(d.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset','data-src','data-original','data-srcset','data-produtos-linha']});
    state.initialized=true;
    log('ativo',state);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);