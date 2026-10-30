"""Genera la Política de privacidad (ES/EN/PT) con el mismo diseño del sitio.
uso: python3 legal_build.py   (publicar.py lo corre solo)"""
import html
import blog_build as bb

UPDATED = {"es": "30 de octubre de 2026", "en": "October 30, 2026", "pt": "30 de outubro de 2026"}
TITLE = {"es": "Política de privacidad", "en": "Privacy policy", "pt": "Política de privacidade"}
LEAD = {
    "es": "Cómo tratamos la información de quienes visitan progamingsolutions.net y nos contactan.",
    "en": "How we handle the information of people who visit progamingsolutions.net and contact us.",
    "pt": "Como tratamos as informações de quem visita progamingsolutions.net e entra em contato conosco.",
}
UPD = {"es": "Última actualización", "en": "Last updated", "pt": "Última atualização"}

BODY = {
"es": """
<h2>1. Quiénes somos</h2>
<p>ProGaming Solutions (en adelante, "nosotros") ofrece tecnología para operadores de juego online: plataformas personalizadas, venta de fichas, integraciones API y chat integrado. Somos responsables del tratamiento de los datos descritos en esta política. Puedes escribirnos a <strong>progamingsolutions@gmail.com</strong> por cualquier consulta sobre tus datos.</p>
<h2>2. Qué información recopilamos</h2>
<ul>
<li><strong>Datos que nos envías:</strong> cuando nos escribes por WhatsApp, Telegram o correo, recibimos tu nombre, número o usuario, y lo que nos cuentes en el mensaje (por ejemplo, el servicio que te interesa o el nombre de tu plataforma). Este sitio no tiene formularios que guarden datos en nuestros servidores: los botones abren la aplicación que elijas con el mensaje ya escrito.</li>
<li><strong>Datos de navegación:</strong> páginas visitadas, botones en los que haces clic, tipo de dispositivo y navegador, dirección IP aproximada y la página desde la que llegaste.</li>
</ul>
<h2>3. Cookies y herramientas de medición</h2>
<ul>
<li><strong>Meta Pixel</strong> (Meta Platforms): mide las visitas y los clics en los botones de WhatsApp para saber qué anuncios funcionan y mostrar anuncios a personas interesadas. Usa cookies y puede asociar la visita con tu cuenta de Facebook o Instagram según la política de Meta.</li>
<li><strong>Cloudflare:</strong> aloja el sitio y registra datos técnicos (como la dirección IP) para entregar las páginas y proteger el sitio contra ataques.</li>
<li><strong>Google Fonts:</strong> carga las tipografías del sitio; tu navegador se conecta a los servidores de Google para descargarlas.</li>
</ul>
<p>Puedes bloquear o borrar las cookies desde la configuración de tu navegador, y gestionar los anuncios que ves en la configuración de anuncios de tu cuenta de Meta.</p>
<h2>4. Para qué usamos la información</h2>
<ul>
<li>Responder tus consultas y enviarte la información, demos o propuestas que pidas.</li>
<li>Dar seguimiento comercial y soporte a clientes.</li>
<li>Medir el uso del sitio y el resultado de nuestras campañas para mejorarlas.</li>
<li>Proteger el sitio y cumplir obligaciones legales.</li>
</ul>
<p>No vendemos tus datos personales.</p>
<h2>5. Con quién la compartimos</h2>
<p>Solo con los proveedores que necesitamos para operar: servicios de mensajería (WhatsApp, Telegram, correo), nuestra herramienta de gestión de clientes, Cloudflare y Meta. Cada uno trata los datos según sus propias políticas de privacidad. También podemos compartirla cuando una autoridad competente lo exija por ley.</p>
<h2>6. Cuánto tiempo la conservamos</h2>
<p>Conservamos tus datos de contacto mientras exista una relación comercial o una conversación activa, y luego el tiempo que exija la ley. Puedes pedirnos que los eliminemos antes.</p>
<h2>7. Tus derechos</h2>
<p>Puedes pedirnos acceder a tus datos, corregirlos, actualizarlos o eliminarlos, y retirar tu autorización para que te contactemos. Escríbenos a <strong>progamingsolutions@gmail.com</strong> y te responderemos en un plazo razonable. Según tu país, también puedes acudir a la autoridad de protección de datos correspondiente.</p>
<h2>8. Mayores de edad</h2>
<p>Nuestros servicios están dirigidos a empresas y personas mayores de 18 años. No recopilamos a sabiendas datos de menores de edad.</p>
<h2>9. Cambios en esta política</h2>
<p>Podemos actualizar esta política. Publicaremos aquí la versión vigente con su fecha de actualización.</p>
""",
"en": """
<h2>1. Who we are</h2>
<p>ProGaming Solutions ("we") provides technology for online gaming operators: custom platforms, credit sales, API integrations and built-in chat. We are responsible for processing the data described in this policy. You can write to <strong>progamingsolutions@gmail.com</strong> with any question about your data.</p>
<h2>2. What information we collect</h2>
<ul>
<li><strong>Data you send us:</strong> when you message us on WhatsApp, Telegram or email, we receive your name, number or username, and whatever you tell us in your message (for example, the service you are interested in or the name of your platform). This site has no forms that store data on our servers: the buttons open the app you choose with the message already written.</li>
<li><strong>Browsing data:</strong> pages visited, buttons you click, device and browser type, approximate IP address and the page you came from.</li>
</ul>
<h2>3. Cookies and measurement tools</h2>
<ul>
<li><strong>Meta Pixel</strong> (Meta Platforms): measures visits and clicks on the WhatsApp buttons so we know which ads work and can show ads to interested people. It uses cookies and may link the visit to your Facebook or Instagram account under Meta's policy.</li>
<li><strong>Cloudflare:</strong> hosts the site and logs technical data (such as the IP address) to deliver the pages and protect the site against attacks.</li>
<li><strong>Google Fonts:</strong> loads the site's typefaces; your browser connects to Google's servers to download them.</li>
</ul>
<p>You can block or delete cookies in your browser settings, and manage the ads you see in your Meta account's ad settings.</p>
<h2>4. How we use the information</h2>
<ul>
<li>To answer your questions and send you the information, demos or proposals you request.</li>
<li>For sales follow-up and customer support.</li>
<li>To measure site usage and the results of our campaigns in order to improve them.</li>
<li>To protect the site and comply with legal obligations.</li>
</ul>
<p>We do not sell your personal data.</p>
<h2>5. Who we share it with</h2>
<p>Only with the providers we need to operate: messaging services (WhatsApp, Telegram, email), our customer management tool, Cloudflare and Meta. Each processes the data under its own privacy policy. We may also share it when a competent authority requires it by law.</p>
<h2>6. How long we keep it</h2>
<p>We keep your contact data while there is a business relationship or an active conversation, and afterwards for as long as the law requires. You can ask us to delete it sooner.</p>
<h2>7. Your rights</h2>
<p>You can ask us to access, correct, update or delete your data, and withdraw your permission for us to contact you. Write to <strong>progamingsolutions@gmail.com</strong> and we will reply within a reasonable time. Depending on your country, you can also contact the relevant data protection authority.</p>
<h2>8. Adults only</h2>
<p>Our services are intended for businesses and people aged 18 or over. We do not knowingly collect data from minors.</p>
<h2>9. Changes to this policy</h2>
<p>We may update this policy. We will publish the current version here with its update date.</p>
""",
"pt": """
<h2>1. Quem somos</h2>
<p>A ProGaming Solutions ("nós") oferece tecnologia para operadores de jogos online: plataformas personalizadas, venda de fichas, integrações via API e chat integrado. Somos responsáveis pelo tratamento dos dados descritos nesta política. Você pode escrever para <strong>progamingsolutions@gmail.com</strong> com qualquer dúvida sobre seus dados.</p>
<h2>2. Quais informações coletamos</h2>
<ul>
<li><strong>Dados que você nos envia:</strong> quando você fala conosco pelo WhatsApp, Telegram ou e-mail, recebemos seu nome, número ou usuário e o que você nos contar na mensagem (por exemplo, o serviço que te interessa ou o nome da sua plataforma). Este site não tem formulários que guardem dados em nossos servidores: os botões abrem o aplicativo que você escolher com a mensagem já escrita.</li>
<li><strong>Dados de navegação:</strong> páginas visitadas, botões em que você clica, tipo de dispositivo e navegador, endereço IP aproximado e a página de onde você veio.</li>
</ul>
<h2>3. Cookies e ferramentas de medição</h2>
<ul>
<li><strong>Meta Pixel</strong> (Meta Platforms): mede as visitas e os cliques nos botões de WhatsApp para sabermos quais anúncios funcionam e mostrar anúncios a pessoas interessadas. Usa cookies e pode associar a visita à sua conta do Facebook ou Instagram conforme a política da Meta.</li>
<li><strong>Cloudflare:</strong> hospeda o site e registra dados técnicos (como o endereço IP) para entregar as páginas e proteger o site contra ataques.</li>
<li><strong>Google Fonts:</strong> carrega as fontes do site; seu navegador se conecta aos servidores do Google para baixá-las.</li>
</ul>
<p>Você pode bloquear ou apagar os cookies nas configurações do seu navegador e gerenciar os anúncios que vê nas configurações de anúncios da sua conta Meta.</p>
<h2>4. Para que usamos as informações</h2>
<ul>
<li>Responder às suas dúvidas e enviar as informações, demos ou propostas que você pedir.</li>
<li>Fazer o acompanhamento comercial e o suporte aos clientes.</li>
<li>Medir o uso do site e o resultado das nossas campanhas para melhorá-las.</li>
<li>Proteger o site e cumprir obrigações legais.</li>
</ul>
<p>Não vendemos seus dados pessoais.</p>
<h2>5. Com quem compartilhamos</h2>
<p>Apenas com os fornecedores de que precisamos para operar: serviços de mensagens (WhatsApp, Telegram, e-mail), nossa ferramenta de gestão de clientes, Cloudflare e Meta. Cada um trata os dados conforme sua própria política de privacidade. Também podemos compartilhá-los quando uma autoridade competente exigir por lei.</p>
<h2>6. Por quanto tempo guardamos</h2>
<p>Guardamos seus dados de contato enquanto houver uma relação comercial ou uma conversa ativa e, depois, pelo tempo exigido por lei. Você pode nos pedir que os excluamos antes.</p>
<h2>7. Seus direitos</h2>
<p>Você pode nos pedir para acessar, corrigir, atualizar ou excluir seus dados e retirar sua autorização para que entremos em contato. Escreva para <strong>progamingsolutions@gmail.com</strong> e responderemos em um prazo razoável. Conforme o seu país, você também pode recorrer à autoridade de proteção de dados correspondente (no Brasil, a ANPD).</p>
<h2>8. Maiores de idade</h2>
<p>Nossos serviços são destinados a empresas e pessoas maiores de 18 anos. Não coletamos intencionalmente dados de menores de idade.</p>
<h2>9. Alterações nesta política</h2>
<p>Podemos atualizar esta política. Publicaremos aqui a versão vigente com sua data de atualização.</p>
""",
}


def main_html(lang):
    return f"""<!-- PRIVACIDAD -->
<section id="inicio" style="max-width: 1200px; margin: 0 auto; padding: 80px 24px 0">
<p style="margin: 0 0 18px; font-size: 13px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: {{{{accent}}}}">{TITLE[lang]}</p>
<h1 style="margin: 0; {bb.SG}; font-weight: 700; font-size: 52px; line-height: 1.08; letter-spacing: -1.4px; color: #0B1630; max-width: 860px">{TITLE[lang]}</h1>
<p style="margin: 20px 0 0; font-size: 19px; color: #475569; max-width: 680px">{LEAD[lang]}</p>
<p style="margin: 14px 0 0; font-size: 14px; color: #64748B">{UPD[lang]}: {UPDATED[lang]}</p>
</section>
<article style="max-width: 800px; margin: 0 auto; padding: 48px 24px 0">
<div class="pg-prose">
{BODY[lang].strip()}
</div>
</article>
"""


if __name__ == "__main__":
    orig = bb.page
    bb.page = lambda key, lang: f"Privacidad{bb.SUF[lang]}.dc.html" if key == "privacidad" else orig(key, lang)
    for lang in ("es", "en", "pt"):
        name = bb.build(lang, "privacidad", f"{TITLE[lang]} — ProGaming Solutions", main_html(lang), bb.UI[lang]["wa_gen"], 3800)
        s = open(bb.P + name, encoding="utf-8").read()
        # en el menú no hay página actual (la marca de Blog que pone build() se quita)
        s = s.replace(bb.CUR, bb.NORMAL, 1)
        open(bb.P + name, "w", encoding="utf-8").write(s)
        print(name)
