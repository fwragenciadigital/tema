from pathlib import Path
from playwright.sync_api import sync_playwright
import json

base = Path(__file__).resolve().parents[1]
css = (base/'tractorbel.css').read_text()
js = (base/'tractorbel.js').read_text()
# Exact native structural classes taken from the live product HTML.
fixture='''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body class="pagina-produto produto-398845017 tema-transparente">
<div class="barra-inicial">FAIXA ANTERIOR DO TEMA</div>
<div class="conteiner-principal"><div id="cabecalho"><div class="conteiner"><h1 class="logo"><a href="/"><img alt="TractorBel" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='96'%3E%3Crect width='400' height='96' fill='%23222'/%3E%3Ctext x='20' y='62' font-size='42' fill='white'%3ETRACTORBEL%3C/text%3E%3C/svg%3E"></a></h1></div></div>
<div id="corpo"><div class="conteiner"><div class="secao-principal row-fluid sem-coluna"><div class="span12 produto"><div class="row-fluid">
<div class="span6"><div class="conteiner-imagem"><div><a id="abreZoom" href="https://cdn.awsli.com.br/2500x2500/901/901888/produto/398845017/foto.png" data-ignore="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'%3E%3Crect width='1000' height='1000' fill='%23ddd'/%3E%3C/svg%3E" style="display:none">zoom</a><img id="imagemProduto" alt="Lâmina Bico de Pato Vermelha" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='800' height='800' fill='%23f3f3f3'/%3E%3Cpath d='M150 500 Q350 340 660 400 L610 480 Q300 430 150 520' fill='%23d42f2f' stroke='%239d2525' stroke-width='9'/%3E%3C/svg%3E"></div></div><div class="produto-thumbs thumbs-horizontal hide"><div class="flexslider"><ul class="miniaturas slides"><li><a href="javascript:;" data-imagem-grande="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900'%3E%3Crect width='900' height='900' fill='white'/%3E%3C/svg%3E"><img alt="Foto 1" data-mediumimg="" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23eee'/%3E%3C/svg%3E"></a></li></ul></div></div><div class="produto-compartilhar">Compartilhar</div></div>
<div class="span6"><div class="principal"><div class="info-principal-produto"><div class="breadcrumbs borda-alpha"><ul><li><a href="/">Início</a></li><li><a href="/pecas-novas">Peças Novas</a></li></ul></div><h1 class="nome-produto titulo cor-secundaria">LÂMINA BICO DE PATO ESPECIAL ULTRA RESISTENTE VERMELHA - 3050 MM</h1><div class="codigo-produto"><span class="cor-secundaria"><b>Código: </b> <span>BICODEPATO3050</span></span></div></div>
<div class="acoes-produto disponivel" data-produto-id="398845017"><div><div class="preco-produto destaque-preco com-promocao"><div><s class="preco-venda titulo">R$ 6.500,00</s><strong class="preco-promocional cor-principal titulo" data-sell-price="6000.00">R$ 6.000,00</strong></div><span class="desconto-a-vista">ou <strong>R$ 5.820,00</strong> via Pix</span></div></div><div class="comprar"><a class="botao botao-comprar principal grande" href="/carrinho/produto/398845017/adicionar">Comprar</a><span class="cor-secundaria disponibilidade-produto">Estoque: <b>Disponível</b></span></div></div>
<div class="parcelas-produto borda-alpha padrao" data-produto-id="398845017"><ul class="accordion" id="formas-pagamento-lista-398845017"><li><div class="accordion-heading"><span class="accordion-toggle"><b class="text-parcelas pull-right cor-principal">R$ 5.940,00</b><img alt="PagBank" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='20'%3E%3Ctext x='2' y='16' font-size='12'%3EPagBank%3C/text%3E%3C/svg%3E"></span></div></li><li><div class="accordion-heading"><span class="accordion-toggle"><b>R$ 5.820,00</b><img alt="Pix" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='20'%3E%3Ctext x='2' y='16' font-size='12'%3EPix%3C/text%3E%3C/svg%3E"></span></div></li></ul><div class="cep"><form id="formCalcularCep"><label for="cep">Calcular frete e prazo</label><input type="text" name="cep" id="cep" placeholder="Digite seu CEP"><button type="submit">Calcular</button></form></div></div></div></div>
</div><div class="abas-custom"><div class="tab-content"><div class="tab-pane active" id="descricao"><h2>Descrição</h2><p><span style="font-size:11px">Peça nova e pronta para a sua operação.</span></p></div></div></div></div></div></div>
<div id="rodape">Rodapé original da plataforma</div></div><script>window.__buyClicks=0;document.querySelector('.botao-comprar').addEventListener('click',function(ev){window.__buyClicks++;ev.preventDefault()});</script></body></html>'''

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [320,390,768,1024,1440,1920]:
  page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda er:errors.append(str(er)))
  page.set_content(fixture,wait_until='domcontentloaded')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  page.wait_for_selector('.tb26-with-pdp')
  assert page.locator('.tb26-pdp__grid > .span6').count()==2
  assert page.locator('.tb26-pdp__breadcrumbs a').count()==2
  assert page.locator('#imagemProduto').count()==1
  assert page.locator('.botao-comprar').count()==1
  assert page.locator('form#formCalcularCep').count()==1
  assert page.locator('.tb26-pdp__payment-toggle').count()==1
  assert page.locator('#formas-pagamento-lista-398845017').count()==1
  assert page.locator('#formas-pagamento-lista-398845017').is_hidden()
  page.get_by_role('button',name='Ver formas de pagamento').click()
  assert page.locator('#formas-pagamento-lista-398845017').is_visible()
  assert page.locator('form#formCalcularCep').is_visible()
  page.get_by_role('button',name='Ocultar formas de pagamento').click()
  assert page.locator('#formas-pagamento-lista-398845017').is_hidden()
  page.get_by_role('button',name='Ampliar imagem do produto').click()
  assert page.locator('.tb26-pdp__lightbox').is_visible()
  page.keyboard.press('Escape')
  assert page.locator('.tb26-pdp__lightbox').count()==0
  documentWidth=page.evaluate('document.documentElement.scrollWidth')
  assert documentWidth <=width+1,(width,'overflow',documentWidth)
  rects=page.locator('.tb26-pdp__grid > .span6').evaluate_all('(els)=>els.map(e=>e.getBoundingClientRect().toJSON())')
  if width>767: assert rects[0]['x']<rects[1]['x'],(width,rects)
  else: assert rects[0]['bottom']<=rects[1]['top']+1,(width,rects)
  assert not errors,(width,errors)
  if width<=767:
   assert page.locator('.tb26-pdp__mobile-bar').count()==1
   page.evaluate("document.querySelector('#descricao').style.minHeight='1400px'");page.evaluate('window.scrollTo(0, document.body.scrollHeight)');page.wait_for_timeout(300)
   page.locator('.tb26-pdp__mobile-cta').click()
   assert page.evaluate('window.__buyClicks')==1,(width,'buy',page.evaluate('window.__buyClicks'))
   if width in (320,390):page.screenshot(path=str(base/'tests'/f'pdp-mobile-{width}.png'),full_page=True,animations='disabled')
  elif width==1440:page.screenshot(path=str(base/'tests'/'pdp-desktop-1440.png'),full_page=True,animations='disabled')
  print('PASS',width,'pageW',documentWidth,'mediaW',round(rects[0]['width']),'detailsW',round(rects[1]['width']))
  page.close()
 browser.close()