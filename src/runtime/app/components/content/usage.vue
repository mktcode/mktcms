<template>
  <div class="bg-white rounded-md p-4">
    <div class="min-w-0">
      <div
        v-if="error"
        class="text-sm mt-1"
        style="color: var(--color-ds-error);"
      >
        Konnte Speicherbelegung nicht laden.
      </div>

      <div
        v-else
        class="text-sm mt-1"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="stat-label">Speicher</span>
          <span
            class="tabular-nums stat-value text-xs"
          >
            <template v-if="pending">
              lädt…
            </template>
            <template v-else>
              {{ usedPercentLabel }}
            </template>
          </span>
        </div>

        <div class="progress-track mt-2">
          <div
            class="progress-fill"
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
