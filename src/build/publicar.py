"""Regenera todo el sitio en /site: blog (desde blog_content.py), páginas estáticas y pre-renderizado.
uso: python3 src/build/publicar.py            (después: git add -A && git commit && git push)
Si cambiaste textos de las páginas en español (src/project/*.dc.html sin -EN/-PT), corre antes:
     python3 src/build/i18n_apply.py
"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
for step in ["blog_build.py", "build_site.py", "prerender.py"]:
    print("==", step)
    r = subprocess.run([sys.executable, step], cwd=HERE)
    if r.returncode:
        sys.exit(f"falló {step}")
print("listo: sitio en /site")
