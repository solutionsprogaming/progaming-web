"""Genera versiones EN y PT de las 4 páginas y agrega el selector ES · EN · PT a todas."""
import os
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from i18n_tr import T, T2, EXTRA

P = os.path.join(REPO, "src", "project") + "/"
SRC = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "i18n_src.json")))
PAGES = ["Home.dc.html", "Plataformas.dc.html", "Fichas-Claro.dc.html", "Api.dc.html", "Contacto.dc.html"]
LANGS = {"en": 0, "pt": 1}
SUFFIX = {"es": "", "en": "-EN", "pt": "-PT"}
HTMLLANG = {"es": "es", "en": "en", "pt": "pt-BR"}


def page_name(base, lang):
    return base.replace(".dc.html", SUFFIX[lang] + ".dc.html")


def switcher(base, cur):
    items = []
    for lang, label in (("es", "ES"), ("en", "EN"), ("pt", "PT")):
        href = page_name(base, lang)
        if lang == cur:
            items.append(f'<a href="{href}" aria-current="true" lang="{HTMLLANG[lang]}" style="color: #FFFFFF; background: {{{{accent}}}}; text-decoration: none; font-weight: 700; font-size: 12px; padding: 4px 8px; border-radius: 6px">{label}</a>')
        else:
            items.append(f'<a href="{href}" lang="{HTMLLANG[lang]}" style="color: #334155; text-decoration: none; font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 6px">{label}</a>')
    return ('<span class="pg-lang" role="group" aria-label="Idioma / Language" style="display: inline-flex; align-items: center; gap: 2px; border: 1px solid #CBD5E1; border-radius: 8px; padding: 2px">'
            + "".join(items) + "</span>")


def add_switcher(s, base, lang):
    s = re.sub(r'<span class="pg-lang"[^>]*>(?:<a [^>]*>[^<]*</a>)*</span>\n?', "", s)
    m = re.search(r'(<nav aria-label="(?:Principal|Main)"[^>]*>.*?)(</nav>)', s, re.S)
    assert m, base
    return s[:m.end(1)] + switcher(base, lang) + "\n" + s[m.end(1):]


def translate(s, idx):
    head, rest = s.split("</helmet>", 1)
    tpl, tail = rest.split("</x-dc>", 1)
    pairs = {SRC[i]: v[idx] for i, v in T.items() if SRC[i] != v[idx]}
    pairs.update({k: v[idx] for k, v in T2.items()})
    # nodos de texto
    def node(m):
        raw = m.group(1); st = raw.strip()
        if st in pairs:
            return ">" + raw.replace(st, pairs[st], 1) + "<"
        return m.group(0)
    tpl = re.sub(r">([^<>]+)<", node, tpl)
    # atributos
    def attr(m):
        v = m.group(2)
        if v in pairs: v = pairs[v]
        for es, en, pt in EXTRA:
            if v == es: v = (en, pt)[idx]
        return f'{m.group(1)}="{v}"'
    tpl = re.sub(r'\b(alt|aria-label|placeholder|title)="([^"]*)"', attr, tpl)
    # strings JS
    def js(m):
        v = m.group(1)
        if v in pairs:
            return "'" + pairs[v].replace("'", "\\'") + "'"
        return m.group(0)
    a = tail.index("data-dc-script")
    code = re.sub(r"'((?:[^'\\]|\\.)*)'", js, tail[a:])
    tail = tail[:a] + code
    # título
    t = re.search(r"<title>(.*?)</title>", head).group(1)
    if t in pairs: head = head.replace(f"<title>{t}</title>", f"<title>{pairs[t]}</title>")
    return head + "</helmet>" + tpl + "</x-dc>" + tail


def relink(s, lang):
    for b in PAGES + ["Blog.dc.html"]:
        tgt = page_name(b, lang)
        s = s.replace(f'href="{b}', f'href="{tgt}').replace(f"'{b}", f"'{tgt}")
    return s


for base in PAGES:
    src = open(P + base, encoding="utf-8").read()
    es = add_switcher(src, base, "es")
    open(P + base, "w", encoding="utf-8").write(es)
    for lang, idx in LANGS.items():
        s = translate(es, idx)
        s = relink(s, lang)
        s = add_switcher(s, base, lang)
        s = s.replace('<html lang="es">', f'<html lang="{HTMLLANG[lang]}">')
        if lang == "en":
            s = s.replace("big: '+2.000'", "big: '2,000+'").replace("+2.000", "2,000+")
        open(P + page_name(base, lang), "w", encoding="utf-8").write(s)
        # restos en español (para revisar)
        tpl = s.split("</helmet>", 1)[1].split("</x-dc>", 1)[0]
        left = [t.strip() for t in re.findall(r">([^<>]+)<", re.sub(r"<(svg|pre)\b.*?</\1>", "", tpl, flags=re.S))
                if re.search(r"[áéíóúñ¿¡]|\b(de|para|tu|con|que|los|las|el)\b", t)]
        print(base, lang, "restos:", left[:6])
