"""Pre-renderiza cada página: guarda el HTML ya armado dentro de #dc-root para que Google lea el texto sin ejecutar JavaScript."""
import os
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import asyncio, os, subprocess, sys, time
from playwright.async_api import async_playwright

R = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "site")
PORT = 8765

async def main():
    pages = [os.path.relpath(os.path.join(d, "index.html"), R) for d, _, fs in os.walk(R) if "index.html" in fs]
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "-d", R], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch()
            pg = await b.new_page(viewport={"width": 1440, "height": 900})
            for rel in sorted(pages):
                url = f"http://127.0.0.1:{PORT}/" + rel.replace("index.html", "")
                await pg.goto(url); await pg.wait_for_timeout(400)
                inner = await pg.evaluate("document.getElementById('dc-root').innerHTML")
                assert "{{" not in inner, rel
                f = os.path.join(R, rel); s = open(f, encoding="utf-8").read()
                assert "<!--PRERENDER-->" in s, rel
                open(f, "w", encoding="utf-8").write(s.replace("<!--PRERENDER-->", inner, 1))
                print("ok", rel, len(inner))
            await b.close()
    finally:
        srv.terminate()

asyncio.run(main())
