<script setup lang="ts">
import { z } from 'zod'

const { user, fetch: fetchUser } = useUserSession()
const { data: averagePrice, refresh: refreshAveragePrice } = useFetch('/api/user/averagePrice')
const { data: costInfo, refresh: refreshCost } = useFetch('/api/system/cost')

const showWelcomeMessage = ref(true)

const toast = useToast()
const isUpdating = ref(false)

const formSchema = z.object({
  price: z.number().min(1),
})
const state = reactive({
  price: user.value?.price || 0,
})

async function update() {
  isUpdating.value = true
  await $fetch('/api/user/updatePrice', {
    method: 'POST',
    body: {
      newPrice: state.price,
    },
  })
  isUpdating.value = false
  fetchUser()
  refreshAveragePrice()
  refreshCost()
  toast.add({
    title: 'Einstellungen gespeichert',
    description: 'Ihre Einstellungen wurden erfolgreich gespeichert.',
    color: 'success',
  })
}
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarSettings />
    </template>
    <div class="p-6">
      <Transition name="fade">
        <UAlert
          v-if="showWelcomeMessage"
          variant="solid"
          color="primary"
          title="Bestimme selbst den Preis!"
          description="Solihost ermöglichst es auch mit kleinem Budget durchzustarten. Du kannst deinen monatlichen Preis selbst bestimmen und einfach Guthaben aufladen. Dein Guthaben wird dann einmal im Monat um den von dir gewählten Betrag belastet. Außerdem siehst du ganz transparent den aktuellen Durchschnittspreis aller Kunden und wie gut davon die Kosten für den Betrieb von Solihost gedeckt werden."
          icon="i-heroicons-information-circle"
          :ui="{ icon: 'size-11' }"
          :close="{ class: 'text-white/75 hover:text-white' }"
          @update:open="showWelcomeMessage = $event"
          class="mb-6"
        />
      </Transition>

      <div class="flex flex-col sm:flex-row gap-6">
        <div>
          <h1 class="text-3xl font-bold mb-4">
            Guthaben: {{ formatPrice(user?.balance || 0) }}
          </h1>
      
          <UForm class="flex flex-col gap-4" @submit="update" :state="state" :schema="formSchema">
            <div class="flex items-end gap-4">
              <UFormField label="Preis" name="price" size="xl">
                <UInputNumber
                  size="xl"
                  v-model="state.price"
                  :format-options="{
                    minimumFractionDigits: 2,
                  }"
                  :min="1"
                  :step="0.01"
                  class="w-40"
                />
              </UFormField>
              <UButton type="submit" size="xl" icon="i-heroicons-check">
                Speichern
              </UButton>
            </div>
          </UForm>
        </div>
        <div>
          <UAlert v-if="averagePrice && costInfo" variant="outline" color="neutral">
            <template #description>
              <div class="text-lg">
                Die monatlichen Kosten für den Betrieb von Solihost betragen aktuell <span class="font-bold">{{ formatPrice(costInfo.total) }}</span> und sind für die nächsten <span class="font-bold">{{ formatNumber(costInfo.coveredMonths) }}</span> Monate gedeckt.
                Der Durchschnittspreis beträgt aktuell <span class="font-bold">{{ formatPrice(averagePrice) }}</span> und müsste bei <span class="font-bold">{{ formatPrice(costInfo.requiredAveragePrice)  }}</span> liegen, um die Kosten zu decken.
              </div>
            </template>
          </UAlert>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>