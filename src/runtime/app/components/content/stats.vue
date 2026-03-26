<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '#app'

type VisitDay = {
  date: string
  visits: number
}

type TopPage = {
  path: string
  visits: number
}

type VisitsResponse = {
  rangeDays: number
  days: VisitDay[]
  topPages: TopPage[]
}

const { data, pending, error } = await useFetch<VisitsResponse>('/api/admin/stats-visits', {
  key: 'mktcms-stats-visits',
})

const days = computed(() => data.value?.days ?? [])
const topPages = computed(() => data.value?.topPages ?? [])
const maxVisits = computed(() => Math.max(1, ...days.value.map(d => d.visits)))
const maxTopPageVisits = computed(() => Math.max(1, ...topPages.value.map(p => p.visits)))
const totalVisits = computed(() => days.value.reduce((sum, d) => sum + d.visits, 0))
const firstDate = computed(() => days.value[0]?.date)
const lastDate = computed(() => days.value[days.value.length - 1]?.date)
const topPagesExpanded = ref(false)

function shortDate(isoDate: string): string {
  // isoDate: YYYY-MM-DD
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  return `${parts[2]}.${parts[1]}`
}
</script>

<template>
  <div>
    <div
      v-if="error"
      class="text-sm text-red-600 mt-1"
    >
      Could not load visit stats.
    </div>

    <div
      v-else-if="pending"
      class="text-sm text-gray-500 mt-1"
    >
      loading…
    </div>

    <div v-else>
      <div
        class="h-10 grid items-end gap-1 rounded"
        style="grid-template-columns: repeat(30, minmax(0, 1fr));"
      >
        <div
          v-for="d in days"
          :key="d.date"
          class="w-full rounded-sm bg-gray-300"
          :style="{ height: `${Math.max(2, Math.round((d.visits / maxVisits) * 100))}%` }"
          :title="`${shortDate(d.date)}: ${d.visits}`"
        />
      </div>

      <div class="mt-1 flex items-center justify-between text-xs text-gray-500 tabular-nums">
        <span>{{ firstDate ? shortDate(firstDate) : '' }}</span>
        <span>Besucher letzte 30 Tage: {{ totalVisits }}</span>
        <span>{{ lastDate ? shortDate(lastDate) : '' }}</span>
      </div>

      <div class="mt-3">
        <div class="flex items-center justify-center">
          <button
            v-if="topPages.length > 0"
            class="text-xs text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-200 px-3 py-1.5 rounded-md border border-gray-200"
            type="button"
            @click="topPagesExpanded = !topPagesExpanded"
          >
            {{ topPagesExpanded ? 'weniger' : 'mehr' }}
          </button>
        </div>
        <div
          v-if="topPages.length === 0"
          class="text-xs text-gray-400 mt-3"
        >
          Keine Seitenaufrufe im Zeitraum.
        </div>
        <div
          v-else-if="topPagesExpanded"
          class="space-y-1 mt-3"
        >
          <div class="text-xs text-gray-500 mb-3">
            Seitenaufrufe:
          </div>
          <NuxtLink
            v-for="page in topPages"
            :key="page.path"
            :to="page.path"
            target="_blank"
            class="relative flex items-center justify-between gap-2 text-xs px-1.5 py-0.5 rounded overflow-hidden hover:bg-gray-200/50"
          >
            <div
              class="absolute inset-y-0 left-0 rounded bg-gray-200"
              :style="{ width: `${Math.round((page.visits / maxTopPageVisits) * 100)}%` }"
            />
            <span
              class="relative truncate text-gray-700"
              :title="page.path"
            >{{ page.path }}</span>
            <span class="relative tabular-nums text-gray-400">{{ page.visits }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
