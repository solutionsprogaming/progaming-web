"""Genera los artboards del blog (índice + artículos, ES/EN/PT) a partir de la página de Contacto de cada idioma.
uso: python3 blog_build.py
"""
import os
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import html, json, re
from b_style import transform as b_transform
from blog_content import UI, ARTICLES, COVERS

P = os.path.join(REPO, "src", "project") + "/"
SUF = {"es": "", "en": "-EN", "pt": "-PT"}
HTMLLANG = {"es": "es", "en": "en", "pt": "pt-BR"}
CUR = 'aria-current="page" style="color: #0B1630; font-weight: 600; text-decoration: none; border-bottom: 2px solid {{accent}}; padding-bottom: 2px"'
NORMAL = 'style="color: #334155; text-decoration: none"'
SG = "font-family: 'Sora', sans-serif"

BLOG_CSS = """
.pg-prose{font-size:18px;line-height:1.75;color:#334155}
.pg-prose p{margin:0 0 20px}
.pg-prose h2{font-family:'Sora',sans-serif;font-weight:700;font-size:28px;line-height:1.2;letter-spacing:-.4px;color:#0B1630;margin:44px 0 14px}
.pg-prose ul,.pg-prose ol{margin:0 0 22px;padding-left:24px;display:flex;flex-direction:column;gap:8px}
.pg-prose strong{color:#0B1630}
.pg-card{transition:border-color .2s,box-shadow .2s,transform .2s}
.pg-card:hover{border-color:#93C5FD !important;box-shadow:0 16px 40px rgba(15,23,42,.10) !important;transform:translateY(-2px)}
.pg-card:hover .pg-more{text-decoration:underline}
@media (prefers-reduced-motion:reduce){.pg-card{transition:none}.pg-card:hover{transform:none}}
"""


def page(key, lang):
    return f"Blog{'-' + key if key else ''}{SUF[lang]}.dc.html"


def switcher(key, cur):
    items = []
    for lang, label in (("es", "ES"), ("en", "EN"), ("pt", "PT")):
        href = page(key, lang)
        if lang == cur:
            items.append(f'<a href="{href}" aria-current="true" lang="{HTMLLANG[lang]}" style="color: #FFFFFF; background: {{{{accent}}}}; text-decoration: none; font-weight: 700; font-size: 12px; padding: 4px 8px; border-radius: 6px">{label}</a>')
        else:
            items.append(f'<a href="{href}" lang="{HTMLLANG[lang]}" style="color: #334155; text-decoration: none; font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 6px">{label}</a>')
    return ('<span class="pg-lang" role="group" aria-label="Idioma / Language" style="display: inline-flex; align-items: center; gap: 2px; border: 1px solid #CBD5E1; border-radius: 8px; padding: 2px">'
            + "".join(items) + "</span>")


def cover(name, h=220, radius=18):
    color, soft, art = COVERS[name]
    return (f'<div aria-hidden="true" style="background: {soft}; border-radius: {radius}px; height: {h}px; display: flex; align-items: center; justify-content: center; overflow: hidden">'
            f'<svg viewBox="0 0 400 240" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="max-width: 440px">{art}</svg></div>')


def meta_line(a, lang):
    ui = UI[lang]
    return f'{ui["date_fmt"](a["date"])} · {a["minutes"]} {ui["min"]}'


def chip(text, color):
    return f'<span style="align-self: flex-start; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: {color}">{html.escape(text)}</span>'


def card(a, lang, featured=False):
    t = a[lang]; ui = UI[lang]; color = COVERS[a["cover"]][0]
    title_size = 30 if featured else 22
    flex = "display: flex; flex-wrap: wrap; gap: 0" if featured else "display: flex; flex-direction: column"
    img_box = (f'<div style="flex: 1 1 380px; min-width: 0; padding: 12px">{cover(a["cover"], 300, 14)}</div>' if featured
               else f'<div style="padding: 12px 12px 0">{cover(a["cover"], 190, 14)}</div>')
    text_flex = "flex: 1 1 360px; min-width: 0; padding: 32px 32px 32px 20px" if featured else "flex: 1; padding: 20px 24px 26px"
    head = f'{chip(ui["featured"] + " · " + t["cat"], color)}' if featured else chip(t["cat"], color)
    return f"""<a href="{page(a['key'], lang)}" class="pg-card" style="{flex}; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; text-decoration: none; color: inherit; box-shadow: 0 6px 20px rgba(15,23,42,0.05)">
{img_box}
<div style="{text_flex}; display: flex; flex-direction: column; gap: 12px; justify-content: center">
{head}
<span style="{SG}; font-weight: 700; font-size: {title_size}px; line-height: 1.2; letter-spacing: -0.4px; color: #0B1630; text-wrap: balance">{html.escape(t['title'])}</span>
<span style="font-size: 16px; color: #475569">{html.escape(t['excerpt'])}</span>
<span style="font-size: 13px; color: #64748B">{meta_line(a, lang)}</span>
<span class="pg-more" style="font-weight: 600; font-size: 15px; color: {{{{accent}}}}">{ui['read']} →</span>
</div>
</a>"""


def wa_button(var, label, extra=""):
    return (f'<a href="{{{{{var}}}}}" target="_blank" rel="noopener" style="background: #25D366; color: #04210F; text-decoration: none; font-weight: 700; font-size: 16px; padding: 14px 22px; border-radius: 10px; min-height: 52px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 10px{extra}">'
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"></path></svg>'
            f'{label}</a>')


def tg_button(label):
    return (f'<a href="https://t.me/progamingsolutions" target="_blank" rel="noopener" style="background: #FFFFFF; color: #0B1630; border: 1px solid #CBD5E1; text-decoration: none; font-weight: 600; font-size: 16px; padding: 13px 20px; border-radius: 10px; min-height: 52px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px">'
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#229ED9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 3L2 11l7 2 2 7 4-5 5 4 2-16zM9 13l9-7"></path></svg>'
            f'{label}</a>')


def index_main(lang):
    ui = UI[lang]
    feat = card(ARTICLES[0], lang, featured=True)
    cards = "\n".join(card(a, lang) for a in ARTICLES[1:])
    return f"""<!-- HERO BLOG -->
<section id="inicio" style="max-width: 1200px; margin: 0 auto; padding: 80px 24px 0">
<p style="margin: 0 0 18px; font-size: 13px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: {{{{accent}}}}">{ui['eyebrow']}</p>
<h1 style="margin: 0; {SG}; font-weight: 700; font-size: 58px; line-height: 1.05; letter-spacing: -1.4px; color: #0B1630; max-width: 900px">{ui['h1a']} <span class="pg-shine" style="background-image: linear-gradient(90deg, #1D4ED8, #0E7490, #6D28D9, #1D4ED8); -webkit-background-clip: text; background-clip: text; color: transparent">{ui['h1b']}</span></h1>
<p style="margin: 22px 0 0; font-size: 19px; color: #475569; max-width: 680px">{ui['lead']}</p>
</section>

<!-- ARTÍCULOS -->
<section aria-label="{ui['eyebrow']}" style="max-width: 1200px; margin: 0 auto; padding: 48px 24px 0">
<div style="display: grid; gap: 20px">
{feat}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px">
{cards}
</div>
</div>
</section>

<!-- PROPONER TEMA -->
<section style="max-width: 1200px; margin: 0 auto; padding: 72px 24px 0">
<div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 36px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px">
<div style="flex: 1 1 420px; min-width: 0"><h2 style="margin: 0; {SG}; font-weight: 700; font-size: 30px; letter-spacing: -0.5px; color: #0B1630">{ui['band_t']}</h2><p style="margin: 10px 0 0; font-size: 17px; color: #475569">{ui['band_p']}</p></div>
<div style="display: flex; flex-wrap: wrap; gap: 10px">{wa_button('waBand', ui['cta_wa'])}{tg_button(ui['cta_tg'])}</div>
</div>
</section>
"""


def article_main(a, lang):
    ui = UI[lang]; t = a[lang]; color = COVERS[a["cover"]][0]
    others = [o for o in ARTICLES if o is not a][:2]
    rel = "\n".join(card(o, lang) for o in others)
    return f"""<!-- ARTÍCULO -->
<article id="inicio" style="max-width: 800px; margin: 0 auto; padding: 56px 24px 0">
<nav aria-label="Ruta" style="font-size: 14px; color: #64748B; display: flex; gap: 8px; flex-wrap: wrap"><a href="{page('', lang)}" style="color: {{{{accent}}}}; text-decoration: none; font-weight: 600">← {ui['back']}</a><span aria-hidden="true">/</span><span>{html.escape(t['cat'])}</span></nav>
<h1 style="margin: 20px 0 0; {SG}; font-weight: 700; font-size: 48px; line-height: 1.1; letter-spacing: -1px; color: #0B1630; text-wrap: balance">{html.escape(t['title'])}</h1>
<p style="margin: 18px 0 0; font-size: 20px; color: #475569">{html.escape(t['excerpt'])}</p>
<p style="margin: 14px 0 0; font-size: 14px; color: #64748B">ProGaming Solutions · {meta_line(a, lang)}</p>
<div style="margin: 32px 0 8px">{cover(a['cover'], 300, 20)}</div>
<div class="pg-prose" style="margin-top: 32px">
{t['body'].strip()}
</div>
<div style="margin-top: 40px; background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid {color}; border-radius: 16px; padding: 28px; display: flex; flex-direction: column; gap: 14px">
<span style="{SG}; font-weight: 700; font-size: 24px; color: #0B1630">{ui['cta_t']}</span>
<span style="font-size: 16px; color: #475569">{ui['cta_p']}</span>
<div style="display: flex; flex-wrap: wrap; gap: 10px">{wa_button('waArticle', ui['cta_wa'])}{tg_button(ui['cta_tg'])}</div>
</div>
</article>

<!-- MÁS ARTÍCULOS -->
<section style="max-width: 1200px; margin: 0 auto; padding: 80px 24px 0">
<h2 style="margin: 0 0 22px; {SG}; font-weight: 700; font-size: 30px; letter-spacing: -0.5px; color: #0B1630">{ui['more']}</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px">
{rel}
</div>
</section>
"""


def script(lang, wa_article):
    ui = UI[lang]
    js = lambda s: json.dumps(s, ensure_ascii=False)
    props = '{"whatsapp":{"editor":"text","default":"573205519656","section":"WhatsApp"},"accent":{"editor":"color","default":"#1D4ED8","options":["#1D4ED8","#0E7490","#6D28D9","#047857"]},"$preview":{"width":1440,"height":%d}}'
    return props, f"""
class Component extends DCLogic {{
  renderVals() {{
    var accent = this.props.accent ?? '#1D4ED8';
    var wa = String(this.props.whatsapp ?? '573205519656').replace(/\\D/g, '');
    var link = function (t) {{ return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(t); }};
    var waDisplay = '+' + wa.slice(0, 2) + ' ' + wa.slice(2, 5) + ' ' + wa.slice(5, 8) + ' ' + wa.slice(8);
    return {{
      accent: accent, waDisplay: waDisplay,
      waGeneral: link({js(ui['wa_gen'])}),
      waBand: link({js(ui['wa_band'])}),
      waArticle: link({js(wa_article)})
    }};
  }}
}}
"""


def build(lang, key, title, main, wa_article, height):
    shell = open(P + f"Contacto{SUF[lang]}.dc.html", encoding="utf-8").read()
    head, rest = shell.split("</helmet>", 1)
    tpl, tail = rest.split("</x-dc>", 1)
    head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>", head, count=1)
    head = head.replace("</style>", BLOG_CSS + "</style>", 1)
    # cuerpo: reemplazar el contenido de Contacto
    a = tpl.index("<!-- HERO CONTACTO -->"); b = tpl.index('<div style="height: 104px"></div>')
    tpl = tpl[:a] + main + "\n" + tpl[b:]
    # menú: Blog como página actual
    tpl = tpl.replace(CUR, NORMAL, 1)
    tpl = re.sub(r'(<nav aria-label="(?:Principal|Main)".*?<a href="Blog[^"]*" )style="[^"]*"', lambda m: m.group(1) + CUR, tpl, count=1, flags=re.S)
    tpl = re.sub(r'<span class="pg-lang"[^>]*>(?:<a [^>]*>[^<]*</a>)*</span>', switcher(key, lang), tpl, count=1, flags=re.S)
    props, code = script(lang, wa_article)
    tail = re.sub(r"<script type=\"text/x-dc\" data-dc-script data-props='.*?'>.*?</script>",
                  lambda m: f"<script type=\"text/x-dc\" data-dc-script data-props='{props % height}'>{code}</script>", tail, count=1, flags=re.S)
    out = b_transform(head + "</helmet>" + tpl + "</x-dc>" + tail, force=True)
    assert "{{" not in re.sub(r"\{\{(accent|waGeneral|waDisplay|waBand|waArticle)\}\}", "", out.split("</helmet>", 1)[1].split("</x-dc>")[0]), "hueco desconocido"
    name = page(key, lang)
    open(P + name, "w", encoding="utf-8").write(out)
    return name


if __name__ == "__main__":
    made = []
    for lang in ("es", "en", "pt"):
        made.append(build(lang, "", UI[lang]["title"], index_main(lang), UI[lang]["wa_gen"], 2400))
        for a in ARTICLES:
            made.append(build(lang, a["key"], f"{a[lang]['title']} — ProGaming Solutions", article_main(a, lang), a[lang]["wa"], 4200))
    print(made)
