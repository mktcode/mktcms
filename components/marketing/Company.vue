<script setup lang="ts">
const isSmallBusiness = ref(true)

const { title } = usePlanner()
</script>

<template>
  <div class="overflow-hidden bg-white py-12 px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <div class="lg:pt-4 lg:pr-8">
        <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
          Ihr Unternehmen
        </p>
        <p class="mt-6 text-lg/8 text-gray-600">
          Wer sind Sie, was machen Sie und wie können Sie erreicht werden? Haben Sie schon ein Logo? Ein Bild, das Sie oder Ihr Unternehmen zeigt, wäre auch toll.
        </p>
        <div class="flex flex-col gap-4 mt-6">
          <UFormField label="Firmenname" name="companyName" required>
            <UInput class="w-full" size="xl" v-model="title" />
          </UFormField>

          <UFormField label="Untertitel" name="subtitle">
            <UInput class="w-full" size="xl" />
          </UFormField>

          <UFormField label="Slogan 1" name="slogan1" description="Eine kurze Aussage, die auf die Vorderseite Ihrer Visitenkarte passt.">
            <UInput class="w-full" size="xl" />
          </UFormField>

          <UFormField label="Slogan 2" name="slogan2" description="Eine kurze Aussage, die auf die Rückseite Ihrer Visitenkarte passt.">
            <UInput class="w-full" size="xl" />
          </UFormField>

          <UFormField label="Straße" name="street" required>
            <UInput class="w-full" size="xl" />
          </UFormField>

          <div class="flex w-full gap-4">
            <div>
              <UFormField label="PLZ" name="zip" required>
                <UInput class="w-full" size="xl" />
              </UFormField>
            </div>
            <div class="flex-grow">
              <UFormField label="Ort" name="city" required>
                <UInput class="w-full" size="xl" />
              </UFormField>
            </div>
          </div>

          <UFormField label="Telefon" name="phone" required>
            <UInput class="w-full" size="xl" />
          </UFormField>

          <UFormField label="E-Mail" name="email">
            <UInput class="w-full" size="xl" />
          </UFormField>

          <UCheckbox
            label="Ich bin Kleinunternehmer"
            description="Als Kleinunternehmer sind Sie von der Umsatzsteuer befreit."
            name="isSmallBusiness"
            v-model="isSmallBusiness"
          />

          <Transition name="fade">
            <UFormField label="Umsatzsteuer-ID" name="vatId" v-if="!isSmallBusiness">
              <UInput class="w-full" size="xl" />
            </UFormField>
          </Transition>

          <div class="flex justify-between">
            <UButton size="xl" variant="outline" to="/" icon="i-heroicons-arrow-left">
              Zurück
            </UButton>
            <UButton size="xl" to="/start" trailing-icon="i-heroicons-arrow-right">
              Weiter
            </UButton>
          </div>
        </div>
      </div>
      <div>
        <MarketingVcard />
        <div>

        </div>
      </div>
    </div>
  </div>
</template>