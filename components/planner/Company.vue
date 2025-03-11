<script setup lang="ts">
import { ArrowsPointingOutIcon, CheckIcon, MapPinIcon, MegaphoneIcon } from '@heroicons/vue/24/outline'

const {
  logo,
  logoWidth,
  title,
  subtitle,
  slogan,
  description,
  ctaType,
  phone,
  email,
  link,
  keywords,
  showCtaButton,
  ctaTypes,
} = usePlanner()
</script>

<template>
  <div class="flex gap-4">
    <form class="space-y-4 w-1/2">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <UFormField label="Logo" name="logo" help="Ihr Logo, am besten in Druckqualität.">
            <UInput type="file" class="w-full" size="xl" />
          </UFormField>
        </div>
        <div>
          <UFormField label="Logo Breite" name="logoWidth" help="Die Breite Ihres Logos in Pixel.">
            <UInputNumber v-model="logoWidth" class="w-full" size="xl" />
          </UFormField>
        </div>
      </div>

      <UFormField label="Titel" name="title" help="Hier gibt es nicht viel Interpretationsspielraum. Dein Name oder der Name deines Unternehmens.">
        <UInput v-model="title" class="w-full" size="xl" />
      </UFormField>

      <UFormField label="Untertitel" name="subtitle" help="Was du machst, in ein paar Worten.">
        <UInput v-model="subtitle" class="w-full" size="xl" />
      </UFormField>

      <UFormField label="Slogan" name="slogan" help="Ein kurzer, prägnanter Satz, der deine Hauptbotschaft zusammenfasst.">
        <UInput v-model="slogan" class="w-full" size="xl" />
      </UFormField>

      <UFormField label="Beschreibung" name="description" help="Zwei bis drei Sätze, die erklären, was du machst und warum das für Kunden wichtig ist.">
        <UTextarea v-model="description" class="w-full" size="xl" />
      </UFormField>

      <UFormField label="Call to Action" name="ctaType" help="Wie sollen Kunden Kontakt aufnehmen?">
        <USelect v-model="ctaType" class="w-full" size="xl">
          <option
            v-for="type in ctaTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </USelect>
      </UFormField>

      <UFormField v-if="ctaType === 0" label="Telefon" name="phone" help="Deine Telefonnummer, unter der Kunden dich erreichen können.">
        <UInput v-model="phone" class="w-full" size="xl" />
      </UFormField>

      <UFormField v-if="ctaType === 1" label="E-Mail" name="email" help="Deine E-Mail-Adresse, unter der Kunden dich erreichen können.">
        <UInput v-model="email" class="w-full" size="xl" />
      </UFormField>

      <UFormField v-if="ctaType === 2" label="Website" name="link" help="Die URL deiner Website.">
        <UInput v-model="link" class="w-full" size="xl" />
      </UFormField>

      <UFormField label="Suchbegriffe" name="keywords" help="Wonach suchen potentielle Kunden, die genau dein Angebot brauchen? Wonach würdest du selber suchen? Sei spezifisch.">
        <UInput v-model="keywords" class="w-full" size="xl" />
      </UFormField>

      <div>
        <label for="keywords" class="block text-sm font-medium text-gray-700">
          Social Media
        </label>
        <div class="text-sm text-gray-500 mb-3">
          Nutzt du bereits Social Media? Wenn ja, welche Plattformen bzw. was kannst du dir vorstellen?
        </div>
        <div class="flex gap-4 my-4">
          <USwitch label="Ich nutze kein Social Media" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UInput type="text" id="facebook" placeholder="Facebook" />
          <UInput type="text" id="instagram" placeholder="Instagram" />
          <UInput type="text" id="twitter" placeholder="Twitter" />
          <UInput type="text" id="linkedin" placeholder="LinkedIn" />
          <UInput type="text" id="xing" placeholder="Xing" />
          <UInput type="text" id="youtube" placeholder="YouTube" />
          <UInput type="text" id="tiktok" placeholder="TikTok" />
          <UInput type="text" id="pinterest" placeholder="Pinterest" />
        </div>
      </div>
    </form>
    <div class="max-w-sm mx-auto mb-auto sticky top-28">
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
          <UButton icon="i-heroicons-check" size="xl">
            Speichern
          </UButton>
          <UButton variant="ghost" to="/landingpage/mywebsite" icon="i-heroicons-arrows-pointing-out">
            Vollbild
          </UButton>
          <UButton variant="ghost" icon="i-heroicons-megaphone">
            Anzeige
            <span class="ml-auto">
              128 <span class="text-blue-950">Aufrufe für:</span>
            </span>
            <span>
              35 €
            </span>
          </UButton>
          <UButton variant="ghost" icon="i-heroicons-map-pin">
            Google Unternehmensprofil
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>