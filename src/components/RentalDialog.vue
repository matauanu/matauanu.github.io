<template>
  <q-dialog v-model="open" :persistent="sending" @hide="reset">
    <q-card class="rental-dialog">
      <div class="dialog-scroll">
        <div class="dialog-hero">
          <img :src="rental.image" :alt="rental.subtitle" :style="{ objectPosition: rental.position }">
          <div class="hero-overlay">
            <div class="hero-sub">{{ rental.subtitle }}</div>
            <div class="hero-title">Închiriază-mă!</div>
          </div>
          <q-btn icon="close" flat round dense class="hero-close" aria-label="Închide" :disable="sending" v-close-popup />
        </div>

        <div v-if="sent" class="dialog-body text-center q-py-xl">
          <div class="success-icon">
            <q-icon name="check" size="36px" />
          </div>
          <div class="success-title">Emailul a fost trimis!</div>
          <p class="success-text">
            Mulțumim, {{ sentName }}! Cererea ta a ajuns la noi și te contactăm în cel mai scurt timp.
          </p>
          <q-btn label="Închide" unelevated no-caps class="submit-btn q-mt-sm" v-close-popup />
        </div>

        <q-form v-else ref="formRef" class="dialog-body" @submit="submit">
          <p class="intro">Completează formularul și revenim cu o ofertă.</p>

          <div class="fields">
            <div class="field-row">
              <q-input v-model="form.nume" label="Nume" v-bind="inputProps" :rules="[required]" autocomplete="family-name">
                <template #prepend><q-icon name="person_outline" /></template>
              </q-input>
              <q-input v-model="form.prenume" label="Prenume" v-bind="inputProps" :rules="[required]" autocomplete="given-name" />
            </div>
            <q-input v-model="form.email" type="email" label="Email" v-bind="inputProps" :rules="[required, validEmail]" autocomplete="email">
              <template #prepend><q-icon name="mail_outline" /></template>
            </q-input>
            <q-input v-model="form.telefon" type="tel" label="Telefon" v-bind="inputProps" :rules="[required, validPhone]" autocomplete="tel">
              <template #prepend><q-icon name="phone" /></template>
            </q-input>
            <q-input v-model="form.descriere" type="textarea" label="Detalii cerere" v-bind="inputProps" autogrow
              placeholder="Perioada dorită, ocazia, alte detalii…" input-class="descriere-input" :rules="[required]">
              <template #prepend><q-icon name="notes" /></template>
            </q-input>
          </div>

          <q-field v-model="form.acord" borderless dense hide-bottom-space :rules="[v => v || 'Avem nevoie de acordul tău pentru a procesa cererea']" class="consent-field">
            <template #control>
              <q-toggle v-model="form.acord" color="deep-purple" class="consent-toggle">
                <span class="consent-text">
                  Sunt de acord cu prelucrarea datelor mele personale conform
                  <a :href="policyHref" target="_blank" rel="noopener" @click.stop>Politicii de confidențialitate</a>.
                </span>
              </q-toggle>
            </template>
          </q-field>

          <div ref="captchaEl" class="captcha" />

          <input v-model="honeypot" type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">

          <div v-if="error" class="error-box">
            <q-icon name="error_outline" size="18px" />
            {{ error }}
          </div>

          <q-btn type="submit" unelevated no-caps class="submit-btn full-width" :loading="sending">
            Trimite cererea
            <q-icon name="arrow_forward" size="18px" class="q-ml-xs" />
          </q-btn>
        </q-form>
      </div>

      <q-inner-loading :showing="sending" class="sending-overlay">
        <q-spinner-dots size="48px" color="deep-purple" />
        <div class="sending-text">Se trimite cererea…</div>
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { rental, RENTAL_API_URL, TURNSTILE_SITE_KEY } from 'src/data/rental'

const open = defineModel({ type: Boolean, default: false })

const policyHref = useRouter().resolve('/confidentialitate').href

const inputProps = { outlined: true, dense: true, rounded: true, 'hide-bottom-space': true, 'lazy-rules': true, 'bg-color': 'white', color: 'deep-purple' }

const emptyForm = () => ({ nume: '', prenume: '', email: '', telefon: '', descriere: '', acord: false })

const formRef = ref(null)
const form = reactive(emptyForm())
const sending = ref(false)
const sent = ref(false)
const sentName = ref('')
const error = ref('')
const honeypot = ref('')

// Captcha Cloudflare Turnstile — scriptul se încarcă doar când se deschide formularul
const captchaEl = ref(null)
const captchaToken = ref('')
let widgetId = null
let turnstileScript = null

function loadTurnstile () {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  turnstileScript ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = () => { turnstileScript = null; reject(new Error('Turnstile load failed')) }
    document.head.appendChild(s)
  })
  return turnstileScript
}

watch(captchaEl, async (el) => {
  if (widgetId !== null) window.turnstile?.remove(widgetId)
  widgetId = null
  captchaToken.value = ''
  if (!el) return
  try {
    const turnstile = await loadTurnstile()
    if (captchaEl.value !== el) return
    widgetId = turnstile.render(el, {
      sitekey: TURNSTILE_SITE_KEY,
      language: 'ro',
      theme: 'light',
      size: 'flexible',
      callback: (t) => { captchaToken.value = t },
      'expired-callback': () => { captchaToken.value = '' },
      'error-callback': () => { captchaToken.value = '' }
    })
  } catch {
    error.value = 'Verificarea anti-robot nu s-a putut încărca. Reîncarcă pagina.'
  }
})

const required = (v) => !!(v && v.trim()) || 'Câmp obligatoriu'
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email invalid'
const validPhone = (v) => /^\+?[\d\s().-]{9,}$/.test(v) || 'Număr de telefon invalid'

// Golește formularul la închiderea modalului
function reset () {
  Object.assign(form, emptyForm())
  honeypot.value = ''
  sent.value = false
  error.value = ''
}

async function submit () {
  if (!captchaToken.value) {
    error.value = 'Te rugăm să aștepți finalizarea verificării anti-robot.'
    return
  }
  sending.value = true
  error.value = ''
  try {
    const res = await fetch(RENTAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, website: honeypot.value, turnstile: captchaToken.value })
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    sentName.value = form.prenume
    sent.value = true
  } catch (e) {
    error.value = 'Nu am putut trimite cererea. Te rugăm să încerci din nou.'
    // tokenul captcha e de unică folosință
    captchaToken.value = ''
    if (widgetId !== null) window.turnstile?.reset(widgetId)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.rental-dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 32px);
  max-height: calc(100dvh - 32px);
  width: 100%;
  max-width: 460px;
  border-radius: 22px;
  overflow: hidden;
  background: #f7f6fd;
  box-shadow: 0 30px 80px rgba(30, 27, 75, 0.45);
}

.dialog-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.dialog-hero {
  position: relative;
  height: 190px;
}

.dialog-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 12px 20px;
  color: #fff;
  background: linear-gradient(180deg, transparent 20%, rgba(30, 27, 75, 0.85) 100%);
}

.hero-sub {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.85;
}

.hero-title {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.1;
}

.hero-close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);
}

.dialog-body {
  padding: 14px 20px 18px;
}

.intro {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.fields :deep(.q-field--outlined .q-field__control:before) {
  border-color: #e4e2f3;
}

/* ascunde fundalul albastru pus de browser la autofill */
.fields :deep(input:-webkit-autofill),
.fields :deep(input:-webkit-autofill:hover),
.fields :deep(input:-webkit-autofill:focus),
.fields :deep(textarea:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px #fff inset;
  box-shadow: 0 0 0 1000px #fff inset;
  -webkit-text-fill-color: #1e1b4b;
  caret-color: #1e1b4b;
  transition: background-color 9999s ease-out 0s;
}

.fields :deep(input:autofill) {
  box-shadow: 0 0 0 1000px #fff inset;
}

.fields :deep(.descriere-input) {
  min-height: 48px;
}

.consent-field {
  margin-top: 8px;
}

.consent-toggle {
  align-items: flex-start;
}

.consent-text {
  display: block;
  font-size: 12px;
  line-height: 1.4;
  color: #4b5563;
  padding-top: 6px;
}

.consent-text a {
  color: #6d28d9;
  font-weight: 600;
}

.captcha {
  margin-top: 10px;
  min-height: 65px;
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: #b91c1c;
  background: #fee2e2;
}

.submit-btn {
  margin-top: 12px;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #4f46e5 100%);
  box-shadow: 0 10px 24px rgba(109, 40, 217, 0.35);
}

.sending-overlay {
  background: rgba(247, 246, 253, 0.85);
  backdrop-filter: blur(2px);
}

.sending-text {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #4c1d95;
}

.success-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, #2dd4bf, #10b981);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.35);
}

.success-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e1b4b;
}

.success-text {
  margin: 6px 0 0;
  color: #6b7280;
}

@media (max-height: 700px) {
  .dialog-hero {
    height: 140px;
  }
}

@media (max-width: 420px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
