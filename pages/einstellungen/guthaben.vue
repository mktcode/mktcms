<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { z } from 'zod'

const { user, fetch: fetchUser } = useUserSession()
const { data: averagePrice, refresh: refreshAveragePrice } = useFetch('/api/user/averagePrice')
const { data: costInfo, refresh: refreshCost } = useFetch('/api/system/cost')

const showWelcomeMessage = useLocalStorage('showWelcomeMessage.guthaben', true)
const showTopupModal = ref(false)

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
          icon="i-heroicons-information-circle"
          :ui="{ icon: 'size-11', title: 'text-xl' }"
          :close="{ class: 'text-white/75 hover:text-white' }"
          @update:open="showWelcomeMessage = $event"
          class="mb-6"
        >
          <template #description>
            <p>
              Solihost ermöglichst es auch mit kleinem Budget durchzustarten. Du kannst deinen monatlichen Preis selbst bestimmen und einfach Guthaben aufladen. Dein Guthaben wird dann einmal im Monat um den von dir gewählten Betrag belastet. Außerdem siehst du ganz transparent den aktuellen Durchschnittspreis aller Kunden und wie gut davon die Kosten für den Betrieb von Solihost gedeckt werden.
            </p>
            <p class="mt-4">
              Der erste Monat nach deiner Anmeldung ist kostenlos. Ist den Guthaben aufgebraucht oder reicht nicht mehr für den von dir eingestellten Preis, hast du noch einen Monat Zeit, es wieder aufzuladen. Danach wird dein Account automatisch gesperrt und nach weiteren 90 Tagen gelöscht. Du bekommst dann ein Backup deiner Daten per E-Mail zugeschickt, wenn du diese Funktion nicht vorher deaktivierst.
            </p>
            <p class="mt-4">
              <span class="font-bold">Praktisch:</span> Rechnungen für das Aufladen von Guthaben landen automatisch in der Buchhaltung unter Ausgaben.
            </p>
          </template>
        </UAlert>
      </Transition>

      <div class="flex flex-col lg:flex-row gap-12">
        <div class="flex flex-col gap-4">
          <h1 class="text-xl font-bold whitespace-nowrap">
            Aktuelles Guthaben:
          </h1>
          <div>
            <div class="text-3xl font-bold">
              {{ formatPrice(user?.balance || 0) }}
            </div>
            <div class="text-sm text-gray-500">
              Nächste Abbuchung: {{ new Date().toLocaleDateString() }}
            </div>
          </div>
          <UButton size="xl" @click="showTopupModal = true">
            Guthaben aufladen
          </UButton>
        </div>
        <div>
          <UForm class="flex flex-col gap-4" @submit="update" :state="state" :schema="formSchema">
            <h1 class="text-xl font-bold whitespace-nowrap">
              Monatlicher Preis:
            </h1>
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
            <UButton type="submit" size="xl" icon="i-heroicons-check">
              Speichern
            </UButton>
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
      <UModal
        v-model:open="showTopupModal"
        title="Guthaben aufladen"
      >
        <template #body>
          <div class="flex flex-col gap-4">
            <p>
              Dein Guthaben kannst du aktuell nur per Banküberweisung aufladen. Bitte überweise den gewünschten Betrag an folgende Bankverbindung:
            </p>
            <div class="flex flex-col">
              <div>
                <span class="font-bold">Empfänger:</span> Markus Kottländer
              </div>
              <div>
                <span class="font-bold">IBAN:</span> DE12 3456 7890 1234 5678 90
              </div>
              <div>
                <span class="font-bold">BIC:</span> SOLIDE12XXX
              </div>
              <div>
                <span class="font-bold">Verwendungszweck:</span> Guthaben {{ user?.id }}
              </div>
            </div>
            <p>
              Sobald der Betrag eingegangen ist, wird dein Guthaben aufgeladen und du erhältst eine Bestätigung per E-Mail.
            </p>
          </div>
        </template>
      </UModal>
    </div>
  </NuxtLayout>
</template>