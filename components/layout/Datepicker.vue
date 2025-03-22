<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const today = new CalendarDate(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDate()
)
const dateModel = shallowRef(today)
const df = new DateFormatter('de-DE', {
  dateStyle: 'medium'
})

const model = defineModel({
  type: String,
})

onMounted(() => {
  if (!model.value) {
    return
  }

  const [year, month, day] = model.value.split('-').map(Number);
  dateModel.value = model ? new CalendarDate(year, month, day) : today
})
</script>

<template>
  <UPopover>
    <UButton color="neutral" variant="outline" icon="i-lucide-calendar" size="xl">
      {{ dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) : 'Wähle ein Datum' }}
    </UButton>

    <template #content>
      <UCalendar v-model="dateModel" class="p-2" @update:model-value="model = dateModel?.toString()" />
    </template>
  </UPopover>
</template>