<template>
  <q-page class="links-page flex flex-center q-pa-md">
    <div class="rows">
      <a
        v-for="link in links"
        :key="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="row-card"
      >
        <div class="row-thumb">
          <img :src="link.image" :alt="link.title" :style="{ objectPosition: link.position }">
        </div>
        <div class="row-body">
          <div class="row-sub">{{ link.subtitle }}</div>
          <div class="row-title">{{ link.title }}</div>
          <div class="row-url">
            {{ link.label }}
            <q-icon name="arrow_outward" size="18px" />
          </div>
        </div>
      </a>
    </div>
  </q-page>
</template>

<script setup>
import { links } from 'src/data/links'
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
  display: flex;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 10px 30px rgba(30, 27, 75, 0.25);
  color: #1e1b4b;
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s;
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

@media (max-width: 560px) {
  .row-card {
    flex-direction: column;
  }

  .row-thumb {
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .row-body {
    padding: 12px 16px 14px;
  }
}
</style>
