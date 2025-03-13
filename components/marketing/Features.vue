<script setup>
const features = [
  {
    name: 'Werde (gut) gefunden.',
    description:
      'Verwalte dein Google Unternehmensprofil und deine Website in einer App und konzentriere dich dabei auf deine Angebote und Botchaften.',
    icon: 'i-heroicons-map-pin',
  },
  {
    name: 'Auch offline.',
    description: 'Druckdaten für Visitenkarten, Flyer und Preislisten werden automatisch erstellt und können jederzeit gedruckt, aktualisiert und nachbestellt werden.',
    icon: 'i-heroicons-map',
  },
  {
    name: 'Einfache Buchhaltung.',
    description: 'Verwalte Kunden, Lieferanten, Angebote und Rechnungen. Behalte den Überblick über deine Finanzen.',
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
            <h2 class="text-base/7 font-semibold text-sky-600">Alles was du JETZT brauchst</h2>
            <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              Minimal und effektiv
            </p>
            <p class="mt-6 text-lg/8 text-gray-600">
              Mktcms hilft Kleinunternehmern und Gründern, die mit Technik nichts am Hut haben, aber Werbemittel und eine einfache Buchhaltung brauchen.
              Schnell startklar, leicht zu bedienen und Sie haben den Kopf frei fürs Wesentliche.
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
          </div>
        </div>
        <img src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png" alt="Product screenshot" class="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" width="2432" height="1442" />
      </div>
    </div>
  </div>
</template>