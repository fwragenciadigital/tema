from pathlib import Path
from playwright.sync_api import sync_playwright
import threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import functools
import re
root=Path(__file__).resolve().parents[1]
fixture=root/'tests'/'sticky-fixture.html'
fixture.write_text('''<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="../tractorbel.css"><style>body{font-family:Arial;margin:0}#corpo{min-height:2600px;background:#f8f8f8;padding:10px 2vw}.conteiner{max-width:1240px;margin:auto}.span6{width:48%;float:left}.row-fluid:after{content:"";display:block;clear:both}.produto .principal{background:#fff;padding:20px}.info-principal-produto{padding:10px}#imagemProduto{width:80%;height:460px;object-fit:contain}.produto .acoes-produto{padding:30px}.box{min-height:800px}#mock-btn{display:block;padding:10px 30px;background:#ffc000}</style><body class="pagina-produto"><div id="corpo"><div class="conteiner"><div class="secao-principal"><div class="produto"><div class="row-fluid"><div class="span6"><div class="conteiner-imagem"><img id="imagemProduto" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Crect width='250' height='250' fill='%23eccc21'/%3E%3Cpath d='M20 220L230 30' stroke='%23d03' stroke-width='25'/%3E%3C/svg%3E"></div></div><div class="span6"><div class="principal"><div class="info-principal-produto"><h1 class="nome-produto">LÂMINA BICO DE PATO ESPECIAL ULTRA RESISTENTE VERMELHA - 3050 MM</h1></div><div class="acoes-produto"><div class="preco-produto"><div><s class="preco-venda">R$ 6.500,00</s><strong class="preco-promocional">R$ 6.000,00</strong></div><span class="desconto-a-vista">ou <strong>R$ 5.820,00</strong> via Pix</span></div><div class="comprar"><a id="mock-btn" href="/carrinho/produto/398845017/adicionar" class="botao-comprar">Comprar</a></div></div></div></div></div><div id="descricao" style="height:1600px"></div></div></div></div><script>window.TractorBelSettings={topo:{ativo:false},rodape:{ativo:false},catalogo:{ativo:false},home:{ativo:false},produto:{ativo:true,compraFixaMobile:true,resumoFixo:true},geral:{publicarNaLoja:true}};</script><script src="../tractorbel.js"></script><script>setTimeout(function(){var bar=document.createElement('div');bar.id='resumo-produto';bar.className='hidden-phone hidden-tablet';bar.innerHTML='<div class="conteiner"><div class="produto-flutuante"><div class="acoes-produto"><div class="abriga-precos"><div class="preco-produto"><div><s class="preco-venda">R$ 6.500,00</s><strong class="preco-promocional">R$ 6.000,00</strong></div><span class="desconto-a-vista">ou <strong>R$ 5.820,00</strong> via Pix</span></div></div><div class="comprar"><a class="botao botao-comprar principal grande" href="/carrinho/produto/398845017/adicionar"><i class="icon-shopping-cart">◼</i> Comprar</a><span class="disponibilidade-produto">Disponível</span></div></div></div></div>';bar.style.bottom='-100px';document.querySelector('#corpo').appendChild(bar);},250)</script></body></html>''')
server=ThreadingHTTPServer(("127.0.0.1",8877),functools.partial(SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [1440,1024,900,768,390,320]:
  page=browser.new_page(viewport={'width':width,'height':850},device_scale_factor=1)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  html=fixture.read_text()
  scripts=re.findall(r'<script[^>]*>(.*?)</script>',html,flags=re.S)
  html=re.sub(r'<script[^>]*>.*?</script>','',html,flags=re.S)
  html=re.sub(r'<link[^>]*>', '', html)
  page.set_content(html,wait_until='load')
  page.add_style_tag(content=(root/'tractorbel.css').read_text())
  page.evaluate(scripts[0])
  page.add_script_tag(content=(root/'tractorbel.js').read_text())
  page.evaluate(scripts[-1])
  page.wait_for_timeout(650)
  page.evaluate('window.scrollTo(0,900)')
  page.wait_for_timeout(600)
  info=page.evaluate('''() => {
    const bar=document.querySelector('#resumo-produto'),mobile=document.querySelector('.tb26-pdp__mobile-bar');
    const r=bar&&bar.getBoundingClientRect(),m=mobile&&mobile.getBoundingClientRect();
    return {native:!!bar, enhanced:!!bar?.classList.contains('tb26-resumo-enhanced'),visible:!!bar?.classList.contains('tb26-resumo--visible'), nativeDisplay:bar&&getComputedStyle(bar).display,nativeTransform:bar&&getComputedStyle(bar).transform, mobile:!!mobile,mobileDisplay:mobile&&getComputedStyle(mobile).display, mobileVisible:mobile&&getComputedStyle(mobile).visibility, image:!!bar?.querySelector('.tb26-resumo__thumb img'),name:bar?.querySelector('.tb26-resumo__name')?.textContent, pix:bar?.querySelector('.desconto-a-vista strong')?.textContent, href:bar?.querySelector('a.botao-comprar')?.getAttribute('href'),overflow:document.documentElement.scrollWidth>innerWidth,barTop:r?.top,barHeight:r?.height}}
  ''')
  print(width,info,'errors',errors[:2])
  if width in (1440,390,320): page.screenshot(path=str(root/'tests'/f'resumo-v114-{width}.png'))
  if width>=768:
   assert info['enhanced'] and info['visible'] and info['nativeDisplay']!='none' and info['image'] and info['pix']=='R$ 5.820,00'
   assert info['barTop']>650 and info['barHeight']<160
  else:
   assert info['mobile'] and info['nativeDisplay']=='none'
  assert not info['overflow'] and not errors
  page.close()
 browser.close()
print('QA PASSED')