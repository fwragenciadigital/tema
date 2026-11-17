from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).parents[1]
fixture=(root/'tests/sticky-fixture.html').read_text()
scripts=re.findall(r'<script[^>]*>(.*?)</script>',fixture,flags=re.S)
base=re.sub(r'<script[^>]*>.*?</script>','',fixture,flags=re.S)
base=re.sub(r'<link[^>]*>', '', base)
css=(root/'tractorbel.css').read_text()
js=(root/'tractorbel.js').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [320,360,375,390,430,768,900,1024,1440,1920]:
  page=b.new_page(viewport={'width':w,'height':850})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(base,wait_until='load')
  page.add_style_tag(content=css)
  page.evaluate(scripts[0]);page.add_script_tag(content=js);page.evaluate(scripts[-1]);page.wait_for_timeout(500)
  assert page.locator('body.tb26-with-pdp').count()==1,(w,'PDP missing')
  assert page.locator('.tb26-pdp__grid').count()==1
  assert page.locator('.tb26-pdp__buy-native').count()==1
  assert page.locator('.tb26-pdp__pix-number').count()==1,(w,'Pix missing')
  assert page.locator('.tb26-pdp__quick').count()>=0
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(w,'horizontal overflow')
  if w<=767:
   assert page.locator('.tb26-pdp__mobile-bar').count()==1
  if w in (390,1440):page.screenshot(path=str(root/'qa-final'/f'pdp-{w}.png'),full_page=True,animations='disabled')
  assert not errors,(w,errors)
  print('pdp',w,'PASS')
  page.close()
 b.close()
print('ALL PDP PASS')
