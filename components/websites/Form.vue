<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { websiteFormSchema, websiteContentFormSchema, type NewWebsiteFormSuggestions, type Website, type WebsiteContent } from '~/types'

type WebsiteWithContents = Website & { contents: WebsiteContent[] }

const props = defineProps<{
  website?: WebsiteWithContents
  suggestions?: NewWebsiteFormSuggestions | null
}>()

type WebsiteSchema = z.output<typeof websiteFormSchema>
type WebsiteContentSchema = z.output<typeof websiteContentFormSchema>
type NestedFormSchema = Partial<WebsiteSchema & { contents: Partial<WebsiteContentSchema>[] }>

const { public: { s3Endpoint } } = useRuntimeConfig()
const { data: files } = await useFetch('/api/files')
const showHeaderImageModal = ref(false)
const showAboutImageModal = ref(false)

function selectHeaderImage(key: string) {
  state.image = key
  showHeaderImageModal.value = false
}

function selectAboutImage(key: string) {
  state.aboutImage = key
  showAboutImageModal.value = false
}

const fonts = ref([
  {
    type: 'label',
    label: 'Ohne Serifen',
  },
  {
    label: 'Roboto',
    value: 'roboto',
  },
  {
    label: 'Open Sans',
    value: 'open-sans',
  },
  {
    label: 'Lato',
    value: 'lato',
  },
  {
    label: 'Montserrat',
    value: 'montserrat',
  },
  {
    label: 'Poppins',
    value: 'poppins',
  },
  {
    type: 'label',
    label: 'Mit Serifen',
  },
  {
    label: 'Merriweather',
    value: 'merriweather',
  },
  {
    label: 'Lora',
    value: 'lora',
  },
  {
    label: 'Playfair Display',
    value: 'playfair-display',
  }
])

const colors = ref([
  {
    label: 'Rot',
    value: 'red',
  },
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Bernstein',
    value: 'amber',
  },
  {
    label: 'Gelb',
    value: 'yellow',
  },
  {
    label: 'Limette',
    value: 'lime',
  },
  {
    label: 'Grün',
    value: 'green',
  },
  {
    label: 'Smaragd',
    value: 'emerald',
  },
  {
    label: 'Blaugrün',
    value: 'teal',
  },
  {
    label: 'Cyan',
    value: 'cyan',
  },
  {
    label: 'Himmelblau',
    value: 'sky',
  },
  {
    label: 'Blau',
    value: 'blue',
  },
  {
    label: 'Indigo',
    value: 'indigo',
  },
  {
    label: 'Violett',
    value: 'violet',
  },
  {
    label: 'Lila',
    value: 'purple',
  },
  {
    label: 'Fuchsie',
    value: 'fuchsia',
  },
  {
    label: 'Rosa',
    value: 'pink',
  },
  {
    label: 'Rose',
    value: 'rose',
  },
  {
    label: 'Schiefer',
    value: 'slate',
  },
  {
    label: 'Grau',
    value: 'gray',
  },
  {
    label: 'Zink',
    value: 'zinc',
  },
  {
    label: 'Neutral',
    value: 'neutral',
  },
  {
    label: 'Stein',
    value: 'stone',
  },
])

const state = reactive<NestedFormSchema>({
  id: props.website?.id,
  image: props.website?.image || '',
  title: props.website?.title || props.suggestions?.title || '',
  subtitle: props.website?.subtitle || '',
  description: props.website?.description || '',
  domain: props.website?.domain || '',
  isOnline: !!props.website?.isOnline,
  hasContactForm: !!props.website?.hasContactForm,
  contactFormSubject: props.website?.contactFormSubject || '',
  font: props.website?.font || 'roboto',
  showAbout: !!props.website?.showAbout,
  aboutImage: props.website?.aboutImage || '',
  aboutTitle: props.website?.aboutTitle || '',
  aboutSubtitle: props.website?.aboutSubtitle || '',
  aboutText: props.website?.aboutText || '',
  showContents: !!props.website?.showContents,
  primaryColor: props.website?.primaryColor || colors.value[9].value,
  contents: props.website?.contents || [],
})

function addContent() {
  if (!state.contents) {
    state.contents = []
  }
  state.contents.push({
    orderIndex: state.contents.length,
  })
}

function removeContent(index: number) {
  if (!state.contents) {
    return
  }
  state.contents.splice(index, 1)
}

const toast = useToast()
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<NestedFormSchema>) {
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
        <div class="flex flex-col items-start gap-4">
          <img v-if="state.image" :src="`${s3Endpoint}/mktcms/${state.image}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg" />
          <div class="flex items-start gap-4">
            <UModal v-model:open="showHeaderImageModal" title="Bild auswählen" icon="i-heroicons-photo" size="xl">
              <UButton label="Bild auswählen" icon="i-heroicons-photo" />
  
              <template #body>
                <div class="grid grid-cols-3 gap-4">
                  <div v-for="file in files" :key="file.key" class="cursor-pointer" @click="selectHeaderImage(file.key)">
                    <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100" />
                  </div>
                </div>
              </template>
            </UModal>
            <UButton
              v-if="state.image"
              label="Bild entfernen"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="state.image = ''"
            />
          </div>
        </div>

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
                <UModal v-model:open="showAboutImageModal" title="Bild auswählen" icon="i-heroicons-photo" size="xl">
                  <UButton label="Bild auswählen" icon="i-heroicons-photo" />
      
                  <template #body>
                    <div class="grid grid-cols-3 gap-4">
                      <div v-for="file in files" :key="file.key" class="cursor-pointer" @click="selectAboutImage(file.key)">
                        <img :src="`${s3Endpoint}/mktcms/${file.key}`" alt="Kein Bild" class="w-full h-40 object-cover object-center rounded-lg opacity-90 hover:opacity-100" />
                      </div>
                    </div>
                  </template>
                </UModal>
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
          <UFormField label="Betreff" name="contactFormSubject" size="xl" v-if="state.hasContactForm">
            <UInput v-model="state.contactFormSubject" class="w-full" />
          </UFormField>
        </Transition>
      </template>

      <template #design-body>
        <div class="flex items-center gap-4">
          <UFormField label="Schriftart" name="font" size="xl" class="w-64">
            <USelect v-model="state.font" class="w-full" :items="fonts">
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
            <USelect v-model="state.primaryColor" :items="colors" class="w-48">
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
            Noch keine Domain? <ULink href="#" class="text-primary-500">Jetzt registrieren</ULink>
          </div>
        </UFormField>
    
        <UCheckbox
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

