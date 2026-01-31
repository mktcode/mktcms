<template>
  <div class="">
    <div class="min-w-0">
        <div v-if="error" class="text-sm text-red-600 mt-1">
          Konnte Speicherbelegung nicht laden.
        </div>

        <div v-else class="text-sm text-gray-700 mt-1">
          <div class="flex items-center justify-between gap-3">
            <span class="text-gray-500">Speicher:</span>
            <span class="font-semibold text-gray-900 tabular-nums">
              <template v-if="pending">
                lädt…
              </template>
              <template v-else>
                {{ usedPercentLabel }}
              </template>
            </span>
          </div>

          <div
            class="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden"
            role="progressbar"
            :aria-valuenow="Math.round(usedPercent)"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              class="h-full rounded-full bg-emerald-600 transition-[width] duration-300"
              :style="{ width: `${usedPercent}%` }"
            />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFetch } from '#app'

type StorageUsage = {
  bytes: number
}

const { data, pending, error } = await useFetch<StorageUsage>('/api/admin/storage-usage', {
  key: 'mktcms-storage-usage',
})

// Storage budget for the bar.
const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024 // 100 MB

const bytes = computed(() => data.value?.bytes ?? 0)
const usedPercent = computed(() => {
  if (!Number.isFinite(bytes.value) || bytes.value < 0) return 0
  if (!Number.isFinite(STORAGE_LIMIT_BYTES) || STORAGE_LIMIT_BYTES <= 0) return 0
  const percent = (bytes.value / STORAGE_LIMIT_BYTES) * 100
  return Math.max(0, Math.min(100, percent))
})

const usedPercentLabel = computed(() => {
  const formatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
  return `${formatter.format(usedPercent.value)} %`
})
</script>