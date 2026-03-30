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
  <div class="bg-ds-surface-container-lowest rounded-[1.25rem] p-4">
    <div
      v-if="error"
      class="text-sm mt-1 text-ds-error"
    >
      Could not load visit stats.
    </div>

    <div
      v-else-if="pending"
      class="text-sm mt-1 text-ds-on-surface-variant"
    >
      Lädt…
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-widest font-display text-ds-on-surface-variant">Traffic</span>
        <span
          v-if="totalVisits > 0"
          class="text-xs font-semibold font-display text-ds-primary"
        >{{ totalVisits }}</span>
      </div>

      <div
        class="h-10 grid items-end gap-0.5 rounded"
        style="grid-template-columns: repeat(30, minmax(0, 1fr));"
      >
        <div
          v-for="d in days"
          :key="d.date"
          class="w-full rounded-sm bg-ds-surface-dim"
          :style="{ height: `${Math.max(2, Math.round((d.visits / maxVisits) * 100))}%` }"
          :title="`${shortDate(d.date)}: ${d.visits}`"
        />
      </div>

      <div class="mt-1 flex items-center justify-between text-xs tabular-nums text-ds-on-surface-variant">
        <span>{{ firstDate ? shortDate(firstDate) : '' }}</span>
        <span>{{ lastDate ? shortDate(lastDate) : '' }}</span>
      </div>

      <div
        v-if="topPages.length > 0"
        class="mt-3"
      >
        <button
          class="flex items-center gap-1.5 w-full text-xs cursor-pointer px-0 py-1 bg-transparent border-none text-left text-ds-on-surface-variant hover:text-ds-on-surface transition-colors duration-150"
          type="button"
          @click="topPagesExpanded = !topPagesExpanded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-3 shrink-0 transition-transform duration-300"
            :class="topPagesExpanded ? 'rotate-90' : ''"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
          <span>{{ topPagesExpanded ? 'weniger' : 'mehr' }}</span>
        </button>

        <div
          class="grid transition-[grid-template-rows] duration-300 ease-in-out"
          :class="topPagesExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden">
            <div class="space-y-1 pt-2">
              <div class="text-xs mb-2 text-ds-on-surface-variant">
                Seitenaufrufe:
              </div>
              <NuxtLink
                v-for="page in topPages"
                :key="page.path"
                :to="page.path"
                target="_blank"
                class="relative flex items-center justify-between gap-2 text-xs px-1.5 py-0.5 rounded-lg overflow-hidden"
              >
                <div
                  class="absolute inset-y-0 left-0 rounded-lg bg-ds-surface-container-high"
                  :style="{ width: `${Math.round((page.visits / maxTopPageVisits) * 100)}%` }"
                />
                <span
                  class="relative truncate text-ds-on-surface"
                  :title="page.path"
                >{{ page.path }}</span>
                <span class="relative tabular-nums text-ds-on-surface-variant">{{ page.visits }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="topPages.length === 0"
        class="text-xs mt-3 text-ds-on-surface-variant"
      >
        Keine Seitenaufrufe im Zeitraum.
      </div>
    </div>
  </div>
</template>
