<script setup lang="ts">
const features = [
  {
    name: 'Werde gefunden.',
    description:
      'Verwalte dein Google Unternehmensprofil und deine Website in einer App und konzentriere dich dabei auf deine Angebote und Botschaften.',
    icon: 'i-heroicons-map-pin',
  },
  {
    name: 'Auch offline.',
    description: 'Druckdaten für Visitenkarten, Flyer und Preislisten werden automatisch erstellt und können jederzeit gedruckt, aktualisiert und nachbestellt werden.',
    icon: 'i-heroicons-map',
  },
  {
    name: 'Einfache Buchhaltung.',
    description: 'Verwalte Kunden und Lieferanten, Angebote und (E-)Rechnungen und behalte den Überblick über Einnahmen und Ausgaben.',
    icon: 'i-heroicons-scale',
  },
  {
    name: 'Solidarisches Preismodel.',
    description: 'Zahle nur so viel, wie es dir wert ist und wie du kannst. Du lädst Guthaben auf und kannst den Preis jederzeit anpassen.',
    icon: 'i-lucide-heart-handshake',
  },
]

const screenshots = [
  '/marketing/screenshots/screenshot.png',
  '/marketing/screenshots/screenshot.png',
  '/marketing/screenshots/screenshot.png',
]
</script>

<template>
  <div class="overflow-hidden bg-white py-12">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div class="lg:pt-4 lg:pr-8">
          <div class="lg:max-w-lg">
            <h2 class="text-base/7 font-semibold text-primary-600">Für Einsteiger</h2>
            <p class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Werbung und Buchhaltung in einer App
            </p>
            <p class="mt-6 text-lg/8 text-gray-600">
              Solihost hilft Einzelunternehmern, die nicht gerne am Computer sitzen und klare, übersichtliche Lösungen schätzen.
              Sofort startklar, sehr leicht zu bedienen und Sie haben den Kopf frei fürs Wesentliche.
            </p>
            <dl class="flex  flex-col mt-10 max-w-xl gap-4 text-base/7 text-gray-600 lg:max-w-none">
              <div v-for="feature in features" :key="feature.name" class="relative pl-9">
                <dt class="inline font-semibold text-gray-900">
                  <UIcon :name="feature.icon" class="absolute top-1 left-1 size-5 text-primary-600" />
                  {{ feature.name }}
                </dt>
                {{ ' ' }}
                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div>
          <UCarousel
            v-slot="{ item }"
            dots
            :items="screenshots"
            class=""
            :ui="{
              viewport: 'w-[48rem] sm:w-[57rem] overflow-hidden shadow-xl shadow-black/5 rounded-xl border border-gray-200',
              controls: 'relative',
              dot: 'bg-gray-200',
            }"
          >
            <img :src="item" class="rounded-xl " />
          </UCarousel>
          <div class="w-full flex flex-col items-center justify-center mt-8">
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
              <UButton size="xl" to="/login" class="w-full sm:w-auto" icon="i-heroicons-rocket-launch">
                Kostenlos testen
              </UButton>
              <UButton size="xl" variant="outline" class="w-full sm:w-auto" icon="i-heroicons-device-phone-mobile" disabled>
                App installieren
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>