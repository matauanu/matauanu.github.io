// Primește cererile de închiriere de pe site și le trimite pe email prin Resend.

const FIELDS = ['nume', 'prenume', 'email', 'telefon', 'descriere']
const MAX_LEN = { nume: 80, prenume: 80, email: 120, telefon: 30, descriere: 3000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  async fetch (request, env) {
    const origin = request.headers.get('Origin') || ''
    const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin'
    }
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'POST') return json({ success: false, message: 'Method not allowed' }, 405)
    if (!allowed.includes(origin)) return json({ success: false, message: 'Forbidden' }, 403)

    let data
    try {
      data = await request.json()
    } catch {
      return json({ success: false, message: 'JSON invalid' }, 400)
    }

    // Honeypot: câmp ascuns pe care doar boții îl completează
    if (data.website) return json({ success: true })

    // Verificare captcha Cloudflare Turnstile
    if (!(await verifyTurnstile(data.turnstile, request, env))) {
      return json({ success: false, message: 'Verificarea anti-robot a eșuat' }, 403)
    }

    const form = {}
    for (const f of FIELDS) {
      const v = typeof data[f] === 'string' ? data[f].trim() : ''
      if (!v || v.length > MAX_LEN[f]) return json({ success: false, message: `Câmp invalid: ${f}` }, 400)
      form[f] = v
    }
    if (!EMAIL_RE.test(form.email)) return json({ success: false, message: 'Email invalid' }, 400)
    if (data.acord !== true) return json({ success: false, message: 'Lipsește acordul GDPR' }, 400)

    const receivedAt = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        reply_to: form.email,
        subject: `Cerere închiriere Cybertruck — ${form.nume} ${form.prenume}`,
        html: renderHtml(form, receivedAt),
        text: renderText(form, receivedAt)
      })
    })

    if (!res.ok) {
      console.error('Resend error', res.status, await res.text())
      return json({ success: false, message: 'Trimiterea a eșuat' }, 502)
    }
    return json({ success: true })
  }
}

async function verifyTurnstile (token, request, env) {
  if (typeof token !== 'string' || !token) return false
  const body = new FormData()
  body.append('secret', env.TURNSTILE_SECRET)
  body.append('response', token)
  const ip = request.headers.get('CF-Connecting-IP')
  if (ip) body.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
  const outcome = await res.json()
  return outcome.success === true
}

const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function renderText (f, at) {
  return `Cerere nouă de închiriere Cybertruck

Nume: ${f.nume} ${f.prenume}
Email: ${f.email}
Telefon: ${f.telefon}

Detalii:
${f.descriere}

Acord prelucrare date: Da (${at})
Răspunde la acest email pentru a-i scrie direct clientului.`
}

function renderHtml (f, at) {
  const row = (label, value) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eeecf8;color:#8b5cf6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;width:110px;vertical-align:top">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eeecf8;color:#1e1b4b;font-size:15px">${value}</td>
    </tr>`
  const tel = esc(f.telefon)
  const telHref = f.telefon.replace(/[^\d+]/g, '')

  return `<!doctype html>
<html lang="ro">
<body style="margin:0;padding:24px 12px;background:#f3f2fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(30,27,75,.12)">
    <tr>
      <td style="padding:24px 28px;background:#4f46e5;background-image:linear-gradient(135deg,#ec4899 0%,#8b5cf6 50%,#4f46e5 100%);color:#ffffff">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.85">Tesla Cybertruck</div>
        <div style="font-size:24px;font-weight:800;margin-top:4px">Cerere nouă de închiriere</div>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 28px 4px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Nume', `${esc(f.nume)} ${esc(f.prenume)}`)}
          ${row('Email', `<a href="mailto:${esc(f.email)}" style="color:#4f46e5">${esc(f.email)}</a>`)}
          ${row('Telefon', `<a href="tel:${telHref}" style="color:#4f46e5">${tel}</a>`)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 8px">
        <div style="color:#8b5cf6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Detalii cerere</div>
        <div style="padding:14px 16px;background:#f7f6fd;border-radius:12px;color:#1e1b4b;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(f.descriere)}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 24px">
        <a href="mailto:${esc(f.email)}" style="display:inline-block;padding:10px 20px;border-radius:999px;background:#6d28d9;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none">Răspunde clientului</a>
        <a href="tel:${telHref}" style="display:inline-block;margin-left:8px;padding:10px 20px;border-radius:999px;border:1px solid #d9d6f2;color:#4f46e5;font-weight:700;font-size:14px;text-decoration:none">Sună</a>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 28px;background:#faf9ff;color:#9ca3af;font-size:12px">
        Primită pe ${esc(at)} · Acord prelucrare date: Da
      </td>
    </tr>
  </table>
</body>
</html>`
}
