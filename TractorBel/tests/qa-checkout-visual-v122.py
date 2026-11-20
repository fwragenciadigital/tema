#!/usr/bin/env python3
"""QA do conceito visual da TractorBel (NÃO é teste transacional).
Uso: TB_PREVIEW_URL=https://tractorbel-2026.vercel.app/checkout-preview.html python tests/qa-checkout-visual-v122.py
Requer: playwright e navegador Chromium instalados.
"""
import os
from playwright.sync_api import sync_playwright

URL = os.environ.get("TB_PREVIEW_URL","https://tractorbel-2026.vercel.app/checkout-preview.html")
CASES = [(1440,False),(1366,False),(1280,False),(767,False),(767,True),(390,True)]

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        try:
            for width,is_mobile in CASES:
                context=browser.new_context(
                    viewport={"width":width,"height":900},
                    is_mobile=is_mobile,has_touch=is_mobile,
                    device_scale_factor=2 if is_mobile else 1
                )
                page=context.new_page()
                try:
                    response=page.goto(URL,wait_until="domcontentloaded",timeout=20000)
                    assert response and response.ok, ("HTTP",width,response.status if response else None)
                    assert page.locator(".cols").count()==1
                    assert page.locator(".preview-checkout-cta").count()==1
                    assert page.locator("form").count()==0, "Prévia não pode coletar dados"
                    assert page.locator("input:not([disabled])").count()==0, "Campos da prévia devem ficar desabilitados"
                    metrics=page.evaluate("""() => {
                        const cols=document.querySelector(".cols");
                        const panels=[...cols.children];
                        const positions=panels.map(e=>e.getBoundingClientRect());
                        return {
                            scrollWidth:document.documentElement.scrollWidth,
                            viewportWidth:document.documentElement.clientWidth,
                            stacked:positions[1].top>=positions[0].bottom-2,
                            columnCount:getComputedStyle(cols).gridTemplateColumns.split(" ").length
                        };
                    }""")
                    assert metrics["scrollWidth"] <= metrics["viewportWidth"]+1,(width,is_mobile,metrics)
                    assert metrics["stacked"]==(width<=767),(width,is_mobile,metrics)
                    print("PASS",width,"mobile" if is_mobile else "viewport",metrics)
                finally:
                    context.close()
        finally:
            browser.close()

if __name__=="__main__":
    main()
