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
]
</script>

<template>
  <div class="overflow-hidden bg-white py-12">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div class="lg:pt-4 lg:pr-8">
          <div class="lg:max-w-lg">
            <h2 class="text-base/7 font-semibold text-sky-600">Für Einsteiger</h2>
            <p class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
              Werbung und Buchhaltung in einer App
            </p>
            <p class="mt-6 text-lg/8 text-gray-600">
              Mkt's CMS hilft Einzelunternehmern, die nicht gerne am Computer sitzen und klare, übersichtliche Lösungen schätzen.
              Sofort startklar, sehr leicht zu bedienen und Sie haben den Kopf frei fürs Wesentliche.
            </p>
            <dl class="flex  flex-col mt-10 max-w-xl gap-4 text-base/7 text-gray-600 lg:max-w-none">
              <div v-for="feature in features" :key="feature.name" class="relative pl-9">
                <dt class="inline font-semibold text-gray-900">
                  <UIcon :name="feature.icon" class="absolute top-1 left-1 size-5 text-sky-600" />
                  {{ feature.name }}
                </dt>
                {{ ' ' }}
                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
            <div class="flex justify-center items-center gap-4 mt-10">
              <UButton size="xl" to="/start">
                Jetzt kostenlos testen
              </UButton>
              <UButton size="xl" variant="outline">
                App installieren
              </UButton>
            </div>
          </div>
        </div>
        <img
          src="~/assets/img/screenshot.png"
          alt="Product screenshot"
          class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
        />
      </div>
    </div>
  </div>
</template>