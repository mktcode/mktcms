<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from '#app'

type GitBranchResponse = {
  currentBranch: string
  isSupported: boolean
  sourceBranch: string | null
  targetBranch: string | null
  hasCounterpartBranch?: boolean
  canUpdate?: boolean
  updateBlockedReason?: string | null
}

type GitUpdateStatusResponse = {
  currentBranch: string
  isSupported: boolean
  sourceBranch: string | null
  targetBranch: string | null
  hasCounterpartBranch: boolean
  sourceAheadCount: number
  targetAheadCount: number
  isIdentical: boolean
  canUpdate: boolean
  updateBlockedReason: string | null
}

type GitHistoryEntry = {
  hash: string
  shortHash: string
  authorName: string
  authorEmail: string
  date: string
  subject: string
}

type GitHistoryResponse = {
  branch: string
  page: number
  perPage: number
  entries: GitHistoryEntry[]
  hasNextPage: boolean
}

const HISTORY_PER_PAGE = 25

const isHistoryModalOpen = ref(false)
const isUpdateModalOpen = ref(false)

const selectedUpdateBranch = ref('')
const historyPage = ref(1)
const isUpdating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')

const { data: branchData, pending: branchPending, error: branchError, refresh: refreshBranch } = await useFetch<GitBranchResponse>('/api/admin/git-branch', {
  key: 'mktcms-git-branch',
})

const { data: updateStatusData, pending: updateStatusPending, error: updateStatusError, refresh: refreshUpdateStatus } = await useFetch<GitUpdateStatusResponse>('/api/admin/git-update-status', {
  key: 'mktcms-git-update-status',
})

const { data: historyData, pending: historyPending, error: historyError, refresh: refreshHistory } = await useFetch<GitHistoryResponse>('/api/admin/git-history', {
  key: 'mktcms-git-history',
  query: computed(() => ({
    page: historyPage.value,
    perPage: HISTORY_PER_PAGE,
  })),
  immediate: false,
})

const currentBranch = computed(() => branchData.value?.currentBranch ?? 'unbekannt')
const isSupportedBranch = computed(() => branchData.value?.isSupported ?? false)
const sourceBranch = computed(() => branchData.value?.sourceBranch ?? '')
const sourceAheadCount = computed(() => updateStatusData.value?.sourceAheadCount ?? 0)
const isIdentical = computed(() => updateStatusData.value?.isIdentical ?? false)
const canUpdate = computed(() => updateStatusData.value?.canUpdate ?? false)
const updateBlockedReason = computed(() => updateStatusData.value?.updateBlockedReason || branchData.value?.updateBlockedReason || '')
const updateButtonText = computed(() => {
  const count = sourceAheadCount.value
  return `Aktualisieren (${count})`
})
const updateTitle = computed(() => currentBranch.value === 'main'
  ? 'Änderungen aus Vorschau übernehmen'
  : currentBranch.value === 'staging'
    ? 'Änderungen von Live in Vorschau übernehmen'
    : 'Branch aktualisieren')
const historyEntries = computed(() => historyData.value?.entries ?? [])
const hasNextHistoryPage = computed(() => historyData.value?.hasNextPage ?? false)

function formatRelativeDate(isoDate: string) {
  const target = new Date(isoDate).getTime()
  if (!Number.isFinite(target)) {
    return isoDate
  }

  const diffMs = target - Date.now()
  const absMs = Math.abs(diffMs)
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  const rtf = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' })

  if (absMs < hour) {
    return rtf.format(Math.round(diffMs / minute), 'minute')
  }

  if (absMs < day) {
    return rtf.format(Math.round(diffMs / hour), 'hour')
  }

  return rtf.format(Math.round(diffMs / day), 'day')
}

async function openHistoryModal() {
  isHistoryModalOpen.value = true
  historyPage.value = 1
  await refreshHistory()
}

function openUpdateModal() {
  selectedUpdateBranch.value = updateStatusData.value?.sourceBranch || sourceBranch.value
  updateError.value = ''
  updateSuccess.value = ''
  isUpdateModalOpen.value = true
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false
}

async function goToHistoryPage(nextPage: number) {
  if (nextPage < 1 || historyPending.value) {
    return
  }

  historyPage.value = nextPage
  await refreshHistory()
}

function closeUpdateModal() {
  isUpdateModalOpen.value = false
}

async function runUpdate() {
  if (!isSupportedBranch.value || isUpdating.value) {
    return
  }

  if (!canUpdate.value) {
    updateError.value = updateBlockedReason.value || 'Aktualisierung aktuell nicht möglich.'
    return
  }

  isUpdating.value = true
  updateError.value = ''
  updateSuccess.value = ''

  try {
    await $fetch('/api/admin/git-update', {
      method: 'POST',
    })

    updateSuccess.value = `Merge erfolgreich: ${sourceBranch.value} → ${currentBranch.value}`
    await refreshBranch()
    await refreshUpdateStatus()
  }
  catch (error: any) {
    updateError.value = error?.data?.statusMessage || error?.message || 'Aktualisierung fehlgeschlagen.'
  }
  finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="text-sm text-gray-700">
    <div class="flex items-center justify-end gap-3">
      <span class="text-xs text-gray-500 mr-auto">
        Version: <strong class="capitalize">{{ currentBranch }}</strong>
      </span>
      <button
        type="button"
        class="button small tertiary"
        @click="openHistoryModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-400"
        ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
        Änderungshistorie
      </button>
      <button
        type="button"
        class="button small tertiary"
        :disabled="branchPending || updateStatusPending || !!branchError || !!updateStatusError"
        @click="openUpdateModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-400"
        ><path d="M12 2a10 10 0 0 1 7.38 16.75" /><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /><path d="M2.5 8.875a10 10 0 0 0-.5 3" /><path d="M2.83 16a10 10 0 0 0 2.43 3.4" /><path d="M4.636 5.235a10 10 0 0 1 .891-.857" /><path d="M8.644 21.42a10 10 0 0 0 7.631-.38" /></svg>
        {{ updateButtonText }}
      </button>
    </div>

    <div
      v-if="isHistoryModalOpen"
      class="fixed inset-0 bg-black/45 flex items-start justify-center p-4 z-9999 overflow-y-auto"
      role="presentation"
      @click.self="closeHistoryModal"
    >
      <div
        class="w-full max-w-140 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-4 max-h-[calc(100vh-2rem)] my-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Änderungshistorie"
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-bold text-xl">
            Änderungshistorie
          </h2>
          <button
            type="button"
            class="button secondary small"
            @click="closeHistoryModal"
          >
            Schließen
          </button>
        </div>

        <div class="min-h-0 overflow-y-auto pr-1">
          <div
            v-if="historyError"
            class="text-sm p-3 bg-red-100 text-red-700 rounded"
          >
            Konnte Änderungshistorie nicht laden.
          </div>

          <div
            v-else-if="historyPending"
            class="text-sm text-gray-500"
          >
            lädt…
          </div>

          <div
            v-else-if="historyEntries.length === 0"
            class="text-sm text-gray-500"
          >
            Keine Einträge vorhanden.
          </div>

          <div
            v-else
            class="flex flex-col gap-3"
          >
            <div
              v-for="entry in historyEntries"
              :key="entry.hash"
              class="flex flex-col justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded"
            >
              <div class="flex items-start justify-between gap-3 flex-1 w-full">
                <div>
                  <p class="font-bold">
                    {{ entry.authorName }}
                  </p>
                  <p class="text-xs text-gray-500 break-all">
                    {{ entry.authorEmail }}
                  </p>
                </div>
                <p class="text-sm text-gray-500">
                  {{ formatRelativeDate(entry.date) }}
                </p>
              </div>
              <p>
                Änderung: "{{ entry.subject }}"
              </p>
            </div>

            <div class="flex items-center justify-between pt-1">
              <button
                type="button"
                class="button secondary small"
                :disabled="historyPage <= 1 || historyPending"
                @click="goToHistoryPage(historyPage - 1)"
              >
                Zurück
              </button>
              <span class="text-xs text-gray-500">
                Seite {{ historyPage }}
              </span>
              <button
                type="button"
                class="button secondary small"
                :disabled="!hasNextHistoryPage || historyPending"
                @click="goToHistoryPage(historyPage + 1)"
              >
                Weiter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isUpdateModalOpen"
      class="fixed inset-0 bg-black/45 flex items-start justify-center p-4 z-9999 overflow-y-auto"
      role="presentation"
      @click.self="closeUpdateModal"
    >
      <div
        class="w-full max-w-140 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-4 max-h-[calc(100vh-2rem)] my-auto overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Version aktualisieren"
      >
        <div class="flex items-center justify-between gap-2">
          <h2 class="font-bold text-xl">
            {{ updateTitle }}
          </h2>
          <button
            type="button"
            class="button secondary small"
            @click="closeUpdateModal"
          >
            Schließen
          </button>
        </div>

        <p class="text-sm p-3 bg-gray-50 border border-gray-200 rounded">
          Achtung: Eine Aktualisierung ist sofort auf der Website sichtbar.
        </p>

        <p
          v-if="branchError"
          class="text-sm p-3 bg-red-100 text-red-700 rounded"
        >
          Konnte aktuellen Branch nicht laden.
        </p>

        <p
          v-else-if="updateStatusError"
          class="text-sm p-3 bg-red-100 text-red-700 rounded"
        >
          Konnte Branch-Status nicht laden.
        </p>

        <p
          v-else-if="isIdentical"
          class="text-sm p-3 bg-gray-50 border border-gray-200 rounded"
        >
          Die Branches sind identisch. Es sind keine neuen Änderungen verfügbar.
        </p>

        <p
          v-else-if="!isSupportedBranch || !canUpdate"
          class="text-sm p-3 bg-red-100 text-red-700 rounded"
        >
          {{ updateBlockedReason || `Unterstützt sind nur main oder staging. Aktuell: ${currentBranch}` }}
        </p>

        <label class="text-sm font-medium text-gray-700">
          Merge von Branch
        </label>
        <select
          v-model="selectedUpdateBranch"
          class="w-full border border-gray-200 rounded-sm px-3 py-2"
          :disabled="true"
        >
          <option :value="selectedUpdateBranch || ''">
            {{ selectedUpdateBranch || 'unbekannt' }}
          </option>
        </select>

        <p
          v-if="updateError"
          class="text-sm p-3 bg-red-100 text-red-700 rounded"
        >
          {{ updateError }}
        </p>
        <p
          v-if="updateSuccess"
          class="text-sm p-3 bg-emerald-100 text-emerald-800 rounded"
        >
          {{ updateSuccess }}
        </p>

        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="button secondary small"
            @click="closeUpdateModal"
          >
            Abbrechen
          </button>
          <button
            type="button"
            class="button small"
            :disabled="!isSupportedBranch || !canUpdate || isUpdating || isIdentical"
            @click="runUpdate"
          >
            {{ isUpdating ? 'Aktualisiert…' : 'Aktualisieren' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
