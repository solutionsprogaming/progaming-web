import os
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json, subprocess, shutil, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
blobs={h:os.path.join(REPO,p) for h,p in json.load(open('blobs.json'))['blobs'].items()}
P=os.path.join(REPO,"src","project")+"/"
R=os.path.join(REPO,"site"); shutil.rmtree(R, ignore_errors=True)
D="https://progamingsolutions.net/"
links={"Home.dc.html":"/","Plataformas.dc.html":"/plataformas/","Fichas-Claro.dc.html":"/fichas/","Api.dc.html":"/api/"}
sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{D}{p}</loc></url>\n' for p in ["","plataformas/","fichas/","api/"])+'</urlset>\n'
og=os.path.join(REPO,"src","assets","og-image.jpg")
LANGS={"es":("","es","es_LA",""),"en":("en/","en","en_US","-EN"),"pt":("pt/","pt-BR","pt_BR","-PT")}
for lang,(pre,hl,loc,suf) in LANGS.items():
    for b,sub in [("Home",""),("Plataformas","plataformas/"),("Fichas-Claro","fichas/"),("Api","api/"),("Contacto","contacto/")]:
        links[f"{b}{suf}.dc.html"]="/"+pre+sub if (pre+sub) else "/"
META={
 "es":{"Home":("ProGaming Solutions | Plataformas, fichas y API de juegos para operadores","Tecnología iGaming para operadores, agentes y cajeros: plataformas personalizadas, venta de fichas, API con más de 2.000 juegos de proveedores líderes y chat integrado. Soporte 24/7."),
       "Plataformas":("Plataformas de casino online personalizadas en 1 semana | ProGaming Solutions","Lanza tu plataforma de juego con tu marca y dominio, lista en 1 semana: panel multinivel, múltiples proveedores, chat integrado y API para chatbots."),
       "Fichas-Claro":("Venta de fichas para agentes y cajeros | ProGaming Solutions","Compra fichas para operar en 11 plataformas de casino listas: pago en USDT o pesos argentinos, mejor precio por volumen y soporte 24/7."),
       "Api":("API de juegos: más de 2.000 juegos con una integración | ProGaming Solutions","Integra más de 2.000 juegos de Evolution, Pragmatic Play, PG Soft, NetEnt y más proveedores con una sola API."),
       "Contacto":("Contacto | ProGaming Solutions","Escríbenos por WhatsApp, Telegram o correo. Soporte 24/7 en español, inglés y portugués.")},
 "en":{"Home":("ProGaming Solutions | Platforms, credits and games API for operators","iGaming technology for operators, agents and cashiers: custom platforms, credit sales, an API with 2,000+ games from leading providers and built-in chat. 24/7 support."),
       "Plataformas":("Custom online casino platforms in 1 week | ProGaming Solutions","Launch your gaming platform with your brand and domain, ready in 1 week: multi-level panel, multiple providers, built-in chat and a chatbot API."),
       "Fichas-Claro":("Credit sales for agents and cashiers | ProGaming Solutions","Buy credits to operate on 11 ready casino platforms: pay in USDT or Argentine pesos, better price by volume and 24/7 support."),
       "Api":("Games API: 2,000+ games with one integration | ProGaming Solutions","Integrate 2,000+ games from Evolution, Pragmatic Play, PG Soft, NetEnt and more with a single API."),
       "Contacto":("Contact | ProGaming Solutions","Message us on WhatsApp, Telegram or email. 24/7 support in Spanish, English and Portuguese.")},
 "pt":{"Home":("ProGaming Solutions | Plataformas, fichas e API de jogos para operadores","Tecnologia iGaming para operadores, agentes e caixas: plataformas personalizadas, venda de fichas, API com mais de 2.000 jogos de provedores líderes e chat integrado. Suporte 24/7."),
       "Plataformas":("Plataformas de cassino online personalizadas em 1 semana | ProGaming Solutions","Lance sua plataforma de jogos com sua marca e domínio, pronta em 1 semana: painel multinível, vários provedores, chat integrado e API para chatbots."),
       "Fichas-Claro":("Venda de fichas para agentes e caixas | ProGaming Solutions","Compre fichas para operar em 11 plataformas de cassino prontas: pagamento em USDT ou pesos argentinos, melhor preço por volume e suporte 24/7."),
       "Api":("API de jogos: mais de 2.000 jogos com uma integração | ProGaming Solutions","Integre mais de 2.000 jogos da Evolution, Pragmatic Play, PG Soft, NetEnt e outros com uma única API."),
       "Contacto":("Contato | ProGaming Solutions","Fale conosco pelo WhatsApp, Telegram ou e-mail. Suporte 24/7 em espanhol, inglês e português.")}}
from blog_content import ARTICLES, UI as BUI
BLOG_META={"es":("Noticias y blog | ProGaming Solutions","Guías prácticas para operadores de juego online: plataformas, fichas, API de juegos, chat integrado y atención a jugadores."),
 "en":("News & blog | ProGaming Solutions","Practical guides for online gaming operators: platforms, credits, games API, built-in chat and player support."),
 "pt":("Notícias e blog | ProGaming Solutions","Guias práticos para operadores de jogos online: plataformas, fichas, API de jogos, chat integrado e atendimento a jogadores.")}
SUBS={"Home":"","Plataformas":"plataformas/","Fichas-Claro":"fichas/","Api":"api/","Contacto":"contacto/"}
# página -> {idioma: ruta}
PAGES={b:{l:sub for l in LANGS} for b,sub in SUBS.items()}
PAGES["Blog"]={l:"blog/" for l in LANGS}
for l in LANGS: META[l]["Blog"]=BLOG_META[l]
for a in ARTICLES:
    PAGES["Blog-"+a["key"]]={l:"blog/"+a[l]["slug"]+"/" for l in LANGS}
    for l in LANGS: META[l]["Blog-"+a["key"]]=(a[l]["title"]+" | ProGaming Solutions", a[l]["desc"])
for lang,(pre,hl,loc,suf) in LANGS.items():
    for b,subs in PAGES.items():
        links[f"{b}{suf}.dc.html"]="/"+pre+subs[lang]
urls=[D+LANGS[l][0]+subs[l] for subs in PAGES.values() for l in LANGS]
sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls)+'</urlset>\n'
for lang,(pre,hl,loc,suf) in LANGS.items():
    for b,subs in PAGES.items():
        sub=subs[lang]
        title,desc=META[lang][b]
        alts="\n".join(f'<link rel="alternate" hreflang="{LANGS[l][1]}" href="{D}{LANGS[l][0]}{subs[l]}">' for l in LANGS)+f'\n<link rel="alternate" hreflang="x-default" href="{D}{subs["es"]}">'
        ogimg=os.path.join(REPO,"src","assets","og-fichas.jpg") if b=="Fichas-Claro" else og
        ogn="og-fichas.jpg" if b=="Fichas-Claro" else "og-image.jpg"
        cfg=dict(blobs=blobs,url=D+pre+sub,theme="#FFFFFF",assets_prefix="/assets/",site_root=R,links=links,appjs=f"app-{lang}-{b.lower()}.js",
                 root_files=(lang=="es" and sub==""),sitemap=sitemap,og_url=D+ogn,title=title,description=desc,og_title=title.split(" | ")[0],og_description=desc,
                 og_image=ogimg,og_name=ogn,lang=hl,locale=loc,head_extra=alts)
        json.dump(cfg,open('/tmp/pg-cfg.json','w'),ensure_ascii=False)
        r=subprocess.run([sys.executable,"dc2static.py",P+f"{b}{suf}.dc.html",os.path.join(R,pre+sub),'/tmp/pg-cfg.json'],capture_output=True,text=True); print(lang,b,r.stdout.strip()[:60], r.stderr.strip()[-400:])
