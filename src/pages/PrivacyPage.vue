<template>
  <q-page class="privacy-page q-pa-md">
    <article class="privacy-card">
      <router-link to="/" class="back-link">
        <q-icon name="arrow_back" size="18px" /> Înapoi
      </router-link>

      <h1>Politica de confidențialitate</h1>
      <p class="updated">Ultima actualizare: {{ company.lastUpdated }}</p>

      <p>
        Această politică explică ce date personale colectăm prin formularul „Închiriază-mă!” de pe acest site,
        de ce le colectăm și ce drepturi ai, în conformitate cu Regulamentul (UE) 2016/679 (GDPR).
      </p>

      <h2>1. Cine este operatorul datelor</h2>
      <p>
        {{ company.name }}, CUI {{ company.cui }}, {{ company.regCom }}, cu sediul în {{ company.address }}.<br>
        Contact: <a :href="'mailto:' + company.email">{{ company.email }}</a><template v-if="company.phone">, telefon {{ company.phone }}</template>.
      </p>

      <h2>2. Ce date colectăm</h2>
      <p>Prin formularul de închiriere colectăm doar datele pe care ni le transmiți tu:</p>
      <ul>
        <li>nume și prenume;</li>
        <li>adresa de email;</li>
        <li>numărul de telefon;</li>
        <li>descrierea cererii (perioada, ocazia și alte detalii pe care alegi să le incluzi).</li>
      </ul>
      <p>Te rugăm să nu incluzi în descriere date sensibile (CNP, date despre sănătate etc.).</p>

      <h2>3. De ce le folosim și pe ce temei</h2>
      <ul>
        <li>
          <strong>Pentru a răspunde cererii tale de închiriere</strong> și a-ți trimite o ofertă. Temei: demersuri
          la cererea ta înainte de încheierea unui contract (art. 6 alin. (1) lit. b GDPR) și consimțământul tău
          (art. 6 alin. (1) lit. a GDPR).
        </li>
      </ul>
      <p>Nu folosim datele pentru marketing și nu le vindem.</p>

      <h2>4. Cui transmitem datele</h2>
      <p>
        Formularul este transmis printr-un serviciu găzduit pe <strong>Cloudflare</strong>, iar emailul ne este
        livrat prin <strong>Resend</strong>. Ambii furnizori acționează ca persoane împuternicite și nu folosesc
        datele în alte scopuri; datele nu sunt stocate de noi în afara căsuței de email. Datele pot fi transferate
        în afara Spațiului Economic European, cu garanțiile prevăzute de GDPR (de ex. clauze contractuale standard).
      </p>

      <p>
        Pentru protecția împotriva spam-ului, formularul folosește <strong>Cloudflare Turnstile</strong>, care
        analizează semnale tehnice ale browserului (de ex. adresa IP) doar pentru a verifica dacă cererea vine
        de la o persoană reală.
      </p>

      <h2>5. Cât timp păstrăm datele</h2>
      <p>
        Păstrăm cererea cel mult 12 luni de la ultima comunicare, dacă nu se încheie un contract. Dacă închiriezi
        mașina, datele se păstrează conform obligațiilor legale aplicabile contractului (inclusiv cele fiscale).
      </p>

      <h2>6. Drepturile tale</h2>
      <p>Ai dreptul:</p>
      <ul>
        <li>să accesezi datele tale și să primești o copie;</li>
        <li>să ceri rectificarea sau ștergerea lor;</li>
        <li>să restricționezi prelucrarea sau să te opui acesteia;</li>
        <li>la portabilitatea datelor;</li>
        <li>să îți retragi oricând consimțământul, fără a afecta legalitatea prelucrării anterioare.</li>
      </ul>
      <p>
        Pentru oricare dintre acestea scrie-ne la <a :href="'mailto:' + company.email">{{ company.email }}</a>.
        Îți răspundem în cel mult 30 de zile.
      </p>
      <p>
        Ai și dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
        Caracter Personal (ANSPDCP), <a href="https://www.dataprotection.ro" target="_blank" rel="noopener">www.dataprotection.ro</a>.
      </p>

      <h2>7. Cookie-uri</h2>
      <p>Acest site nu folosește cookie-uri de urmărire sau de marketing.</p>
    </article>
  </q-page>
</template>

<script setup>
import { company } from 'src/data/company'
</script>

<style scoped>
.privacy-page {
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #6d5ce8 0%, #4f46e5 50%, #3b5bdb 100%);
}

.privacy-card {
  width: 100%;
  max-width: 720px;
  margin: 24px 0;
  padding: 28px 32px;
  border-radius: 22px;
  background: #fff;
  color: #374151;
  font-size: 15px;
  line-height: 1.65;
  box-shadow: 0 20px 50px rgba(30, 27, 75, 0.3);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #6d28d9;
  text-decoration: none;
}

h1 {
  margin: 16px 0 4px;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: #1e1b4b;
}

h2 {
  margin: 28px 0 8px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #1e1b4b;
}

.updated {
  font-size: 13px;
  color: #9ca3af;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}

a {
  color: #6d28d9;
}

@media (max-width: 560px) {
  .privacy-card {
    margin: 8px 0;
    padding: 22px 18px;
  }
}
</style>
