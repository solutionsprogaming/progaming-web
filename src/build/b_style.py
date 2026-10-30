"""Aplica el estilo de la Opción B a una página .dc.html (misma información, otra visualización):
tipografía Sora + Manrope, botones píldora, etiquetas con barra, encabezado y contacto en bloque azul claro,
texto degradado -> color sólido."""
import re

D = "font-family: 'Sora', sans-serif"
EYE = "font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: {{accent}}; display: flex; align-items: center; gap: 10px"
BAR = '<span aria-hidden="true" style="flex: 0 0 28px; height: 3px; border-radius: 3px; background: {{accent}}"></span>'
CARD = "background: #F2F6FF; border: 1px solid #DCE6FA; border-radius: 32px; padding: clamp(28px, 5vw, 64px); box-sizing: border-box"
MARK = "<!-- estilo B -->"


def close_of(s, start, tag="section"):
    depth = 0
    for m in re.finditer(rf"<{tag}\b|</{tag}>", s[start:]):
        depth += 1 if m.group(0).startswith(f"<{tag}") else -1
        if depth == 0:
            return start + m.start()
    raise ValueError("sin cierre")


def wrap_section(s, sid, top="32px", bottom="0"):
    """Envuelve el contenido de <section id=sid> en el bloque azul claro."""
    m = re.search(rf'<section id="{sid}" style="([^"]*)">', s)
    if not m:
        return s
    st = m.group(1)
    pad = re.search(r"padding: ([^;]+)", st)
    keep = "; ".join(p.strip() for p in st.split(";") if p.strip() and not re.match(r"\s*(max-width|margin|padding)\b", p))
    end = close_of(s, m.start())
    pb = pad.group(1).split()[2] if pad and len(pad.group(1).split()) >= 3 else bottom
    pb = bottom if sid == "inicio" else pb
    inner = s[m.end():end]
    new_open = f'<section id="{sid}" style="max-width: 1248px; margin: 0 auto; padding: {top} 24px {pb}">\n<div style="{CARD}{"; " + keep if keep else ""}">'
    return s[:m.start()] + new_open + inner + "</div>\n" + s[end:]


def transform(s, force=False):
    if MARK in s and not force:
        return s
    head, rest = s.split("</helmet>", 1)
    tpl, tail = rest.split("</x-dc>", 1)
    # tipografía
    head = head.replace("family=Space+Grotesk:wght@500;600;700&amp;family=Inter:wght@400;500;600", "family=Sora:wght@600;700&amp;family=Manrope:wght@400;500;600;700")
    for part in ("head", "tpl", "tail"):
        v = locals()[part]
        v = v.replace("font-family: 'Space Grotesk', sans-serif", D).replace("font-family:'Space Grotesk',sans-serif", "font-family:'Sora',sans-serif")
        v = v.replace("font-family: Inter, system-ui, sans-serif", "font-family: Manrope, system-ui, sans-serif")
        v = v.replace("'Space Grotesk', sans-serif", "'Sora', sans-serif")
        if part == "head": head = v
        elif part == "tpl": tpl = v
        else: tail = v
    # títulos un poco más compactos
    tpl = re.sub(r"letter-spacing: -0\.8px; color: #0B1630", "letter-spacing: -1.2px; color: #0B1630", tpl)
    # texto con degradado -> color sólido de acento
    tpl = re.sub(r'class="pg-shine" style="background-image: linear-gradient\([^"]*?color: transparent"', 'style="color: {{accent}}"', tpl)
    tpl = re.sub(r'style="background: linear-gradient\([^"]*?-webkit-background-clip: text; background-clip: text; color: transparent"', 'style="color: {{accent}}"', tpl)
    # etiquetas (eyebrow) con barra
    def eye(m):
        margin = m.group(1)
        return f'<p style="margin: {margin}; {EYE}">{BAR}{m.group(2)}</p>'
    tpl = re.sub(r'<p style="margin: ([^;]+); font-size: 13px; font-weight: 600; letter-spacing: 2\.5px; text-transform: uppercase; color: \{\{accent\}\}">([^<]*)</p>', eye, tpl)
    # botones: forma de píldora (enlaces y botones con alto mínimo)
    tpl = re.sub(r'(<a [^>]*style="[^"]*?)border-radius: (?:8|10|12)px;([^"]*min-height)', r"\1border-radius: 999px;\2", tpl)
    tail = re.sub(r"(min-height: \d+px[^']*?)border-radius: (?:8|10)px", r"\1border-radius: 999px", tail)
    tail = re.sub(r"border-radius: (?:8|10)px;([^']*?min-height)", r"border-radius: 999px;\1", tail)
    # bloques azul claro: encabezado y contacto
    tpl = wrap_section(tpl, "inicio")
    tpl = wrap_section(tpl, "contacto", top="104px", bottom="104px")
    return head + "</helmet>" + ("" if MARK in tpl else MARK) + tpl + "</x-dc>" + tail


if __name__ == "__main__":
    import sys
    for f in sys.argv[1:]:
        s = open(f, encoding="utf-8").read()
        t = transform(s)
        open(f, "w", encoding="utf-8").write(t)
        print(f.split("/")[-1], "ok" if t != s else "sin cambios", "| quedan:", t.count("Space Grotesk"), "degradados de texto:", t.count("background-clip: text"))
