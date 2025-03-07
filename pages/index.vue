<script setup lang="ts">
import { CheckIcon, PhotoIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-4">
      Dein Unternehmen
    </h1>

    <p class="text-lg text-gray-700 mb-8">
      <span class="italic">Form follows function.</span> Bevor wir uns an die Ausgestaltung der Details machen, sollte zunächst ein einheitliches Verständnis über dein Unternehmen hergestellt werden und darüber, wie du deine Kunden ansprechen möchtest.
    </p>

    <p class="text-lg text-gray-700 mb-8">
      Hier kannst du deine unternehmerische Hauptbotschaft bearbeiten und spezielle Anzeigen planen.
      Der Platz ist begrenzt auf die typische Größe eines Smartphone-Bildschirms.
      Das hilft dir dabei, dich auf das Wesentliche zu konzentrieren und platformübergreifend (Online-Anzeigen, Visitenkarten, etc.) einheitliche Botschaften zu senden.
      Es wird nichts direkt veröffentlicht, sondern dient nur zur Planung und Konzentration.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Domain und E-Mail
    </h2>

    <p class="text-lg text-gray-700 mb-8">
      Vielleicht hast du schon eine Domain registriert, brauchst aber noch E-Mail-Postfächer, vielleicht beides.
      Vielleicht nutzt du auch schon ein kostenloses E-Mail-Postfach, aber möchtest eine professionelle Domain.
      Wenn du schon versorgt bist, super! Dann musst du später nur eine kleine Einstellung bei deinem Domain-Anbieter vornehmen.
    </p>

    <div class="flex gap-4 mb-8">
      <button class="button">
        <CheckIcon class="size-5 opacity-50" />
        Ich brauche beides.
      </button>
      <button class="button light">
        Ich bin versorgt.
      </button>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Texte und Bilder
    </h2>

    <label for="logo" class="block text-sm font-medium text-gray-700">
      Bilder
    </label>
    <div class="text-sm text-gray-500 mb-3">
      Dein Logo, ein Bild von dir oder deinem Team, ein Bild von deinem Laden oder deinen Produkten.
      Am besten professionelle Bilder in hoher Auflösung.
    </div>
    <div class="bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center h-48 mb-3">
      <div class="text-center">
        <PhotoIcon class="h-12 w-12 text-gray-300 mx-auto" />
        <div class="text-sm text-gray-400">
          Bilder hier ablegen oder klicken
        </div>
      </div>
    </div>

    <div class="flex gap-4 mb-8">
      <div class="rounded-lg overflow-hidden">
        <img src="~/assets/img/default-header.jpg" alt="Header" class="w-24 aspect-video object-cover" />
      </div>
    </div>

    <PlannerCompany />

    <h1 class="text-3xl font-bold text-gray-900 mb-4 mt-24">
      Anzeigen
    </h1>

    <p class="text-lg text-gray-700 mb-8">
      Es geht hier nicht darum, jedes einzelne Produkt zu bewerben. Treffe eine Auswahl von speziellen Angeboten, die du hervorheben möchtest.
    </p>

    <PlannerTarget />

    <h1 class="text-3xl font-bold text-gray-900 mb-4 mt-24">
      Druckdaten
    </h1>

    <p class="text-lg text-gray-700 mb-8">
      Drucken Sie Ihre Inhalte auf Flyer und Visitenkarten. Die Vorschau unten dient nur zur Orientierung.
      Die Druckdaten werden später von Hand optimiert und durch Sie final abgenommen.
    </p>

    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Visitenkarte
    </h2>

    <PlannerVcard />

    <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-24">
      Flyer
    </h2>

    <PlannerFlyer />

    <PlannerOrder />
  </div>
</template>