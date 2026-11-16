from pathlib import Path
import re, ast
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
css=(base/'tractorbel.css').read_text(encoding='utf8')
js=(base/'tractorbel.js').read_text(encoding='utf8')
source=(base/'tests/qa-pdp-v18.py').read_text(encoding='utf8')
match=re.search(r"fixture=('''.*?''')\n\nwith sync_playwright",source,re.S)
assert match, 'Fixture da LI nao encontrada'
fixture=ast.literal_eval(match.group(1))
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.set_content(fixture,wait_until='domcontentloaded')
    page.add_style_tag(content=css)
    page.add_script_tag(content=js)
    page.wait_for_selector('body.tb26-with-pdp')
    for width in [1440,1024,768,767,390,320,767,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        page.wait_for_timeout(100)
        panel=page.locator('.tb26-pdp__quick-panel')
        assert panel.count()==1,(width,'duplicated important information')
        assert page.locator('.tb26-pdp__quick-item').count()==3,width
        assert page.locator('.tb26-pdp__disclosure').count()==4,width
        assert page.locator('.tb26-pdp__pix-number').inner_text()=='R$ 5.820,00',width
        assert page.locator('.botao-comprar').count()==1,width
        assert page.locator('#formCalcularCep').count()==1,width
        location=panel.evaluate('(e)=>({parent:e.parentElement.className, before:e.previousElementSibling?.className, after:e.nextElementSibling?.className})')
        if width>=768:
            assert 'tb26-pdp__media' in location['parent'],(width,location)
            assert 'produto-thumbs' in str(location['before']),(width,location)
            assert 'produto-compartilhar' in str(location['after']),(width,location)
        else:
            assert 'tb26-pdp__after-buy' in location['parent'],(width,location)
            assert 'tb26-pdp__disclosures' in str(location['after']),(width,location)
        rect=panel.bounding_box()
        assert rect and rect['width']>140,(width,rect)
        doc_w=page.evaluate('document.documentElement.scrollWidth')
        assert doc_w<=width+1,(width,'overflow',doc_w)
        print('PASS',width,'panel parent',location['parent'],'width',round(rect['width']))
        if width in [390,1440]:
            page.screenshot(path=str(base/'tests'/f'quick-info-{width}.png'),full_page=True,animations='disabled')
    assert not errors,errors
    page.close()
    # Segundo produto de teste com duas miniaturas da LI: mesma ancora correta.
    source_with_two=fixture.replace('</li></ul></div></div><div class="produto-compartilhar">',
      '<li><a data-imagem-grande="/img2.png" href="javascript:;"><img alt="Foto 2" src="/img2.png"></a></li></ul></div></div><div class="produto-compartilhar">')
    page=browser.new_page(viewport={'width':1200,'height':900})
    page.set_content(source_with_two)
    page.add_style_tag(content=css); page.add_script_tag(content=js)
    assert page.locator('.tb26-pdp__quick-panel').count()==1
    assert 'produto-thumbs' in (page.locator('.tb26-pdp__quick-panel').evaluate('(e)=>e.previousElementSibling.className'))
    print('PASS with multiple thumbnails')
    page.close();browser.close()
print('ALL v1.10 TESTS PASSED')