from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).resolve().parent.parent
js=(root/'tractorbel.js').read_text(); css=(root/'tractorbel.css').read_text()
fixture=re.search("fixture='''(.*?)'''",(root/'tests/qa-v14.py').read_text(),re.S).group(1)
fixture=fixture.replace('href="/','href="https://www.lojatractorbel.com.br/')
fixture=fixture.replace('<div id="cabecalho">','''<div id="cabecalho"><div class="conteiner"><div class="row-fluid"><h1 class="logo cor-secundaria"><a href="https://www.lojatractorbel.com.br/"><img src="https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png" alt="Logo oficial TractorBel" /></a></h1></div></div>''',1)
fixture=fixture.replace('<body>','''<body><div id="bar-top" style="height:50px">Barra antiga</div><div class="barra-inicial" style="height:90px">Boas-vindas</div>''',1)
fixture=fixture.replace('<div id="corpo" style="min-height:2200px">','<div id="corpo" style="min-height:2200px">',1)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for label,w,h,count in [('mobile_small',320,700,3),('mobile',390,844,3),('mobile_large',767,900,3),('tablet',900,900,5),('desktop',1480,900,6)]:
  page=browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1)
  errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('https://www.lojatractorbel.com.br/**',lambda route:route.fulfill(status=200,content_type='text/html',body=fixture) if route.request.is_navigation_request and route.request.is_navigation_request() else route.abort())
  page.route('**/logo-panel.png',lambda route:route.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="96"><rect width="400" height="96" fill="#181818"/><text x="7" y="60" fill="#ffc500" font-size="42">TRACTORBEL</text></svg>'))
  page.route('https://tractorbel-2026.vercel.app/assets/marcas/*',lambda route:route.fulfill(status=200,content_type='image/png',body=(root/'assets/marcas'/route.request.url.split('/')[-1]).read_bytes()))
  page.set_content(fixture,wait_until='domcontentloaded')
  page.add_style_tag(content=css);page.add_script_tag(content=js.replace("var isHome = /^\\/?(?:index\\.html)?\\/?$/.test(location.pathname);","var isHome = true;"))
  page.wait_for_selector('.tb26-brands__item')
  page.wait_for_timeout(250)
  assert page.locator('.tb26-brands__item').count()==8
  assert page.locator('.tb26-brands__item img').count()==8
  page.locator('.tb26-brands__item img').evaluate_all("xs=>xs.forEach(x=>x.loading='eager')")
  page.wait_for_function("[...document.querySelectorAll('.tb26-brands__item img')].every(x=>x.complete && x.naturalWidth===160)",timeout=6000)
  track=page.locator('.tb26-brands__track')
  dims=track.evaluate('e=>({client:e.clientWidth,scroll:e.scrollWidth,scrollLeft:e.scrollLeft,children:[...e.children].map(i=>({x:i.getBoundingClientRect().x,w:i.getBoundingClientRect().width}))})')
  visible=sum(1 for i in dims['children'] if i['x'] < (dims['children'][0]['x']+dims['client']-0.1))
  assert visible==count,(label,visible,count,dims)
  assert dims['scroll']>dims['client'],(label,dims)
  page.locator('.tb26-brands__arrow').nth(1).click()
  page.wait_for_timeout(550)
  scrolled=track.evaluate('(el)=>el.scrollLeft')
  assert scrolled>100,(label,'buttons failed',scrolled)
  if count==3:
   single=dims['children'][0]['w']
   assert abs(scrolled-3*(single+8))<5 or abs(scrolled-(dims['scroll']-dims['client']))<5,('3 per scroll',label,scrolled,single)
  page.locator('.tb26-brands__arrow').nth(0).click();page.wait_for_timeout(450)
  assert track.evaluate('(el)=>el.scrollLeft')<5,('back button',label)
  assert page.locator('.tb26-logo img').get_attribute('alt')=='Logo oficial TractorBel'
  assert not page.locator('#bar-top').is_visible()
  assert not page.locator('.barra-inicial').is_visible()
  assert not errors,errors
  if label in ('mobile','desktop'):
   page.screenshot(path=str(root/'tests'/('v16-brands-'+label+'.png')),full_page=False)
  print(label,'PASS',count,'visible, 8 cropped logos, buttons, sticky header, panel logo, cleanup')
  page.close()
 browser.close()