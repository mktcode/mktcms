<script setup lang="ts">
import { PlannerTarget } from '#components';
import { ArrowsPointingOutIcon, CheckIcon, IdentificationIcon, MapPinIcon, MegaphoneIcon, PhotoIcon } from '@heroicons/vue/24/outline'

const logo = ref<string>('');
const logoWidth = ref<number>(100);
const title = ref<string>('Markus Kottländer');
const subtitle = ref<string>('Software und Internet');
const slogan = ref<string>('Ein Programmierer zum anfassen!');
const description = ref<string>('Ich biete Softwareentwicklung und Beratung bei Online-Projekten an.');
const ctaType = ref<number>(0);
const phone = ref<string>('');
const email = ref<string>('');
const link = ref<string>('');
const keywords = ref<string>('');

const showCtaButton = computed(() => {
  if (ctaType.value === 0 && phone.value) {
    return true;
  }

  if (ctaType.value === 1 && email.value) {
    return true;
  }

  if (ctaType.value === 2 && link.value) {
    return true;
  }

  return false;
});

const ctyTypes = [
  {
    id: 0,
    name: 'per Telefon',
  },
  {
    id: 1,
    name: 'per E-Mail',
  },
  {
    id: 2,
    name: 'Auf folgender Website',
  }
]
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-4">
      Willkommen
    </h1>

    <p class="text-lg text-gray-700 mb-8">
      Hier kannst du deine unternehmerische Hauptbotschaft bearbeiten.
      Der Platz ist begrenzt auf die typische Größe eines Smartphone-Bildschirms.
      Das hilft dir dabei, dich auf das Wesentliche zu konzentrieren und platformübergreifend (Online-Anzeigen, Visitenkarten, etc.) einheitliche Botschaften zu senden.
      Auf spezielle Angebote kannst du weiter unten eingehen.
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
      Ihr Unternehmen
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

    <div class="flex gap-4">
      <form class="space-y-4 w-1/2">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <label for="logo" class="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="text"
              id="logo"
              v-model="logo"
              class="input"
            />
          </div>
          <div>
            <label for="logoWidth" class="block text-sm font-medium text-gray-700">
              Logo Breite
            </label>
            <input
              type="number"
              id="logoWidth"
              v-model="logoWidth"
              class="input"
            />
          </div>
        </div>
  
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">
            Titel
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Hier gibt es nicht viel Interpretationsspielraum. Dein Name oder der Name deines Unternehmens.
          </div>
          <input
            type="text"
            id="title"
            v-model="title"
            class="input"
          />
        </div>
  
        <div>
          <label for="subtitle" class="block text-sm font-medium text-gray-700">
            Untertitel
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Was du machst, in ein paar Worten.
          </div>
          <input
            type="text"
            id="subtitle"
            v-model="subtitle"
            class="input"
          />
        </div>

        <div>
          <label for="slogan" class="block text-sm font-medium text-gray-700">
            Slogan
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Ein kurzer, prägnanter Satz, der deine Hauptbotschaft zusammenfasst.
          </div>
          <input
            type="text"
            id="slogan"
            v-model="slogan"
            class="input"
          />
        </div>
  
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">
            Beschreibung
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Zwei bis drei Sätze, die erklären, was du machst und warum das für Kunden wichtig ist.
          </div>
          <textarea
            id="description"
            v-model="description"
            class="input"
          ></textarea>
        </div>
  
        <div>
          <label for="ctaType" class="block text-sm font-medium text-gray-700">
            Call to Action
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Wie sollen Kunden Kontakt aufnehmen?
          </div>
          <select
            id="ctaType"
            v-model="ctaType"
            class="input"
          >
            <option
              v-for="type in ctyTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <div v-if="ctaType === 0">
          <label for="phone" class="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            type="text"
            id="phone"
            v-model="phone"
            class="input"
          />
        </div>

        <div v-if="ctaType === 1">
          <label for="email" class="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input
            type="text"
            id="email"
            v-model="email"
            class="input"
          />
        </div>

        <div v-if="ctaType === 2">
          <label for="link" class="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="text"
            id="link"
            v-model="link"
            class="input"
          />
        </div>

        <div>
          <label for="keywords" class="block text-sm font-medium text-gray-700">
            Suchbegriffe
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Wonach suchen potentielle Kunden, die genau dein Angebot brauchen?
            Wonach würdest du selber suchen? Sei spezifisch.
          </div>
          <input
            type="text"
            id="keywords"
            v-model="keywords"
            class="input"
          />
        </div>

        <div>
          <label for="keywords" class="block text-sm font-medium text-gray-700">
            Social Media
          </label>
          <div class="text-sm text-gray-500 mb-3">
            Nutzt du bereits Social Media? Wenn ja, welche Plattformen bzw. was kannst du dir vorstellen?
          </div>
          <div class="flex gap-4 my-4">
            <button class="button">
              <CheckIcon class="size-5 opacity-50" />
              Damit hätte ich am liebsten gar nichts zu tun.
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              id="facebook"
              class="input"
              placeholder="Facebook"
            />
            <input
              type="text"
              id="instagram"
              class="input"
              placeholder="Instagram"
            />
            <input
              type="text"
              id="twitter"
              class="input"
              placeholder="Twitter"
            />
            <input
              type="text"
              id="linkedin"
              class="input"
              placeholder="LinkedIn"
            />
            <input
              type="text"
              id="xing"
              class="input"
              placeholder="Xing"
            />
            <input
              type="text"
              id="youtube"
              class="input"
              placeholder="YouTube"
            />
            <input
              type="text"
              id="tiktok"
              class="input"
              placeholder="TikTok"
            />
            <input
              type="text"
              id="pinterest"
              class="input"
              placeholder="Pinterest"
            />
          </div>
        </div>
      </form>
      <div class="max-w-sm mx-auto">
        <div class="border-8 border-gray-200 rounded-2xl overflow-hidden">
          <img src="~/assets/img/default-header.jpg" alt="Header" class="w-full aspect-video object-cover" />
          <div class="p-6">
            <div class="flex items-center gap-4">
              <div>
                <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full" :style="{ width: `${logoWidth}px` }" />
              </div>
              <div>
                <div class="font-bold">
                  {{ title }}
                </div>
                <div>
                  {{ subtitle }}
                </div>
              </div>
            </div>
            <div class="mt-8 text-4xl font-bold">
              {{  slogan }}
            </div>
            <div class="mt-4 text-lg text-gray-700">
              {{ description }}
            </div>
            <div v-if="showCtaButton" class="mt-8">
              <div v-if="ctaType === 0">
                <a :href="`tel:${phone}`" class="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {{ phone }}
                </a>
              </div>
              <div v-if="ctaType === 1">
                <a :href="`mailto:${email}`" class="button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  {{ email }}
                </a>
              </div>
              <div v-if="ctaType === 2">
                <a :href="link" class="button">
                  {{ link }}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50 ml-auto">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex flex-col gap-2">
            <button class="button w-full">
              <CheckIcon class="size-5 opacity-50" />
              Speichern
            </button>
            <button class="button light w-full">
              <ArrowsPointingOutIcon class="size-5 opacity-50" />
              Vollbild
            </button>
            <button class="button light w-full">
              <IdentificationIcon class="size-5 opacity-50" />
              Visitenkarte
            </button>
            <button class="button light w-full">
              <MegaphoneIcon class="size-5 opacity-50" />
              <div>Anzeige</div>
              <div class="ml-auto">
                128 <span class="text-blue-950">Aufrufe für:</span>
              </div>
              <div>
                35 €
              </div>
            </button>
            <button class="button light w-full">
              <MapPinIcon class="size-5 opacity-50" />
              Google Unternehmensprofil
            </button>
          </div>
        </div>
      </div>
    </div>

    <h1 class="text-3xl font-bold text-gray-900 mb-4 mt-24">
      Anzeigen
    </h1>

    <p class="text-lg text-gray-700 mb-8">
      Es geht hier nicht darum, jedes einzelne Produkt zu bewerben. Treffe eine Auswahl von speziellen Angeboten, die du hervorheben möchtest.
    </p>
    <PlannerTarget />

    <div class="mt-24 flex gap-12">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Bestätigen und Bezahlen
        </h1>
    
        <p class="text-lg text-gray-700 mb-8">
          Hier sind nochmal die einzelnen Posten aufgelistet. Wenn alles passt, kannst du hier bezahlen. Du kannst natürlich monatlich kündigen.
        </p>
      </div>
      <div>
        <table class="w-full prose prose-sky min-w-lg">
          <thead>
            <tr>
              <th class="text-left">Posten</th>
              <th class="text-right">Preis pro Monat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">Domain und E-Mail</td>
              <td class="text-right">5 €</td>
            </tr>
            <tr>
              <td class="text-left">
                Hauptseite
              </td>
              <td class="text-right">12 €</td>
            </tr>
            <tr>
              <td class="text-left">
                Angebot: Software zum halben Preis
              </td>
              <td class="text-right">6 €</td>
            </tr>
            <tr>
              <td class="text-left">KI-Assistent</td>
              <td class="text-right">25 €</td>
            </tr>
            <tr>
              <td class="text-left">Änderungshotline</td>
              <td class="text-right">34 €</td>
            </tr>
            <tr>
              <td class="text-left font-bold text-2xl">
                Summe
              </td>
              <td class="text-right font-bold text-2xl">
                132 €
              </td>
            </tr>
          </tbody>
        </table>
        <button class="button w-full mt-4">
          Bestätigen und Bezahlen
        </button>
      </div>
    </div>

    <div>
    </div>
  </div>
</template>