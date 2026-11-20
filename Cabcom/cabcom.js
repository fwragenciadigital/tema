/* Cabcom 2026 | FWR Agencia Digital | Integracao Loja Integrada
 * Camada visual conservadora: preserva DOM comercial, links nativos, catalogo,
 * estoque, cotacoes, busca, conta, carrinho, frete, cupom, pagamentos e checkout.
 * Preview: ?cabcom_preview=1; producao somente com publicarNaLoja:true.
 */
(function (w,d) {
  'use strict';
  if(w.Cabcom2026) return;
  var VERSION='1.0.0';
  var CDN='https://cdn.awsli.com.br/80/80577/arquivos/';
  var DEFAULTS={
    geral:{ativo:true,publicarNaLoja:false,debug:false},
    imagensBase:CDN,
    topo:{ativo:true},
    home:{ativo:true,hero:true,beneficios:true,apresentacao:true,cabos:true,conectores:true,atalhos:true,marcas:true,institucional:true,instagram:true},
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
    return x;
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
    top.textContent=promoText && promoText.length<180 ? promoText : 'CABCOM · FIOS E CABOS ELÉTRICOS';
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
    if(!logoOriginal)logo.appendChild(el('span','cc26-site-header__wordmark','Cabcom'));
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
      var submit=el('button','', '⌕');submit.type='submit';submit.setAttribute('aria-label','Pesquisar');
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
      var user=a(account.href,'cc26-site-header__action','♙');
      user.setAttribute('aria-label','Minha conta');actions.appendChild(user);
    }
    var cart=nativeHeader.querySelector('.carrinho > a[href], a[href*="/carrinho/"]');
    if(cart){
      var quote=a(cart.href,'cc26-site-header__action cc26-site-header__cart','🛒');
      quote.setAttribute('aria-label','Meu orçamento');
      var count=nativeHeader.querySelector('.qtd-carrinho');
      if(count&&count.textContent.trim())quote.appendChild(el('span','cc26-site-header__count',count.textContent.trim()));
      actions.appendChild(quote);
    }
    var toggle=el('button','cc26-site-header__toggle','☰');
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
    var icons={
      truck:'🚚',card:'▤',tag:'◇',lock:'♙'
    };
    items.forEach(function(item){
      var box=el('div','cc26-benefit');
      var icon=el('span','cc26-benefit__icon',icons[item[0]]);icon.setAttribute('aria-hidden','true');
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
    copy.appendChild(el('p','','Soluções de transmissão de energia e sinais para sistemas de rede, telecomunicações, automação industrial, áudio, vídeo e broadcast.'));
    copy.appendChild(el('p','','Cabos e conectores para aplicações profissionais, de acordo com os requisitos técnicos de cada projeto.'));
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
  function shortcuts(){
    if(!cfg.home.atalhos)return null;
    var items=[
      ['CABOS DE REDE','Cabo RJ45','⌁'],
      ['CABOS COAXIAIS','Cabo Coaxial','◉'],
      ['CONECTORES RJ45','Conectores','▦'],
      ['FERRAMENTAS','Crimpadores','⚒'],
      ['ADESIVOS','Fitas Isolantes','▰']
    ];
    var s=section('cc26-shortcuts');
    var grid=wrap();grid.classList.add('cc26-shortcuts__grid');
    items.forEach(function(item){
      var url=navAnchor(item[0]);
      if(!url)return;
      var link=a(url,'cc26-shortcut');
      link.appendChild(el('span','cc26-shortcut__symbol',item[2]));
      link.appendChild(el('strong','',item[1]));
      grid.appendChild(link);
    });
    if(!grid.children.length)return null;
    s.appendChild(grid);return s;
  }
  function brands(){
    if(!cfg.home.marcas)return null;
    var s=section('cc26-brands');
    var content=wrap();
    content.appendChild(title('Compre por marca'));
    var list=el('div','cc26-brands__grid');
    ['DATALINK','BELDEN','BETACAVI','RFS','SIEMENS','UGREEN'].forEach(function(label){
      var url=navAnchor(label);
      var node=url?a(url,'cc26-brands__brand',label):el('span','cc26-brands__brand',label);
      list.appendChild(node);
    });
    content.appendChild(list);s.appendChild(content);return s;
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
    var shortcut=shortcuts(),brand=brands(),inst=institutional(),ig=instagram();
    // Sem deslocar/duplicar cards nativos ou handlers da Loja Integrada.
    var first=shelves[0],second=shelves[1];
    if(first&&first.parentNode){
      var target=first;
      [cabos,shortcut].forEach(function(node){if(node){insertAfter(target,node);target=node;}});
    }else [cabos,shortcut].forEach(function(node){if(node)corpo.appendChild(node);});
    if(second&&second.parentNode){
      var next=second;
      if(conect){insertAfter(next,conect);next=conect;}
      if(brand){insertAfter(next,brand);}
    }else [conect,brand].forEach(function(node){if(node)corpo.appendChild(node);});
    [inst,ig].forEach(function(node){if(node)corpo.appendChild(node);});
    corpo.classList.add('cc26-native-home');
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
      if(f)f.classList.add('cc26-native-footer');
    }
    if(d.querySelector('.pagina-carrinho'))d.body.classList.add('cc26-page-cart');
  }
  var scheduled=false;
  function refresh(){
    scheduled=false;
    if(!d.body)return;
    if(home)enhanceShelves(d.querySelector('#corpo')||d.body);
    enhanceNative();
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    w.requestAnimationFrame(refresh);
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
    enhanceNative();
    var observer=new MutationObserver(schedule);
    observer.observe(d.body,{subtree:true,childList:true});
    state.initialized=true;
    log('ativo',state);
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window,document);