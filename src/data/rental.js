const base = import.meta.env.BASE_URL

// URL-ul Cloudflare Worker-ului din /worker, care trimite emailul prin Resend.
// Îl primești după `npx wrangler deploy`.
export const RENTAL_API_URL = 'https://delafun-rental.delafun.workers.dev'

// Cheia publică (site key) a widget-ului Cloudflare Turnstile (captcha)
export const TURNSTILE_SITE_KEY = '0x4AAAAAAFXjXQMGA6jwJqQM'

export const rental = {
  title: 'Închiriază-mă!',
  subtitle: 'Tesla Cybertruck',
  label: 'Trimite o cerere',
  image: base + 'thumbnails/cybertruck.jpg',
  position: '60% 60%'
}
