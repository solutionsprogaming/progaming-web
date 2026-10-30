# progamingsolutions.net

Sitio web de ProGaming Solutions (ES / EN / PT) con blog. Cloudflare publica la carpeta `site/` en cada push a `main`.

## Estructura
- `site/` — el sitio ya generado (lo que se publica). No se edita a mano.
- `src/project/` — páginas fuente (`*.dc.html`). Las versiones `-EN` y `-PT` se generan desde las de español.
- `src/build/` — scripts para generar el sitio.
  - `blog_content.py` — **los artículos del blog** (texto en los tres idiomas).
  - `publicar.py` — regenera todo `site/`.
- `src/assets/` — imágenes, logos e íconos.

## Publicar un artículo nuevo
1. Agregar el artículo al principio de la lista `ARTICLES` en `src/build/blog_content.py`
   (clave, portada, fecha, minutos, código de WhatsApp y textos `es` / `en` / `pt`).
2. `python3 src/build/publicar.py`
3. `git add -A && git commit -m "Blog: <título>" && git push`

Cloudflare (Workers): `wrangler.jsonc` publica solo la carpeta `site/`. Build command vacío, Deploy command `npx wrangler deploy`.
