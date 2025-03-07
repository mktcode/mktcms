<script setup lang="ts">
import { ArrowsPointingOutIcon, CheckIcon, MapPinIcon, MegaphoneIcon, PaintBrushIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineProps<{
  targetIndex: number
}>()

const { targets, ctaTypes } = usePlanner()
</script>

<template>
  <div class="flex gap-4">
    <form class="space-y-4 w-1/2">
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
          v-model="targets[targetIndex].title"
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
          v-model="targets[targetIndex].subtitle"
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
          v-model="targets[targetIndex].slogan"
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
          v-model="targets[targetIndex].description"
          class="input"
        ></textarea>
      </div>

      <div>
        <label for="bulletPoints" class="block text-sm font-medium text-gray-700">
          Vorteile für Kunden
        </label>
        <div class="text-sm text-gray-500 mb-3">
          Was bekommen Kunden ganz konkret, wenn sie dein Angebot nutzen?
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex gap-4" v-for="(_, benefitIndex) in targets[targetIndex].benefits">
            <input
              type="text"
              v-model="targets[targetIndex].benefits[benefitIndex]"
              class="input"
            />
            <button type="button" class="button light" @click="targets[targetIndex].benefits.splice(benefitIndex, 1)">
              <TrashIcon class="size-5 opacity-50" />
            </button>
          </div>
          <button type="button" class="button light" @click="targets[targetIndex].benefits.push('')">
            <PlusIcon class="size-5 opacity-50" />
            Vorteil hinzufügen
          </button>
        </div>
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
          v-model="targets[targetIndex].ctaType"
          class="input"
        >
          <option
            v-for="type in ctaTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <div v-if="targets[targetIndex].ctaType === 0">
        <label for="phone" class="block text-sm font-medium text-gray-700">
          Telefon
        </label>
        <input
          type="text"
          id="phone"
          v-model="targets[targetIndex].phone"
          class="input"
        />
      </div>

      <div v-if="targets[targetIndex].ctaType === 1">
        <label for="email" class="block text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <input
          type="text"
          id="email"
          v-model="targets[targetIndex].email"
          class="input"
        />
      </div>

      <div v-if="targets[targetIndex].ctaType === 2">
        <label for="link" class="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="text"
          id="link"
          v-model="targets[targetIndex].link"
          class="input"
        />
      </div>

      <div>
        <label for="keywords" class="block text-sm font-medium text-gray-700">
          Suchbegriffe
        </label>
        <div class="text-sm text-gray-500 mb-3">
          Wonach suchen potentielle Kunden, die genau dein Angebot brauchen?
          Wonach würdest du selber suchen?
        </div>
        <input
          type="text"
          id="keywords"
          v-model="targets[targetIndex].keywords"
          class="input"
        />
      </div>

      <h3 class="text-xl text-gray-900 mb-1">
        Kontaktformular
      </h3>

      <div class="text-sm text-gray-500 mb-3">
        Soll ein Kontaktformular angezeigt werden? Wenn ja, an welche E-Mail-Adresse sollen die Anfragen geschickt werden und was soll in der E-Mail stehen?
      </div>

      <div>
        <label for="contactform" class="block text-sm font-medium text-gray-700">
          E-Mail
        </label>
        <input
          type="text"
          id="keywords"
          v-model="targets[targetIndex].keywords"
          class="input"
        />
      </div>
    </form>
    <div class="max-w-sm mx-auto mb-auto sticky top-28">
      <PlannerTargetPreview :target="targets[targetIndex]" />
      <div class="mt-4">
        <div class="flex flex-col gap-2">
          <button class="button light w-full">
            <PaintBrushIcon class="size-5 opacity-50" />
            Farbe
            <input v-model="targets[targetIndex].color" type="color" class="rounded-full size-6 border-0 ml-auto ring-0" />
          </button>
          <button class="button w-full">
            <CheckIcon class="size-5 opacity-50" />
            Speichern
          </button>
          <NuxtLink to="/landingpage/mywebsite/meinangebot">
            <button class="button light w-full">
              <ArrowsPointingOutIcon class="size-5 opacity-50" />
              Vollbild
            </button>
          </NuxtLink>
          <button class="button light w-full">
            <MegaphoneIcon class="size-5 opacity-50" />
            Anzeige schalten
          </button>
          <button class="button light w-full">
            <MapPinIcon class="size-5 opacity-50" />
            Google Unternehmensprofil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>