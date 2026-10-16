<template>
  <q-page class="links-page flex flex-center q-pa-md">
    <div class="rows">
      <template v-for="(link, i) in links" :key="link.url">
        <div class="row-card">
          <div class="row-thumb">
            <img :src="link.image" :alt="link.title" :style="{ objectPosition: link.position }">
          </div>
          <div v-if="link.socials" class="row-body row-body--brand">
            <!-- aici se poate da click doar pe iconițele sociale -->
            <div class="brand-logo">
              <img :src="link.logo" :alt="link.title">
            </div>

            <div class="row-socials">
              <a
                v-for="social in link.socials"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                :class="['social-btn', 'social-' + social.name]"
                :aria-label="social.label"
                :title="social.label"
              >
                <svg v-if="social.name === 'facebook'" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
                </svg>
                <svg v-else-if="social.name === 'instagram'" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
                  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
                </svg>
                <svg v-else-if="social.name === 'youtube'" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M9.5 7.5v9l7.5-4.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div v-else class="row-body">
            <div class="row-sub">{{ link.subtitle }}</div>
            <a :href="link.url" target="_blank" rel="noopener noreferrer" class="row-title row-link">{{ link.title }}</a>
            <div class="row-url">
              {{ link.label }}
              <q-icon name="arrow_outward" size="18px" />
            </div>
          </div>
        </div>

        <!-- cardul de închiriere apare al doilea -->
        <button v-if="i === 0" type="button" class="row-card rental-card" @click="openForm">
          <div class="row-thumb">
            <img :src="rental.image" :alt="rental.subtitle" :style="{ objectPosition: rental.position }">
          </div>
          <div class="row-body">
            <div class="row-sub">{{ rental.subtitle }}</div>
            <div class="row-title">{{ rental.title }}</div>
            <div class="row-url">
              {{ rental.label }}
              <q-icon name="arrow_outward" size="18px" />
            </div>
          </div>
        </button>
      </template>
    </div>

    <rental-dialog v-model="dialogOpen" />

    <router-link to="/confidentialitate" class="policy-link">Politica de confidențialitate</router-link>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { links } from 'src/data/links'
import { rental } from 'src/data/rental'
import RentalDialog from 'components/RentalDialog.vue'

const dialogOpen = ref(false)

function openForm () {
  dialogOpen.value = true
}
</script>

<style scoped>
.links-page {
  position: relative;
  overflow: hidden;
  background-color: #5b4fc4;
  background-image:
    radial-gradient(36rem 36rem at 8% 8%, rgba(236, 72, 153, 0.55), transparent 60%),
    radial-gradient(34rem 34rem at 92% 10%, rgba(251, 146, 60, 0.5), transparent 60%),
    radial-gradient(40rem 40rem at 90% 100%, rgba(56, 189, 248, 0.55), transparent 60%),
    radial-gradient(38rem 38rem at 5% 100%, rgba(45, 212, 191, 0.45), transparent 60%),
    linear-gradient(135deg, #6d5ce8 0%, #4f46e5 50%, #3b5bdb 100%);
}

/* subtle dot grid */
.links-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  pointer-events: none;
}

.rows {
  position: relative;
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.row-card {
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 30px rgba(30, 27, 75, 0.25);
  color: #1e1b4b;
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s;
}

.rental-card {
  border: 0;
  padding: 0;
  width: 100%;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.links-page {
  flex-direction: column;
}

.policy-link {
  position: relative;
  margin-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}

.policy-link:hover {
  color: #fff;
  text-decoration: underline;
}

.row-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 50px rgba(30, 27, 75, 0.35);
}

.row-thumb {
  width: 38%;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.row-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s;
}

.row-card:hover .row-thumb img {
  transform: scale(1.05);
}

.row-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 14px 18px;
}

.row-body--brand {
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 100%;
}

.brand-logo img {
  display: block;
  width: 100%;
  max-width: 170px;
  height: auto;
  margin: 0 auto;
}

.row-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.row-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.row-socials {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(30, 27, 75, 0.25);
  transition: transform 0.2s;
}

.social-btn:hover {
  transform: scale(1.1);
}

.social-btn svg {
  width: 32px;
  height: 32px;
}

.social-facebook {
  background: #1877f2;
}

.social-youtube {
  background: #ff0000;
}

.social-instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);
}

.row-sub {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b5cf6;
}

.row-title {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  margin: 4px 0 8px;
}

.row-url {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #4338ca;
  overflow-wrap: anywhere;
}

/* pe mobil păstrăm layoutul de pe desktop (poza în stânga), doar mai compact */
@media (max-width: 560px) {
  .row-thumb {
    width: 40%;
  }

  .row-body {
    padding: 10px 12px;
  }

  .row-sub {
    font-size: 10px;
  }

  .row-title {
    font-size: 16px;
    margin: 2px 0 6px;
  }

  .row-url {
    font-size: 12px;
  }

  .row-body--brand {
    gap: 10px;
  }

  .brand-logo img {
    max-width: 130px;
  }

  .row-socials {
    gap: 8px;
  }

  .social-btn {
    width: 42px;
    height: 42px;
    border-radius: 11px;
  }

  .social-btn svg {
    width: 24px;
    height: 24px;
  }
}
</style>
