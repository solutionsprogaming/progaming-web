"""Convierte un artboard .dc.html en un sitio estático: index.html + assets/ + runtime.
uso: dc2static.py SRC OUTDIR CONFIG.json
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import html, json, os, re, shutil, sys

SRC, OUT, CFG = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3], encoding="utf-8"))
src = open(SRC, encoding="utf-8").read()
PREFIX = CFG.get("assets_prefix", "assets/")
ROOT = CFG.get("site_root", OUT)
os.makedirs(os.path.join(ROOT, "assets"), exist_ok=True)
os.makedirs(OUT, exist_ok=True)

# ---- partes del artboard
helmet = re.search(r"<helmet>(.*?)</helmet>", src, re.S).group(1)
body_tpl = src.split("</helmet>", 1)[1].split("</x-dc>", 1)[0].strip()
m = re.search(r"""<script type="text/x-dc" data-dc-script data-props='(.*?)'>(.*?)</script>""", src, re.S)
props_def = json.loads(html.unescape(m.group(1)))
code = m.group(2)
props = {k: v.get("default") for k, v in props_def.items() if not k.startswith("$") and isinstance(v, dict)}

# ---- imágenes subidas -> archivos locales
blobmap = CFG["blobs"]  # id -> ruta local
used = set(re.findall(r"/_blob/([0-9a-f]{32})", src))
missing = used - set(blobmap)
assert not missing, f"faltan blobs: {missing}"
for bid in used:
    srcf = blobmap[bid]
    name = os.path.basename(srcf)
    shutil.copy(srcf, os.path.join(ROOT, "assets", name))
    body_tpl = body_tpl.replace(f"/_blob/{bid}", PREFIX + name)
    code = code.replace(f"/_blob/{bid}", PREFIX + name)

# ---- enlaces entre páginas
for k, v in CFG.get("links", {}).items():
    body_tpl = body_tpl.replace(f'href="{k}#', f'href="{v}#').replace(f'href="{k}"', f'href="{v}"')
    code = code.replace(f"'{k}#", f"'{v}#").replace(f"'{k}'", f"'{v}'")
# ---- <sc-for> dentro de <select>: el parser HTML lo eliminaría; usar <optgroup data-sc-for>
def fix_select(mm):
    s = mm.group(0)
    s = re.sub(r"<sc-for\b", '<optgroup data-sc-for="1"', s)
    return s.replace("</sc-for>", "</optgroup>")
body_tpl = re.sub(r"<select\b.*?</select>", fix_select, body_tpl, flags=re.S)

# ---- head
fonts = "\n".join(re.findall(r"<link[^>]+>", helmet)).replace("&amp;", "&")
style = re.search(r"<style>(.*?)</style>", helmet, re.S).group(1)
c = CFG
head = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{c['title']}</title>
<meta name="description" content="{c['description']}">
<meta name="theme-color" content="{c.get('theme', '#070F1F')}">
<link rel="canonical" href="{c['url']}">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="{c.get('locale', 'es_LA')}">
<meta property="og:site_name" content="ProGaming Solutions">
<meta property="og:title" content="{c['og_title']}">
<meta property="og:description" content="{c['og_description']}">
<meta property="og:image" content="{c.get('og_url', c['url'] + 'og-image.jpg')}">
<meta property="og:url" content="{c['url']}">
<meta name="twitter:card" content="summary_large_image">
{c.get('head_extra', '')}
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{fonts}

<!-- GOOGLE ANALYTICS: pega aquí el código que te da Google (empieza con <script async src="https://www.googletagmanager.com/gtag/js?id=G-...">) -->
{('<!-- Meta Pixel -->\n<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,\'script\',\'https://connect.facebook.net/en_US/fbevents.js\');\nfbq(\'init\', \'' + c['meta_pixel'] + '\');\nfbq(\'track\', \'PageView\');\n</script>\n<!-- Fin Meta Pixel -->') if c.get('meta_pixel') else ''}

<style>
html{{scroll-behavior:smooth}}
*{{box-sizing:border-box}}
img{{max-width:100%}}
nav a:hover{{color:#1D4ED8 !important}}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible{{outline:3px solid #7CC4FF;outline-offset:3px}}
section[id]{{scroll-margin-top:16px}}
.skip{{position:absolute;left:-9999px;top:8px;background:#fff;color:#000;padding:8px 12px;border-radius:6px;z-index:100}}
.skip:focus{{left:8px}}
input::placeholder{{color:#6F82A6}}
a[href^="https://wa.me"]:hover{{filter:brightness(1.08)}}
@media (max-width:560px){{h1{{font-size:clamp(36px,10vw,60px) !important}} h2{{font-size:clamp(28px,8vw,44px) !important}}}}
@media (max-width:560px){{a[aria-label][style*="position: fixed"]{{font-size:0 !important;padding:16px !important;gap:0 !important;right:16px !important;bottom:16px !important}}}}
@media (prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}}}
{style}
</style>"""

runtime = open(os.path.join(os.path.dirname(__file__), "dc-runtime.js"), encoding="utf-8").read()
morph = open(os.path.join(os.path.dirname(__file__), "vendor/package/dist/morphdom-umd.min.js"), encoding="utf-8").read()
shutil.copy(os.path.join(os.path.dirname(__file__), "vendor/package/LICENSE"), os.path.join(ROOT, "assets", "morphdom-LICENSE.txt"))
APPJS = CFG.get("appjs", "app.js")
open(os.path.join(ROOT, "assets", APPJS), "w", encoding="utf-8").write(
    "/* morphdom (MIT) — ver morphdom-LICENSE.txt */\n" + morph + "\n" + runtime + "\n" + code +
    f"""
DCApp.mount('dc-root', 'dc-tpl', Component, {json.dumps(props, ensure_ascii=False)});
// Medición: cada clic a WhatsApp envía un evento a Google Analytics y/o Meta Pixel si están instalados.
document.addEventListener('click', function (e) {{
  var a = e.target.closest && e.target.closest('a[href^="https://wa.me"]');
  if (!a) return;
  var lugar = (a.textContent || '').trim().slice(0, 60);
  if (window.gtag) gtag('event', 'click_whatsapp', {{ boton: lugar, pagina: location.hostname }});
  if (window.fbq) fbq('track', 'Contact', {{ content_name: lugar }});
}});
""")

page = f"""<!doctype html>
<html lang="{c.get('lang', 'es')}">
<head>
{head}
</head>
<body>
{('<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=' + c['meta_pixel'] + '&amp;ev=PageView&amp;noscript=1"></noscript>') if c.get('meta_pixel') else ''}
<a class="skip" href="#inicio">Saltar al contenido</a>
<div id="dc-root"><!--PRERENDER--></div>
<template id="dc-tpl">
{body_tpl}
</template>
<script src="{PREFIX}{APPJS}" defer></script>
</body>
</html>
"""
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page)
if CFG.get("root_files", True):
  open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nSitemap: {c['url']}sitemap.xml\n")
  open(os.path.join(OUT, "sitemap.xml"), "w").write(
      CFG.get("sitemap") or f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{c["url"]}</loc></url>\n</urlset>\n')
for f in ["favicon.png", "apple-touch-icon.png"]:
    shutil.copy(os.path.join(REPO, "src", "assets", f), os.path.join(ROOT, f))
shutil.copy(c["og_image"], os.path.join(ROOT, c.get("og_name", "og-image.jpg")))
print("ok", OUT, len(page), "blobs:", len(used), "props:", props)
