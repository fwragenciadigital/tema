from pathlib import Path
from playwright.sync_api import sync_playwright
import re, ast, json
base=Path(__file__).resolve().parents[1]
css=(base/'tractorbel.css').read_text(encoding='utf8')
js=(base/'tractorbel.js').read_text(encoding='utf8')
source=(base/'tests/qa-pdp-v18.py').read_text(encoding='utf8')
match=re.search(r"fixture=(\'\'\'.*?\'\'\')\n\nwith sync_playwright",source,re.S)
assert match
fixture=ast.literal_eval(match.group(1))
# Source-grounded excerpt from the real TractorBel PDP; keep markup and native price as in LI.
needle='<p><span style="font-size:11px">Peça nova e pronta para a sua operação.</span></p>'
real='<p>A lâmina bico de pato é uma ferramenta de penetração no solo de alta robustez, fabricada especificamente para equipar caçambas de pás carregadeiras. Com seu design em formato de V, ela facilita a entrada em materiais compactados e aumenta a produtividade no carregamento.</p><h3>PRINCIPAIS CARACTERÍSTICAS</h3><ul><li>Design tipo Bico de Pato para penetração agressiva</li><li>Fabricada em aço de alta resistência ao desgaste e impacto</li><li>Espessura reforçada de 1.1/4 (31,75 mm)</li></ul>'
assert needle in fixture
fixture=fixture.replace(needle,real)
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width in [320,375,390,430,768,900,1024,1440,1920]:
        page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(fixture,wait_until='domcontentloaded')
        page.add_style_tag(content=css)
        page.add_script_tag(content=js)
        page.wait_for_selector('body.tb26-with-pdp')
        assert page.locator('.tb26-pdp__pix-feature').is_visible(),(width,'pix feature missing')
        assert page.locator('.tb26-pdp__pix-number').inner_text()=='R$ 5.820,00',width
        assert '180,00' in page.locator('.tb26-pdp__pix-saving').inner_text(),(width,repr(page.locator('.tb26-pdp__pix-saving').inner_text()))
        assert page.locator('.tb26-pdp__price .desconto-a-vista').is_hidden(),width
        assert page.locator('.preco-promocional').inner_text()=='R$ 6.000,00',width
        assert page.locator('.tb26-pdp__disclosure').count()==4,width
        assert 'caçambas de pás carregadeiras' in page.locator('.tb26-pdp__disclosure-body').first.inner_text(),width
        assert page.locator('.tb26-pdp__quick-item').count()==3,width
        assert page.locator('.botao-comprar').count()==1,width
        assert page.locator('form#formCalcularCep').count()==1,width
        assert page.locator('#descricao').count()==1,width
        assert page.locator('#formas-pagamento-lista-398845017').count()==1,(width,page.locator('.parcelas-produto').inner_html()[:800])
        assert page.locator('a[href="https://wa.me/5531996573930"]').count()==1,width
        assert page.locator('.tb26-pdp__disclosure').nth(0).evaluate('(e)=>e.open')==True,width
        assert page.locator('.tb26-pdp__disclosure').nth(1).evaluate('(e)=>e.open')==False,width
        # Native payment widget is opened through the disclosure action.
        page.locator('.tb26-pdp__disclosure').nth(2).locator('summary').click()
        page.get_by_role('button',name='Ver opções de pagamento').click()
        assert page.locator('#formas-pagamento-lista-398845017').is_visible(),width
        # Native freight input remains operational and can be focused.
        page.locator('.tb26-pdp__disclosure').nth(1).locator('summary').click()
        page.get_by_role('button',name='Calcular frete e prazo').click()
        assert page.locator('#cep').evaluate('(e)=>document.activeElement===e'),width
        # A variation/price update to the LI node updates the Pix feature.
        page.locator('.acoes-produto .desconto-a-vista strong').evaluate('(e)=>e.textContent="R$ 5.500,00"')
        page.wait_for_function('document.querySelector(".tb26-pdp__pix-number").textContent === "R$ 5.500,00"')
        assert '500,00' in page.locator('.tb26-pdp__pix-saving').inner_text()
        page.locator('.acoes-produto .desconto-a-vista strong').evaluate('(e)=>e.textContent="R$ 5.820,00"')
        page.wait_for_function('document.querySelector(".tb26-pdp__pix-number").textContent === "R$ 5.820,00"')
        if width<=767:
            assert page.locator('.tb26-pdp__mobile-bar').count()==1
            assert page.locator('.tb26-pdp__mobile-price').inner_text()=='R$ 5.820,00',width
            assert page.locator('.tb26-pdp__mobile-info small').inner_text()=='Valor no Pix',width
            page.evaluate("document.querySelector('#descricao').style.minHeight='1400px'")
            page.evaluate('window.scrollTo(0,document.body.scrollHeight)')
            page.wait_for_timeout(250)
            page.locator('.tb26-pdp__mobile-cta').click()
            assert page.evaluate('window.__buyClicks')==1,width
        documentWidth=page.evaluate('document.documentElement.scrollWidth')
        assert documentWidth<=width+1,(width,'horizontal-overflow',documentWidth)
        rects=page.locator('.tb26-pdp__grid>.span6').evaluate_all('(els)=>els.map(e=>({left:e.getBoundingClientRect().left,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))')
        if width>=768:assert rects[0]['left']<rects[1]['left'],(width,rects)
        else:assert rects[0]['bottom']<=rects[1]['top']+1,(width,rects)
        assert not errors,(width,errors)
        if width in [320,390,768,1440]:
            page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
            page.wait_for_timeout(300)
            page.screenshot(path=str(base/'tests'/f'pdp-v19-{width}.png'),full_page=True,animations='disabled')
        print('PASS',width,'pix',page.locator('.tb26-pdp__pix-number').inner_text(),'pageWidth',documentWidth,'disclosures',4)
        page.close()
    # When LI doesn't supply Pix for a product, don't invent a Pix price.
    no_pix=fixture.replace('ou <strong>R$ 5.820,00</strong> via Pix','Consulte as condições na finalização')
    page=browser.new_page(viewport={'width':390,'height':800})
    page.set_content(no_pix)
    page.add_style_tag(content=css);page.add_script_tag(content=js)
    assert page.locator('.tb26-pdp__pix-feature').is_hidden()
    assert page.locator('.preco-promocional').is_visible()
    assert page.locator('.tb26-pdp__mobile-info small').inner_text()=='Preço do produto'
    assert not page.evaluate('document.body.classList.contains("tb26-pdp--pix-active")')
    print('PASS without PIX — native price visible and no synthetic Pix')
    page.close();browser.close()
print('ALL PDP v1.9 QA PASS')