from pathlib import Path
from playwright.sync_api import sync_playwright
import html, json

root=Path(__file__).resolve().parents[1]
js=(root/'tractorbel.js').read_text()
css=(root/'tractorbel.css').read_text()
assert 'mountCatalog()' in js and "var VERSION = '1.11.0'" in js
assert 'tb26-catalog' in css

colors=['#e5b622','#e6bd30','#c5a22c','#e55962','#e86b79','#cbb351','#dda62c','#d77737']
products=[
  ('BORDAS DE SEGMENTOS – 1359296','R$ 380,00','R$ 368,60'),
  ('CANTO 5/8 SF PARA 120G / 112H / 135H – 8E5531','R$ 100,00','R$ 97,00'),
  ('Roda Motriz 320 - 8E9805','R$ 1.038,12','R$ 1.006,98'),
  ('LÂMINA BICO DE PATO ESPECIAL ULTRA RESISTENTE VERMELHA - 3050 MM','R$ 6.000,00','R$ 5.820,00'),
  ('LÂMINA BICO DE PATO ESPECIAL ULTRA RESISTENTE VERMELHA - 2500 MM','R$ 3.800,00','R$ 3.686,00'),
  ('CANTO LATERAL CONCHA','R$ 149,00','R$ 143,00'),
  ('ROLAMENTO PESADO','R$ 845,00','R$ 819,65'),
  ('LÂMINA HELICOIDAL 3/4','R$ 1.120,00','R$ 1.086,40'),
]

def product(i):
 name,price,pix=products[i%len(products)]
 color=colors[i%len(colors)]
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f6f6f6"/><path d="M60 210 L278 130 L337 195 L120 280 Z" fill="{color}" stroke="#7f6659" stroke-width="4"/><path d="M60 210 L120 280 L120 307 L60 237 Z" fill="#8b6d32" opacity=".7"/></svg>'''
 import base64
 img='data:image/svg+xml;base64,'+base64.b64encode(svg.encode()).decode()
 url=f'https://www.lojatractorbel.com.br/produto-{i}'
 return f'''<li class="span3" style="float:left;width:25%;"><div class="listagem-item" data-id="{i+1}">
 <a href="{url}" class="produto-sobrepor" title="{html.escape(name)}"></a>
 <div class="imagem-produto"><img src="{img}" class="imagem-principal" alt="{html.escape(name)}"></div>
 <div class="info-produto"><a href="{url}" class="nome-produto cor-secundaria">{html.escape(name)}</a>
 <div class="produto-sku hide">SKU-{i}</div><div class="hide trustvox-stars"></div>
 <div><div class="preco-produto destaque-preco"><div><strong class="preco-promocional cor-principal titulo">{price}</strong></div>
 <span class="desconto-a-vista">ou <strong class="cor-secundaria">{pix}</strong> via Pix</span></div></div></div>
 <div class="acoes-produto hidden-phone"><a href="{url}" class="botao botao-comprar principal"><i class="icon-search"></i>Ver mais</a></div>
 <div class="acoes-produto-responsiva visible-phone"><a href="{url}" class="tag-comprar">Ver mais</a></div>
 </div></li>'''

def fixture(kind):
 listing=''.join(f'<li class="listagem-linha"><ul>{"".join(product(i) for i in range(start,min(start+4,8)))}</ul></li>' for start in range(0,8,4))
 return f'''<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body class="pagina-{kind} tema-transparente"><div id="corpo"><div class="conteiner"><div class="secao-principal row-fluid"><div class="coluna span3" style="width:18%;float:left">Filtros</div><div class="conteudo span9" style="width:80%;float:right"><h1>Peças Novas</h1><div id="listagemProdutos" class="listagem borda-alpha"><ul data-produtos-linha="4">{listing}</ul></div><div id="paginacao">1 2 3</div></div></div></div></div></body></html>'''

with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 all_results=[]
 for kind in ['categoria','busca']:
  page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errs=[]
  page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(fixture(kind))
  page.add_style_tag(content='''*{box-sizing:border-box}body{margin:0;font-family:Arial;background:#292929;color:white}#corpo>.conteiner{max-width:1800px;margin:auto;padding:25px 18px}.secao-principal:after{content:'';display:block;clear:both}.listagem-item{position:relative;background:white;color:#292929}.listagem .listagem-linha{margin:0}.acoes-produto{height:45px}.imagem-produto img{max-width:100%}.hidden-phone{display:block}.visible-phone{display:none}@media(max-width:767px){.hidden-phone{display:none!important}.visible-phone{display:block!important}.coluna{display:none!important}.conteudo{float:none!important;width:100%!important}}''')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  page.wait_for_selector('body.tb26-with-catalog')
  assert page.locator('#listagemProdutos .tb26-catalog-card').count()==8
  assert page.locator('#listagemProdutos .acoes-produto > a.tb26-catalog__cta').count()==8
  assert page.locator('#listagemProdutos .preco-promocional').first.inner_text()=='R$ 380,00'
  assert page.locator('#listagemProdutos .desconto-a-vista').nth(3).inner_text()=='ou R$ 5.820,00 via Pix'
  assert page.locator('#paginacao').count()==1
  assert page.locator('#listagemProdutos .tb26-catalog-card a.nome-produto').nth(3).get_attribute('href')=='https://www.lojatractorbel.com.br/produto-3'
  for width,expectedCols in [(1920,5),(1440,4),(1200,4),(1024,3),(900,3),(768,2),(390,2),(375,2),(320,1)]:
   page.set_viewport_size({'width':width,'height':950})
   page.wait_for_timeout(110)
   computed=page.locator('#listagemProdutos > ul').evaluate('(el)=>({d:getComputedStyle(el).display,cols:getComputedStyle(el).gridTemplateColumns.split(" ").length,w:el.getBoundingClientRect().width})')
   doc=page.evaluate('({scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,w:innerWidth})')
   assert computed['d']=='grid',(kind,width,computed)
   assert computed['cols']==expectedCols,(kind,width,computed)
   assert doc['scroll']<=width+1,(kind,width,doc)
   row=page.locator('#listagemProdutos .tb26-catalog-card').first.bounding_box()
   assert row and row['width']>115,(kind,width,row)
   link=page.locator('#listagemProdutos .tb26-catalog__cta').first
   assert link.is_visible(),(kind,width,'CTA invisible')
   assert link.inner_text()=='VER PRODUTO',(kind,width,'Wrong CTA')
   assert link.get_attribute('href')=='https://www.lojatractorbel.com.br/produto-0'
   all_results.append((kind,width,expectedCols,round(row['width'])))
   if kind=='categoria' and width in [1920,390,320]:
    page.screenshot(path=str(root/'tests'/f'catalogo-{width}.png'),full_page=True,animations='disabled')
  # DOM dynamically inserted by a search filter or pagination: current data remains and item is styled.
  page.locator('#listagemProdutos > ul > li.listagem-linha:last-child > ul').evaluate('(node)=>node.insertAdjacentHTML("beforeend", window.__newCard)', ) if False else None
  page.evaluate('(value)=>{window.__newCard=value}',product(8))
  page.evaluate('()=>{document.querySelector("#listagemProdutos > ul > li.listagem-linha:last-child > ul").insertAdjacentHTML("beforeend",window.__newCard)}')
  page.wait_for_selector('#listagemProdutos .tb26-catalog-card:nth-child(99)',state='attached',timeout=100) if False else None
  page.wait_for_function('document.querySelectorAll("#listagemProdutos .tb26-catalog-card").length===9')
  assert page.locator('#listagemProdutos .tb26-catalog__cta').count()==9
  assert not errs,(kind,errs)
  page.close()
 print('PASS',json.dumps(all_results,ensure_ascii=False))
 browser.close()