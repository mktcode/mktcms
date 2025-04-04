<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { websiteFormSchema, websiteContentFormSchema, type NewWebsiteFormSuggestions, type Website, type WebsiteContent } from '~/types'

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website?: WebsiteWithContents
  suggestions?: NewWebsiteFormSuggestions | null
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()

function selectHeaderImage(key: string) {
  state.value.image = key
}

function selectAboutImage(key: string) {
  state.value.aboutImage = key
}

const { state } = useWebsiteState(props.website)

const pathInput = ref<string>(props.website?.path?.replace(/^\//, '') || '')
watch(() => pathInput.value, (value) => {
  state.value.path = `/${value.replace(/^\//, '')}`
})

function addContent() {
  if (!state.value.contents) {
    state.value.contents = []
  }
  state.value.contents.push({
    orderIndex: state.value.contents.length,
  })
}

function removeContent(index: number) {
  if (!state.value.contents) {
    return
  }
  state.value.contents.splice(index, 1)
}

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<NestedWebsiteFormSchema>) {
  isSaving.value = true
  await $fetch('/api/websites/upsert', {
    method: 'POST',
    body: event.data,
  })
  isSaving.value = false
  navigateTo('/werbung/website')
  toast.add({ title: 'Erfolg.', description: 'Website wurde gespeichert.', color: 'success' })
}

const formSections = [
  {
    label: 'Kopfbereich',
    icon: 'i-heroicons-newspaper',
    slot: 'header',
  },
  {
    label: 'Details',
    icon: 'i-heroicons-identification',
    slot: 'details',
  },
  {
    label: 'Weitere Inhalte',
    icon: 'i-heroicons-squares-plus',
    slot: 'contents',
  },
  {
    label: 'Kontakt',
    icon: 'i-heroicons-envelope',
    slot: 'contact',
  },
  {
    label: 'Design',
    icon: 'i-heroicons-paint-brush',
    slot: 'design',
  },
  {
    label: 'Veröffentlichen',
    icon: 'i-heroicons-check',
    slot: 'publish',
  }
]
</script>

<template>
  <UForm :schema="websiteFormSchema" :state="state" @submit="onSubmit">
    <UAccordion
      :items="formSections"
      :ui="{ label: 'text-xl', header: 'px-6 hover:bg-gray-50 data-[state=open]:bg-gray-50 data-[state=open]:text-sky-500', body: 'p-6 flex flex-col gap-4' }"
      class="border-t border-b border-gray-200"
    >
      <template #header-body>
        <UFormField label="Header-Variante" name="headerVariant" size="xl">
          <USelect v-model="state.headerVariant" class="w-48" :items="[
            { label: 'Vollbild', value: 0 },
            { label: 'Geteilt', value: 1 },
            { label: 'Geteilt (Welle)', value: 2 },
          ]" />
        </UFormField>

        <div class="flex flex-col items-start gap-4">
          <img v-if="state.image" :src="`${s3Endpoint}/mktcms/${state.image}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg" />
          <div class="flex items-start gap-4">
            <LayoutFileExplorer @select="selectHeaderImage" />
            <UButton
              v-if="state.image"
              label="Bild entfernen"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="state.image = ''"
            />
          </div>
        </div>

        <UCheckbox
          label="Menü anzeigen"
          description="Deine anderen Seiten werden in einem Menü verlinkt."
          name="showMenu"
          v-model="state.showMenu"
        />

        <UFormField label="Titel" name="title" size="xl">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="Untertitel" name="subtitle" size="xl">
          <UInput v-model="state.subtitle" class="w-full" />
        </UFormField>

        <UFormField label="Kurzbeschreibung" name="description" size="xl">
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
      </template>
      
      <template #details-body>
        <UCheckbox
          label="Details zum Angebot oder Unternehmen"
          description="Eine weitere Sektion mit Details zum Angebot oder Unternehmen anzeigen."
          name="showAbout"
          v-model="state.showAbout"
        />

        <Transition name="fade">
          <div v-if="state.showAbout" class="flex flex-col gap-4">
            <div class="flex flex-col items-start gap-4">
              <img v-if="state.aboutImage" :src="`${s3Endpoint}/mktcms/${state.aboutImage}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg" />
              <div class="flex items-start gap-4">
                <LayoutFileExplorer @select="selectAboutImage" />
                <UButton
                  v-if="state.aboutImage"
                  label="Bild entfernen"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="state.aboutImage = ''"
                />
              </div>
            </div>

            <UFormField label="Title" name="aboutTitle" size="xl">
              <UInput v-model="state.aboutTitle" class="w-full" />
            </UFormField>
      
            <UFormField label="Untertitel" name="aboutSubtitle" size="xl">
              <UInput v-model="state.aboutSubtitle" class="w-full" />
            </UFormField>
      
            <UFormField label="Text" name="aboutText" size="xl">
              <UTextarea v-model="state.aboutText" class="w-full" />
            </UFormField>
          </div>
        </Transition>
      </template>

      <template #contents-body>
        <UCheckbox
          label="Weitere Inhalte als Liste"
          description="Eine weitere Sektion mit einer Raster- oder Listenansicht anzeigen."
          name="showAbout"
          v-model="state.showContents"
        />
    
        <Transition name="fade">
          <div v-if="state.showContents" class="flex flex-col gap-6 divide-y divide-gray-200">
            <TransitionGroup name="fade">
              <UForm v-for="content, index in state.contents" :key="index" :schema="websiteContentFormSchema" :state="content" class="flex flex-col gap-4 pb-6">
                <UFormField label="Titel" name="title" size="xl" class="flex-1">
                  <UInput v-model="content.title" class="w-full" />
                </UFormField>
                <UFormField label="Untertitel" name="subtitle" size="xl" class="flex-1">
                  <UInput v-model="content.subtitle" class="w-full" />
                </UFormField>
                <UFormField label="Text" name="text" size="xl" class="flex-1">
                  <UTextarea v-model="content.description" class="w-full" />
                </UFormField>
                <UButton color="error" variant="soft" size="xl" icon="i-heroicons-trash" @click="removeContent(index)">
                  Entfernen
                </UButton>
                <UInput v-model="content.orderIndex" type="hidden" class="hidden" />
              </UForm>
            </TransitionGroup>
            <UButton color="primary" variant="soft" size="xl" icon="i-heroicons-plus" @click="addContent">
              Inhalt hinzufügen
            </UButton>
          </div>
        </Transition>
      </template>

      <template #contact-body>
        <UCheckbox
          label="Kontaktformular"
          description="Hat die Website ein Kontaktformular?"
          name="hasContactForm"
          v-model="state.hasContactForm"
        />

        <Transition name="fade">
          <div v-if="state.hasContactForm" class="flex flex-col gap-6">
            <UFormField label="Titel" name="contactFormTitle" size="xl" v-if="state.hasContactForm">
              <UInput v-model="state.contactFormTitle" class="w-full" />
            </UFormField>
            <UFormField label="Text" name="contactFormText" size="xl" v-if="state.hasContactForm">
              <UTextarea v-model="state.contactFormText" class="w-full" />
            </UFormField>
            <UFormField label="Betreff" name="contactFormSubject" size="xl" v-if="state.hasContactForm">
              <UInput v-model="state.contactFormSubject" class="w-full" />
            </UFormField>
          </div>
        </Transition>
      </template>

      <template #design-body>
        <div class="flex items-center gap-4">
          <UFormField label="Schriftart" name="font" size="xl" class="w-64">
            <USelect v-model="state.font" class="w-full" :items="availableFonts">
              <template #item-label="{ item }">
                <div class="text-gray-400">
                  {{ item.label }}
                </div>
                <div class="whitespace-nowrap flex flex-col w-64 text-xl" :class="{
                  'font-roboto': item.value === 'roboto',
                  'font-open-sans': item.value === 'open-sans',
                  'font-lato': item.value === 'lato',
                  'font-montserrat': item.value === 'montserrat',
                  'font-poppins': item.value === 'poppins',
                  'font-merriweather': item.value === 'merriweather',
                  'font-lora': item.value === 'lora',
                  'font-playfair-display': item.value === 'playfair-display',
                }">
                  <div class="font-bold">
                    {{ state.title }}
                  </div>
                  {{ state.subtitle || state.title || 'Lorem ipsum dolor sit amet.' }}
                </div>
              </template>
            </USelect>
          </UFormField>
      
          <UFormField label="Primärfarbe" name="primaryColor" size="xl">
            <USelect v-model="state.primaryColor" :items="availableColors" class="w-48">
              <template #leading="{ modelValue }">
                <div :class="`w-4 h-4 rounded-full bg-red-500`" v-if="modelValue === 'red'" />
                <div :class="`w-4 h-4 rounded-full bg-orange-500`" v-if="modelValue === 'orange'" />
                <div :class="`w-4 h-4 rounded-full bg-amber-500`" v-if="modelValue === 'amber'" />
                <div :class="`w-4 h-4 rounded-full bg-yellow-500`" v-if="modelValue === 'yellow'" />
                <div :class="`w-4 h-4 rounded-full bg-lime-500`" v-if="modelValue === 'lime'" />
                <div :class="`w-4 h-4 rounded-full bg-green-500`" v-if="modelValue === 'green'" />
                <div :class="`w-4 h-4 rounded-full bg-emerald-500`" v-if="modelValue === 'emerald'" />
                <div :class="`w-4 h-4 rounded-full bg-teal-500`" v-if="modelValue === 'teal'" />
                <div :class="`w-4 h-4 rounded-full bg-cyan-500`" v-if="modelValue === 'cyan'" />
                <div :class="`w-4 h-4 rounded-full bg-sky-500`" v-if="modelValue === 'sky'" />
                <div :class="`w-4 h-4 rounded-full bg-blue-500`" v-if="modelValue === 'blue'" />
                <div :class="`w-4 h-4 rounded-full bg-indigo-500`" v-if="modelValue === 'indigo'" />
                <div :class="`w-4 h-4 rounded-full bg-violet-500`" v-if="modelValue === 'violet'" />
                <div :class="`w-4 h-4 rounded-full bg-purple-500`" v-if="modelValue === 'purple'" />
                <div :class="`w-4 h-4 rounded-full bg-fuchsia-500`" v-if="modelValue === 'fuchsia'" />
                <div :class="`w-4 h-4 rounded-full bg-pink-500`" v-if="modelValue === 'pink'" />
                <div :class="`w-4 h-4 rounded-full bg-rose-500`" v-if="modelValue === 'rose'" />
                <div :class="`w-4 h-4 rounded-full bg-slate-500`" v-if="modelValue === 'slate'" />
                <div :class="`w-4 h-4 rounded-full bg-gray-500`" v-if="modelValue === 'gray'" />
                <div :class="`w-4 h-4 rounded-full bg-zinc-500`" v-if="modelValue === 'zinc'" />
                <div :class="`w-4 h-4 rounded-full bg-neutral-500`" v-if="modelValue === 'neutral'" />
                <div :class="`w-4 h-4 rounded-full bg-stone-500`" v-if="modelValue === 'stone'" />
              </template>
              <template #item-leading="{ item }">
                <div :class="`w-4 h-4 rounded-full bg-red-500`" v-if="item.value === 'red'" />
                <div :class="`w-4 h-4 rounded-full bg-orange-500`" v-if="item.value === 'orange'" />
                <div :class="`w-4 h-4 rounded-full bg-amber-500`" v-if="item.value === 'amber'" />
                <div :class="`w-4 h-4 rounded-full bg-yellow-500`" v-if="item.value === 'yellow'" />
                <div :class="`w-4 h-4 rounded-full bg-lime-500`" v-if="item.value === 'lime'" />
                <div :class="`w-4 h-4 rounded-full bg-green-500`" v-if="item.value === 'green'" />
                <div :class="`w-4 h-4 rounded-full bg-emerald-500`" v-if="item.value === 'emerald'" />
                <div :class="`w-4 h-4 rounded-full bg-teal-500`" v-if="item.value === 'teal'" />
                <div :class="`w-4 h-4 rounded-full bg-cyan-500`" v-if="item.value === 'cyan'" />
                <div :class="`w-4 h-4 rounded-full bg-sky-500`" v-if="item.value === 'sky'" />
                <div :class="`w-4 h-4 rounded-full bg-blue-500`" v-if="item.value === 'blue'" />
                <div :class="`w-4 h-4 rounded-full bg-indigo-500`" v-if="item.value === 'indigo'" />
                <div :class="`w-4 h-4 rounded-full bg-violet-500`" v-if="item.value === 'violet'" />
                <div :class="`w-4 h-4 rounded-full bg-purple-500`" v-if="item.value === 'purple'" />
                <div :class="`w-4 h-4 rounded-full bg-fuchsia-500`" v-if="item.value === 'fuchsia'" />
                <div :class="`w-4 h-4 rounded-full bg-pink-500`" v-if="item.value === 'pink'" />
                <div :class="`w-4 h-4 rounded-full bg-rose-500`" v-if="item.value === 'rose'" />
                <div :class="`w-4 h-4 rounded-full bg-slate-500`" v-if="item.value === 'slate'" />
                <div :class="`w-4 h-4 rounded-full bg-gray-500`" v-if="item.value === 'gray'" />
                <div :class="`w-4 h-4 rounded-full bg-zinc-500`" v-if="item.value === 'zinc'" />
                <div :class="`w-4 h-4 rounded-full bg-neutral-500`" v-if="item.value === 'neutral'" />
                <div :class="`w-4 h-4 rounded-full bg-stone-500`" v-if="item.value === 'stone'" />
              </template>
            </USelect>
          </UFormField>
        </div>
      </template>

      <template #publish-body>
        <UFormField label="Domain" name="domain" size="xl">
          <UInput v-model="state.domain" class="w-full" />
          <div class="text-sm text-gray-500 mt-2">
            Noch keine Domain? Sie können <ULink href="#" class="text-primary-500">hier eine registrieren</ULink> und dann hier auswählen. Wenn Sie schon eine haben, können Sie diese hier eintragen, wenn Sie die entsprechenden <ULink href="#" class="text-primary-500">DNS-Einstellungen</ULink> vorgenommen haben.
          </div>
        </UFormField>

        <UFormField label="Pfad" name="path" size="xl">
          <UInput v-model="pathInput" class="w-full" icon="i-heroicons-slash" />
          <div class="text-sm text-gray-500 mt-2">
            Der Pfad ist der Teil nach der Domain. Für die Hauptseite lassen Sie dieses Feld leer. Für eine Unterseite tragen Sie hier eine Bezeichnung ein, z.B. "ueber-mich". (Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt.)
          </div>
        </UFormField>
    
        <UCheckbox
          v-if="state.domain"
          label="Website ist online"
          description="Ist die Website online und für Besucher sichtbar?"
          name="isOnline"
          v-model="state.isOnline"
        />
      </template>
    </UAccordion>

    <div class="flex justify-end p-6">
      <UButton :loading="isSaving" type="submit" color="primary" icon="i-heroicons-check" size="xl">
        Speichern
      </UButton>
    </div>
  </UForm>
</template>

