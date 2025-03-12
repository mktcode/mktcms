<script setup lang="ts">
const { targets, addTarget } = usePlanner()
</script>

<template>
  <NuxtLayout name="default">
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Dein Unternehmen
      </h1>
  
      <p class="text-lg text-gray-700 mb-8">
        <span class="italic">Form follows function.</span>
        Hier baust du keine Website, sondern konzentrierst dich auf deine unternehmerische Botschaft und dein Angebot.
        Der Platz dafür ist begrenzt auf die typische Größe eines Smartphone-Bildschirms.
        Das hilft dir dabei, dich auf das Wesentliche zu konzentrieren und platformübergreifend (Website, Online-Anzeigen, Visitenkarten, etc.) einheitliche Botschaften zu senden.
        Der Rest geht dann fast wie von selbst.
      </p>
  
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Nimm dir Zeit
      </h2>
  
      <p class="text-lg text-gray-700 mb-8">
        Es geht darum, den Kern deines Angebots zu formulieren und die Kommunikation mit potentiellen Kunden "auf Linie" zu bringen.
        Das ist nicht einfach. Du solltest also nicht schnell durch die Formulare huschen, sondern dir Zeit nehmen.
        Du brauchst hier auch gar nichts kaufen. Kostenlos kannst du auch einfach ein bisschen "brainstormen".
      </p>
  
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Anschrift
      </h2>
  
      <PlannerAddress />
  
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Domain und E-Mail
      </h2>
  
      <p class="text-lg text-gray-700 mb-8">
        Wenn du bereits eine Domain und ein Postfach hast, gib sie hier ein. Wenn nicht, gib einfach deine Wunsch-Domain ein. Wir kümmern uns später um die Registrierung.
        Das Inhaltliche ist erstmal wichtiger und es beeinflusst vielleicht auch noch die Wahl der Domain.
      </p>
  
      <PlannerDomain />
  
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Inhalte
      </h2>
  
      <PlannerCompany />
  
      <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-24">
        Anzeigen
      </h2>
  
      <p class="text-lg text-gray-700 mb-8">
        Es geht hier nicht darum, jedes einzelne Produkt zu bewerben. Treffe eine Auswahl von speziellen Angeboten, die du hervorheben möchtest.
      </p>
  
      <div class="flex flex-col gap-12 mb-8">
        <PlannerTarget v-for="(target, index) in targets" :key="index" :targetIndex="index" />
      </div>
  
      <UButton @click="addTarget" size="xl">
        Anzeige hinzufügen
      </UButton>
  
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
  </NuxtLayout>
</template>