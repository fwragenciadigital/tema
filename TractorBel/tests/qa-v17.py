from pathlib import Path
from zipfile import ZipFile
import re
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parent.parent
js=(root/'tractorbel.js').read_text()
css=(root/'tractorbel.css').read_text()
fixture=re.search("fixture='''(.*?)'''",(root/'tests/qa-v14.py').read_text(),re.S).group(1)
fixture=fixture.replace('href="/','href="https://www.lojatractorbel.com.br/')
fixture=fixture.replace('<div id="cabecalho">','''<div id="cabecalho"><div class="conteiner"><div class="row-fluid"><h1 class="logo cor-secundaria"><a href="https://www.lojatractorbel.com.br/"><img src="https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png" alt="Logo oficial TractorBel" /></a></h1></div></div>''',1)
fixture=fixture.replace('<body>','''<body><div id="bar-top" style="height:50px">Barra antiga</div><div class="barra-inicial" style="height:90px">Boas-vindas</div>''',1)
assert 'function hero()' not in js
assert 'hero()' not in js
with ZipFile('/mnt/data/imagens.zip') as z:
 banner=z.read('vendedores.jpg')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name,width,height in [('mobile320',320,800),('mobile375',375,812),('mobile390',390,844),('mobile767',767,900),('tablet768',768,1024),('tablet900',900,900),('desktop1200',1200,960),('desktop1440',1440,1000),('desktop1920',1920,1080)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('https://cdn.awsli.com.br/901/901888/arquivos/*',lambda route:route.fulfill(status=200,body=banner,content_type='image/jpeg') if route.request.url.endswith('/vendedores.jpg') else route.abort())
  page.route('https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png',lambda route:route.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="96"><text x="12" y="65" fill="white" font-size="46">TRACTORBEL</text></svg>'))
  page.route('https://tractorbel-2026.vercel.app/assets/marcas/*',lambda route:route.fulfill(status=200,content_type='image/png',body=(root/'assets/marcas'/route.request.url.split('/')[-1]).read_bytes()))
  # Keep the local-approved JPEG route intact; other assets are optional in this fixture.
  page.set_content(fixture,wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js.replace("var isHome = /^\\/?(?:index\\.html)?\\/?$/.test(location.pathname);","var isHome = true;"))
  page.wait_for_selector('.tb26-institutional-banner__description strong')
  page.locator('.tb26-institutional-banner').scroll_into_view_if_needed()
  page.wait_for_function("document.querySelector('.tb26-institutional-banner__art>img').naturalWidth===1719",timeout=7000)
  assert page.locator('.tb26-hero').count()==0
  assert page.locator('.tb26-intro>.tb26-brands').count()==1
  assert page.locator('.tb26-intro>.tb26-benefits').count()==1
  assert page.locator('.tb26-intro>.tb26-institutional-banner').count()==1
  assert page.locator('.tb26-benefits__item').count()==4
  assert page.locator('.tb26-brands__item').count()==8
  expected=3 if width<=767 else 5 if width<=1199 else 8
  brandtrack=page.locator('.tb26-brands__track')
  branddims=brandtrack.evaluate('el=>({client:el.clientWidth,scroll:el.scrollWidth,x:el.firstElementChild.getBoundingClientRect().x,items:[...el.children].map(x=>({x:x.getBoundingClientRect().x,w:x.getBoundingClientRect().width}))})')
  visible=sum(1 for b in branddims['items'] if b['x']<branddims['x']+branddims['client']-0.1)
  assert visible==expected,(name,'marcas visiveis',visible,expected)
  if expected==8: assert page.locator('.tb26-brands__controls').is_hidden()
  assert page.locator('.tb26-institutional-banner__title').inner_text().startswith('NO BRASIL, somos uma')
  assert 'mais de 40 anos' in page.locator('.tb26-institutional-banner__description strong').inner_text()
  dims=page.locator('.tb26-institutional-banner__art').evaluate('el=>({rect:el.getBoundingClientRect().toJSON(),copy:el.querySelector(".tb26-institutional-banner__copy").getBoundingClientRect().toJSON(),titleColor:getComputedStyle(el.querySelector(".tb26-institutional-banner__title")).color, naturalWidth:el.querySelector("img").naturalWidth})')
  x,y,w,h=dims['rect']['x'],dims['rect']['y'],dims['rect']['width'],dims['rect']['height']
  c=dims['copy']
  assert c['x']>=x and c['x']+c['width']<=x+w+1,(name,'overflow x',dims)
  assert c['y']>=y-2 and c['y']+c['height']<=y+h+2,(name,'overflow y',dims)
  assert page.locator('#tb26-home').count()==1
  assert page.locator('.tb26-intro').evaluate('el=>el.scrollWidth<=el.clientWidth+1'),(name,'intro overflow')
  assert not errors,(name,errors)
  page.locator('.tb26-institutional-banner').scroll_into_view_if_needed()
  page.wait_for_timeout(900)
  if name in ['mobile320','mobile390','desktop1440']:
   page.locator('.tb26-intro').screenshot(path=str(root/'tests'/('v17-intro-'+name+'.png')),animations='disabled')
  print(name,'PASS',round(w),round(h),'copy',round(c['width']),round(c['height']),'title',dims['titleColor'])
  page.close()
 # Toggle independently, with source-configured copy
 page=browser.new_page(viewport={'width':390,'height':844})
 page.set_content(fixture)
 page.add_style_tag(content=css)
 override="window.TractorBelSettings={marcas:{ativo:false},beneficios:{ativo:false},institucional:{titulo:'Título personalizado pelo JS',textoAntes:'Texto ',destaque:'destacado',textoDepois:' final'}};"
 page.add_script_tag(content=override)
 page.add_script_tag(content=js.replace("var isHome = /^\\/?(?:index\\.html)?\\/?$/.test(location.pathname);","var isHome = true;"))
 assert page.locator('.tb26-brands').count()==0
 assert page.locator('.tb26-benefits').count()==0
 assert page.locator('.tb26-institutional-banner').count()==1
 assert page.locator('.tb26-institutional-banner__title').inner_text()=='Título personalizado pelo JS'
 assert page.locator('.tb26-institutional-banner__description').inner_text()=='Texto destacado final'
 print('settings toggles and independent copy PASS')
 page.close()
 browser.close()