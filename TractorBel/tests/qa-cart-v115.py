from pathlib import Path
import threading
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
base=Path(__file__).parent
server=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=str(base.parent)));threading.Thread(target=server.serve_forever,daemon=True).start()
urls=[base/'cart-fixture-v115.html',base/'cart-empty-fixture-v115.html']
styles=(base.parent/'tractorbel.css').read_text()
script=(base.parent/'tractorbel.js').read_text()
def setup(page,fixture):
 html=fixture.read_text().replace('<link rel="stylesheet" href="../tractorbel.css">','').replace('<script src="../tractorbel.js"></script>','')
 page.set_content(html,wait_until='load')
 page.add_style_tag(content=styles)
 page.add_script_tag(content=script)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path="/usr/bin/chromium",args=['--no-sandbox'])
 for width in (320,360,390,430,768,900,1024,1440,1920):
  page=browser.new_page(viewport={'width':width,'height':870})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  setup(page,urls[0]);page.wait_for_timeout(250)
  vals=page.evaluate('''() => { const row=document.querySelector('.tb26-cart__item'), checkout=document.querySelector('.tb26-cart__checkout');return {doc:document.documentElement.scrollWidth,win:innerWidth,grid:row&&getComputedStyle(row).gridTemplateColumns,items:document.querySelectorAll('.tb26-cart__item').length,total:document.querySelector('.tb26-cart__summary-total-value')?.textContent, pix:document.querySelector('.tb26-cart__summary-pix-value')?.textContent,checkout:(checkout&&getComputedStyle(checkout).display),button:document.querySelector('.tb26-cart__finish')?.textContent.trim()}}''')
  assert vals['doc'] <= width+1,(width,vals)
  assert vals['items']==1 and vals['total']=='R$ 6.000,00' and vals['pix']=='R$ 5.820,00', (width,vals)
  assert not errors,(width,errors)
  seal=page.locator('.tb26-cart__seal-holder .selo-ssl')
  assert seal.count()==1,(width,'Selo nativo ausente no fluxo do checkout')
  assert page.evaluate("""() => {
    const seal=document.querySelector('.tb26-cart__seal-holder .selo-ssl');
    const finish=document.querySelector('.tb26-cart__finish');
    const keep=document.querySelector('.tb26-cart__continue');
    const checkout=document.querySelector('.tb26-cart__checkout');
    if (!seal || !finish || !keep || !checkout || !checkout.contains(seal)) return false;
    const rect=seal.getBoundingClientRect();
    return !seal.closest('.tb26-cart__actions') &&
      getComputedStyle(seal).position === 'static' &&
      rect.top >= Math.max(finish.getBoundingClientRect().bottom,keep.getBoundingClientRect().bottom)-1;
  }"""),(width,'Selo sobreposto aos botoes')
  if width in (320,390,768,1440): page.screenshot(path=str(base/f'cart-v115-{width}.png'),full_page=True)
  if width==390:
   page.locator('.tb26-cart__finish').click();assert page.evaluate('window.__lastForm')=='/checkout/redirect/'
   page.locator('#btn-frete').click();assert page.evaluate('window.__lastForm')=='formCalcularFrete'
   page.locator('#btn-cupom').click();assert page.evaluate('window.__lastForm')=='/carrinho/cupom/validar'
   page.locator('.quantidade .icon-plus').click();assert page.evaluate('window.__lastLink')=='/quantidade/mais'
   page.locator('.excluir .icon-trash').click();assert page.evaluate('window.__lastLink')=='/carrinho/produto/398845017/remover'
   page.locator('.valor-total').evaluate("el => el.textContent='R$ 12.000,00'")
   page.locator('.descontos.avista strong').first.evaluate("el=>el.textContent='R$ 11.640,00'")
   page.wait_for_timeout(150)
   assert page.locator('.tb26-cart__summary-total-value').text_content()=='R$ 12.000,00'
   assert page.locator('.tb26-cart__summary-pix-value').text_content()=='R$ 11.640,00'
  print('filled:',width,vals)
  page.close()
 for width in (320,390,768,1440):
  page=browser.new_page(viewport={'width':width,'height':800});setup(page,urls[1]);page.wait_for_timeout(100)
  assert page.locator('.tb26-cart-empty').count()==1
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  if width==390:page.screenshot(path=str(base/'cart-empty-v115-390.png'),full_page=True)
  print('empty:',width,'ok');page.close()
 browser.close()
print('ALL QA PASS')
