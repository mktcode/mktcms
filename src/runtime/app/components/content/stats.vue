<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '#app'

type VisitDay = {
  date: string
  visits: number
}

type VisitsResponse = {
  rangeDays: number
  days: VisitDay[]
}

const { data, pending, error } = await useFetch<VisitsResponse>('/api/admin/stats-visits', {
  key: 'mktcms-stats-visits',
})

const days = computed(() => data.value?.days ?? [])
const maxVisits = computed(() => Math.max(1, ...days.value.map(d => d.visits)))
const totalVisits = computed(() => days.value.reduce((sum, d) => sum + d.visits, 0))
const firstDate = computed(() => days.value[0]?.date)
const lastDate = computed(() => days.value[days.value.length - 1]?.date)

function shortDate(isoDate: string): string {
  // isoDate: YYYY-MM-DD
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[2]}.${parts[1]}`
}
</script>

<template>
  <div>
    <div v-if="error" class="text-sm text-red-600 mt-1">
      Could not load visit stats.
    </div>

    <div v-else-if="pending" class="text-sm text-gray-500 mt-1">
      loading…
    </div>

    <div v-else>
      <div
        class="h-10 grid items-end gap-1 rounded"
        style="grid-template-columns: repeat(30, minmax(0, 1fr));"
      >
        <div
          v-for="(d, idx) in days"
          :key="d.date"
          class="w-full rounded-sm bg-gray-300"
          :style="{ height: `${Math.max(2, Math.round((d.visits / maxVisits) * 100))}%` }"
          :title="`${shortDate(d.date)}: ${d.visits}`"
        />
      </div>

      <div class="mt-1 flex items-center justify-between text-xs text-gray-500 tabular-nums">
        <span>{{ firstDate ? shortDate(firstDate) : '' }}</span>
        <span>Besucher (30 Tage): {{ totalVisits }}</span>
        <span>{{ lastDate ? shortDate(lastDate) : '' }}</span>
      </div>
    </div>
  </div>
</template>
