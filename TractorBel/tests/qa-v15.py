from playwright.sync_api import sync_playwright
from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
css=(root/'tractorbel.css').read_text()
js=(root/'tractorbel.js').read_text()
original=(root/'tests'/'qa-v14.py').read_text()
fixture=re.search("fixture='''(.*?)'''",original,re.S).group(1)
fixture=fixture.replace('<body>', '''<body>
<div id="bar-top" style="height:45px;background:#292929;color:#fff">Olá visitante, seja bem vindo!</div>
<div class="barra-inicial" style="height:83px;background:#ffcc00">Tarja original</div>
<div id="full-page-loading" style="height:100px;background:#333">Carregando...</div>
<div class="conteiner-principal">''',1)
fixture=fixture.replace('<div id="cabecalho">','''<div id="cabecalho"><div class="conteiner"><div class="row-fluid"><h1 class="logo cor-secundaria"><a href="https://www.lojatractorbel.com.br/" title="TractorBel"><img src="https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png" alt="Logotipo TractorBel pelo painel" /></a></h1></div></div>''',1)
fixture=fixture.replace('</body></html>','</div></body></html>',1)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,width,height in [('desktop',1480,900),('mobile',390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  page.route('**/logo-panel.png',lambda route:route.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="400" height="96"><rect width="400" height="96" fill="#161616"/><text x="12" y="65" fill="#ffcc00" font-size="45">TRACTORBEL</text></svg>'))
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(fixture.replace('href="/', 'href="https://www.lojatractorbel.com.br/'),wait_until='domcontentloaded')
  page.add_style_tag(content='body{margin:0}'+css)
  page.add_script_tag(content=js)
  page.wait_for_selector('#tb26-header')
  assert page.locator('.tb26-logo img').get_attribute('src')=='https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png'
  assert page.locator('.tb26-logo img').get_attribute('alt')=='Logotipo TractorBel pelo painel'
  assert page.locator('#tb26-header').evaluate('(el)=>el.parentElement===document.body')
  for sel in ['#bar-top','.barra-inicial','#full-page-loading','#cabecalho']:
   assert not page.locator(sel).is_visible(),(name,sel,'must be hidden')
  assert page.locator('#tb26-header').bounding_box()['y'] <= 5,(name,'header not at top',page.locator('#tb26-header').bounding_box())
  print('menu',name,page.locator('.tb26-nav__group').count(),page.locator('.tb26-nav__submenu-link').count(),page.evaluate('window.TractorBel2026.diagnostico()').get('categories')); assert page.locator('.tb26-nav__submenu-link').count()==2
  page.locator('.tb26-cart').click()
  assert 'R$ 369,70' in page.locator('.tb26-cart-drawer__summary').inner_text().replace('\u00a0',' ')
  page.locator('.tb26-cart-drawer__close').click()
  page.evaluate('window.scrollTo(0,780)')
  page.wait_for_timeout(160)
  rect=page.locator('#tb26-header').bounding_box()
  assert rect is not None and 0<=rect['y']<=5,(name,'sticky header',rect)
  assert not errors,errors
  print(name,'PASS panel-logo, hide old banners, top y=0, sticky, nav and cart')
  page.close()
 # Fallback when the native panel has no valid logo; never display a broken <img>.
 page=browser.new_page(viewport={'width':1320,'height':800})
 page.set_content(fixture.replace('href="/', 'href="https://www.lojatractorbel.com.br/').replace('<img src="https://cdn.awsli.com.br/400x300/901/901888/logo/logo-panel.png" alt="Logotipo TractorBel pelo painel" />',''),wait_until='domcontentloaded')
 page.add_style_tag(content='body{margin:0}'+css);page.add_script_tag(content=js)
 assert page.locator('.tb26-logo__fallback').inner_text()=='TRACTORBEL'
 assert page.locator('.tb26-logo img').count()==0
 print('fallback PASS no broken logo image')
 page.close();browser.close()