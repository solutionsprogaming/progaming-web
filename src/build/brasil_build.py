"""Página de destino para o Brasil (só em português): plataforma e jogos para operadores autorizados.
uso: python3 brasil_build.py   (publicar.py a executa)"""
import re
import blog_build as bb

SG = bb.SG
WA_MSG = "Olá, vim da página Brasil da ProGaming Solutions [BR-LANDING]. Sou operador e quero falar sobre plataforma e jogos para minha bet."
ACC = "{{accent}}"
EYE = f'<p style="margin: 0 0 14px; font-size: 13px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: {ACC}">'
H2 = f'<h2 style="margin: 0; {SG}; font-weight: 700; font-size: 40px; line-height: 1.12; letter-spacing: -1.2px; color: #0B1630; max-width: 780px">'
CARD = "background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 26px; display: flex; flex-direction: column; gap: 10px"


def icon(path, color):
    return (f'<span aria-hidden="true" style="width: 46px; height: 46px; border-radius: 12px; background: {color}1A; color: {color}; display: inline-flex; align-items: center; justify-content: center">'
            f'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{path}"></path></svg></span>')


OFFER = [
    ("M3 4h18v12H3zM8 20h8M12 16v4", "#1D4ED8", "Plataforma com a sua marca",
     "Cassino e apostas com seu logo, suas cores e seu domínio bet.br, em português e com valores em reais."),
    ("M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14", "#0E7490", "API com +2.000 jogos",
     "Catálogo de provedores reconhecidos com uma única integração. Você escolhe os provedores e jogos que vai oferecer."),
    ("M4 6h16M4 12h10M4 18h7M18 15l3 3-3 3", "#6D28D9", "Integrações e automações",
     "API do painel para conectar CRM, chatbots e as ferramentas da sua equipe de operação."),
    ("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2", "#15803D", "Suporte 24/7 em português",
     "Acompanhamento técnico na integração, nos testes e depois do lançamento."),
]

REQS = [
    ("Domínio bet.br", "Os canais eletrônicos do operador devem usar o domínio bet.br (Portaria SPA/MF nº 722/2024)."),
    ("Requisitos técnicos e de segurança", "O sistema de apostas e a plataforma precisam atender aos requisitos técnicos dos anexos da Portaria SPA/MF nº 722/2024."),
    ("Certificação por laboratório reconhecido", "A plataforma é certificada por um laboratório com capacidade técnica reconhecida (Portaria SPA/MF nº 300/2024). Integrações alteradas podem exigir recertificação."),
    ("Jogos on-line certificados", "Os jogos e estúdios ao vivo seguem regras próprias (Portaria SPA/MF nº 1.207/2024)."),
    ("Envio de dados ao SIGAP", "O operador reporta suas operações ao Sistema de Gestão de Apostas da SPA/MF."),
    ("Jogo responsável", "Adesão à plataforma de impedidos, limites e ferramentas de proteção ao apostador."),
]

STEPS = [
    ("Conversa técnica", "Entendemos seu projeto, sua situação de autorização e o que você precisa: plataforma completa, jogos via API ou ambos."),
    ("Proposta", "Enviamos a proposta com escopo, provedores, prazos e condições."),
    ("Integração e testes", "Configuramos a plataforma com a sua marca e integramos os jogos em ambiente de testes."),
    ("Certificação", "Trabalhamos com a sua equipe e com o laboratório nos ajustes técnicos que forem necessários."),
    ("Lançamento", "Publicação no seu domínio bet.br e suporte contínuo da nossa equipe."),
]

FAQ = [
    ("A ProGaming tem autorização para operar apostas no Brasil?",
     "Não operamos apostas. A autorização da SPA/MF é do operador; a ProGaming fornece a tecnologia: plataforma, jogos e integrações."),
    ("Vocês trabalham com operadores sem autorização?",
     "No Brasil, trabalhamos com operadores autorizados ou com pedido de autorização em andamento na SPA/MF."),
    ("Já tenho plataforma. Posso usar só os jogos?",
     "Sim. Com a nossa API você integra o catálogo de jogos na sua plataforma atual."),
    ("Em quanto tempo consigo lançar?",
     "Depende do escopo e da certificação do laboratório. Na conversa técnica montamos um cronograma realista para o seu caso."),
]


def main_html():
    offer = "".join(f'<div style="{CARD}">{icon(p, c)}<h3 style="margin: 0; {SG}; font-weight: 700; font-size: 21px; color: #0B1630">{t}</h3><p style="margin: 0; font-size: 15px; color: #526079">{d}</p></div>'
                    for p, c, t, d in OFFER)
    reqs = "".join(f'<li style="display: flex; gap: 14px; align-items: flex-start; padding: 18px 0; border-top: 1px solid #DCE6FA"><span aria-hidden="true" style="flex: 0 0 26px; height: 26px; border-radius: 8px; background: {ACC}; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700">✓</span>'
                   f'<span><strong style="display: block; color: #0B1630; font-size: 17px">{t}</strong><span style="font-size: 15px; color: #475569">{d}</span></span></li>' for t, d in REQS)
    steps = "".join(f'<li style="{CARD}"><span style="{SG}; font-weight: 700; font-size: 15px; color: {ACC}">Passo {i}</span><strong style="font-size: 18px; color: #0B1630">{t}</strong><span style="font-size: 15px; color: #526079">{d}</span></li>'
                    for i, (t, d) in enumerate(STEPS, 1))
    faq = "".join(f'<details style="border-top: 1px solid #E2E8F0; padding: 18px 0"><summary style="cursor: pointer; font-weight: 700; font-size: 17px; color: #0B1630">{q}</summary><p style="margin: 10px 0 0; font-size: 16px; color: #475569">{a}</p></details>'
                  for q, a in FAQ)
    return f"""<!-- HERO BRASIL -->
<section id="inicio" style="max-width: 1200px; margin: 0 auto; padding: 80px 24px 0">
{EYE}Brasil · Operadores autorizados</p>
<h1 style="margin: 0; {SG}; font-weight: 700; font-size: 58px; line-height: 1.05; letter-spacing: -1.6px; color: #0B1630; max-width: 900px">Plataforma e jogos para a sua <span style="color: {ACC}">bet.br</span></h1>
<p style="margin: 22px 0 0; font-size: 19px; color: #475569; max-width: 700px">Tecnologia para operadores autorizados pela SPA/MF ou em processo de autorização: plataforma com a sua marca, mais de 2.000 jogos com uma única integração e suporte em português.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px">{bb.wa_button('waArticle', 'Falar pelo WhatsApp')}<a href="#requisitos" style="background: #FFFFFF; color: #0B1630; border: 1px solid #CBD5E1; text-decoration: none; font-weight: 600; font-size: 16px; padding: 13px 22px; border-radius: 10px; min-height: 52px; box-sizing: border-box; display: inline-flex; align-items: center">Ver requisitos do mercado</a></div>
</section>

<!-- O QUE OFERECEMOS -->
<section style="max-width: 1200px; margin: 0 auto; padding: 96px 24px 0">
{EYE}O que oferecemos</p>
{H2}Tudo o que a sua operação precisa, de um só fornecedor</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-top: 36px">{offer}</div>
</section>

<!-- REQUISITOS -->
<section id="requisitos" style="max-width: 1200px; margin: 0 auto; padding: 96px 24px 0">
<div style="background: #F2F6FF; border: 1px solid #DCE6FA; border-radius: 28px; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; gap: 40px">
<div style="flex: 1 1 320px; min-width: 0">{EYE}Mercado regulado</p>
{H2}O que a regulamentação brasileira exige da sua plataforma</h2>
<p style="margin: 18px 0 0; font-size: 17px; color: #475569">Na conversa técnica revisamos cada ponto com você: como a nossa plataforma e a nossa API se encaixam e o que fica com o laboratório e com a sua equipe.</p></div>
<ul style="flex: 1 1 480px; min-width: 0; list-style: none; margin: 0; padding: 0">{reqs}</ul>
</div>
<p style="margin: 14px 0 0; font-size: 13px; color: #64748B">Resumo informativo, não é assessoria jurídica. Consulte sempre as normas vigentes da Secretaria de Prêmios e Apostas (SPA/MF).</p>
</section>

<!-- COMO FUNCIONA -->
<section style="max-width: 1200px; margin: 0 auto; padding: 96px 24px 0">
{EYE}Como funciona</p>
{H2}Da primeira conversa ao lançamento</h2>
<ol style="list-style: none; margin: 36px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px">{steps}</ol>
</section>

<!-- PERGUNTAS -->
<section style="max-width: 860px; margin: 0 auto; padding: 96px 24px 0">
{EYE}Perguntas frequentes</p>
{H2}Antes de começar</h2>
<div style="margin-top: 28px; border-bottom: 1px solid #E2E8F0">{faq}</div>
</section>

<!-- CTA -->
<section style="max-width: 1200px; margin: 0 auto; padding: 96px 24px 0">
<div style="background: #0B1630; border-radius: 28px; padding: clamp(28px, 5vw, 56px); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 28px">
<div style="flex: 1 1 460px; min-width: 0"><h2 style="margin: 0; {SG}; font-weight: 700; font-size: 36px; line-height: 1.15; letter-spacing: -1px; color: #FFFFFF">Vamos conversar sobre a sua bet.br</h2>
<p style="margin: 12px 0 0; font-size: 17px; color: #AEBCD6">Respondemos em minutos, em português, pelo WhatsApp ou Telegram.</p></div>
<div style="display: flex; flex-wrap: wrap; gap: 10px">{bb.wa_button('waArticle', 'Falar pelo WhatsApp')}{bb.tg_button('Escrever pelo Telegram')}</div>
</div>
<p style="margin: 16px 0 0; font-size: 13px; color: #64748B">Proibido para menores de 18 anos. Jogue com responsabilidade.</p>
</section>
"""


if __name__ == "__main__":
    orig = bb.page
    bb.page = lambda key, lang: "Brasil-PT.dc.html" if key == "brasil" else orig(key, lang)
    name = bb.build("pt", "brasil", "Plataforma e jogos para bets autorizadas no Brasil — ProGaming Solutions", main_html(), WA_MSG, 5200)
    s = open(bb.P + name, encoding="utf-8").read()
    s = s.replace(bb.CUR, bb.NORMAL, 1)  # sem página atual no menu
    # seletor de idioma: ES/EN levam ao início de cada idioma (a página só existe em PT)
    s = s.replace('href="Brasil-PT.dc.html" lang="es"', 'href="Home.dc.html" lang="es"').replace('href="Brasil-PT.dc.html" lang="en"', 'href="Home-EN.dc.html" lang="en"')
    open(bb.P + name, "w", encoding="utf-8").write(s)
    print(name)
