from pathlib import Path
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import threading,base64
root=Path(__file__).parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/qa-final/home-fixture.html'
pixel=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==')
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [320,360,375,390,430,768,900,1024,1440,1920]:
  page=b.new_page(viewport={'width':width,'height':870})
  page.route('**/cdn.awsli.com.br/**',lambda route:route.fulfill(status=404,body='not found') if any(v in route.request.url for v in ['Novo%20Projeto','novo-projeto','fullbanner.jpg','logo-top.png']) else route.fulfill(status=200,content_type='image/png',body=pixel))
  page.route('**/tractorbel-2026.vercel.app/assets/**',lambda route:route.fulfill(status=200,content_type='image/png',body=pixel))
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  html=(root/'qa-final'/'home-fixture.html').read_text().replace('<script src="../tractorbel.js"></script>','').replace('<link rel="stylesheet" href="../tractorbel.css">','')
  import re
  html=re.sub(r'href="/(.*?)"',lambda m:'href="https://www.lojatractorbel.com.br/'+m.group(1)+'"',html)
  html=html.replace('src="data:image/svg+xml,%3Csvg', 'src="https://tractorbel-2026.vercel.app/assets/logo-top.webp" data-unused="%3Csvg') if False else html
  html=re.sub(r'<img src="data:image/svg\+xml[^"]*" alt="TractorBel"','<img src="https://tractorbel-2026.vercel.app/assets/logo-top.webp" alt="TractorBel"',html,count=1)
  page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=(root/'tractorbel.css').read_text())
  script=(root/'tractorbel.js').read_text().replace("var isHome = /^\/?(?:index\.html)?\/?$/.test(location.pathname);",'var isHome = true;')
  page.add_script_tag(content=script);page.wait_for_timeout(500)
  assert page.locator('body.tb26-with-home').count()==1,(width,'home missing')
  assert page.locator('#tb26-header').count()==1 and page.locator('.tb26-footer').count()==1,(width,'header/footer missing')
  assert page.locator('.tb26-brands__item').count()==8
  if width<=767:
   ratio=page.locator('.tb26-brands__item').first.evaluate('el=>el.getBoundingClientRect().width / el.closest(".tb26-brands__track").getBoundingClientRect().width')
   assert 0.28 < ratio < 0.37,(width,ratio)
  assert page.locator('.tb26-institutional-banner__title').count()==1
  assert page.locator('.tb26-nav__submenu-link').count()==2
  assert page.locator('.tb26-footer a[href="/pagina/frete-e-entrega.html"]').count()==0
  if width<=767:
   page.locator('.tb26-mobile-toggle').click()
   assert page.locator('.tb26-header.tb26-menu-open').count()==1
   page.locator('.tb26-nav__toggle').first.click()
   assert page.locator('.tb26-nav__group.is-expanded').count()==1
   page.keyboard.press('Escape')
   assert page.locator('.tb26-header.tb26-menu-open').count()==0
  # Subnav available, no horizontal document overflow
  v=page.evaluate('''() => ({scroll:document.documentElement.scrollWidth,viewport:innerWidth,brands:document.querySelector('.tb26-brands__track')?.clientWidth,footer:[...document.querySelectorAll('.tb26-footer a')].map(a=>a.getAttribute('href')),bodyBg:document.body.style.getPropertyValue('--tb26-bg-company')})''')
  assert v['scroll']<=width+1,(width,v)
  assert not errors,(width,errors)
  if width in (390,1440):page.screenshot(path=str(root/'qa-final'/f'home-{width}.png'),full_page=True,animations='disabled')
  print('home',width,'PASS',v['bodyBg'][-90:])
  page.close()
 b.close()
server.shutdown()
print('ALL HOME PASS')
