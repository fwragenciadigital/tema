from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path(__file__).resolve().parent.parent
css=(root/'tractorbel.css').read_text();js=(root/'tractorbel.js').read_text()
fixture='''<!doctype html><html lang="pt-br"><head><base href="https://www.lojatractorbel.com.br/"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<div id="cabecalho">
  <div class="carrinho"><span class="qtd-carrinho">3</span>
   <div class="carrinho-interno-ajax"><div class="carrinho-interno"><ul>
     <li><a href="/filtro-123"><img src="/fake-1.png"></a><a class="nome-produto" href="/filtro-123">Filtro para CAT</a><span class="quantidade">2</span><div class="preco-produto">R$ 159,90</div></li>
     <li><a href="/pino-abc"><img src="/fake-2.png"></a><a class="nome-produto" href="/pino-abc">Pino de acoplamento</a><span class="quantidade">1</span><div class="preco-produto">R$ 49,90</div></li>
    </ul><div class="carrinho-rodape"><span class="carrino-total">Total: <strong>R$ 369,70</strong></span><span class="parcelamento">Até 3x de R$ 123,23 sem juros</span></div></div></div>
   <div class="minicart-placeholder" style="display:none"><div class="carrinho-interno"><li class="minicart-item-modelo"><a>--PRODUTO_NOME--</a><strong>R$ --PRODUTO_PRECO_POR--</strong></li></div></div>
  </div>
  <div class="menu superior"><ul class="nivel-um">
   <li class="com-filho"><a href="/pecas-novas" title="PEÇAS NOVAS"><strong>PEÇAS NOVAS</strong></a><ul class="nivel-dois"><li><a href="/filtros">Filtros</a></li><li><a href="/acoplamento">Acoplamento</a></li></ul></li>
   <li><a href="/pecas-seminovas"><strong>PEÇAS SEMINOVAS</strong></a></li>
   <li><a href="/fps"><strong>FPS</strong></a></li>
  </ul></div>
</div><div id="corpo" style="min-height:2200px"><p>Conteúdo nativo</p></div><div id="rodape"></div></body></html>'''
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for label,w,h in [('desktop',1480,900),('mobile',390,844)]:
  page=b.new_page(viewport={'width':w,'height':h})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(fixture.replace('href="/', 'href="https://www.lojatractorbel.com.br/'),wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  page.wait_for_selector('#tb26-header')
  assert page.locator('.tb26-nav__group').count()==3,'not native menu'
  assert page.locator('.tb26-nav__submenu-link').count()==2,'submenu missing'
  assert page.locator('.tb26-nav__group').nth(2).locator('.tb26-nav__link').inner_text()=='FERRAMENTAS DE PENETRAÇÃO DE SOLO'
  if label=='desktop':
   page.locator('.tb26-nav__group').first.hover()
   assert page.locator('.tb26-nav__group').first.locator('.tb26-nav__submenu').is_visible()
  else:
   page.locator('.tb26-mobile-toggle').click()
   assert page.locator('.tb26-nav').is_visible()
   page.locator('.tb26-nav__toggle').first.click()
   assert page.locator('.tb26-nav__group').first.locator('.tb26-nav__submenu').is_visible()
   page.keyboard.press('Escape')
   assert not page.locator('.tb26-nav').is_visible()
  page.locator('.tb26-cart').click()
  assert page.locator('.tb26-cart-drawer__item').count()==2
  assert 'R$ 369,70' in page.locator('.tb26-cart-drawer__summary').inner_text().replace('\u00a0',' ')
  assert '3x de R$ 123,23 sem juros' in page.locator('.tb26-cart-drawer__installments').inner_text()
  page.locator('.tb26-cart-drawer__close').click()
  page.evaluate('window.scrollTo(0,800)')
  page.wait_for_timeout(120)
  rect=page.locator('#tb26-header').bounding_box()
  assert rect is not None and 0<=rect['y']<8,('header not sticky',label,rect)
  assert page.locator('#tb26-header').evaluate('(el)=>el.classList.contains("is-scrolled")')
  # missing native total: fallback uses real per-item prices and quantity, not made-up product data
  page.evaluate('document.querySelector(".carrino-total").remove();document.querySelector(".parcelamento").remove()')
  page.locator('.tb26-cart').click()
  assert 'Subtotal estimado' in page.locator('.tb26-cart-drawer__summary').inner_text()
  assert 'R$ 369,70' in page.locator('.tb26-cart-drawer__summary').inner_text().replace('\u00a0',' ')
  assert 'Confira as opções de parcelamento' in page.locator('.tb26-cart-drawer__installments').inner_text()
  page.wait_for_timeout(350)
  assert page.locator('.tb26-cart-drawer__item').count()==2,'fallback fetch must not erase valid mini cart data'
  page.screenshot(path=str(root/'tests'/('v14-'+label+'.png')),full_page=False)
  assert not errors, errors
  print(label,'PASS','native-menu','submenu','sticky','cart-total','installments','fallback','no-js-error')
  page.close()
 b.close()