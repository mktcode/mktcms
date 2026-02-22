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

const isHistoryModalOpen = ref(false)
const isUpdateModalOpen = ref(false)

const selectedUpdateBranch = ref('')
const isUpdating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')

const { data: branchData, pending: branchPending, error: branchError, refresh: refreshBranch } = await useFetch<GitBranchResponse>('/api/admin/git-branch', {
  key: 'mktcms-git-branch',
})

const currentBranch = computed(() => branchData.value?.currentBranch ?? 'unbekannt')
const isSupportedBranch = computed(() => branchData.value?.isSupported ?? false)
const sourceBranch = computed(() => branchData.value?.sourceBranch ?? '')
const canUpdate = computed(() => branchData.value?.canUpdate ?? false)
const updateBlockedReason = computed(() => branchData.value?.updateBlockedReason ?? '')
const updateTitle = computed(() => currentBranch.value === 'main'
  ? 'Änderungen aus Vorschau übernehmen'
  : currentBranch.value === 'staging'
    ? 'Änderungen von Live in Vorschau übernehmen'
    : 'Branch aktualisieren')

function openHistoryModal() {
  isHistoryModalOpen.value = true
}

function openUpdateModal() {
  selectedUpdateBranch.value = sourceBranch.value
  updateError.value = ''
  updateSuccess.value = ''
  isUpdateModalOpen.value = true
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false
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
        Branch: <strong>{{ currentBranch }}</strong>
      </span>
      <button
        type="button"
        class="button small tertiary"
        @click="openHistoryModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
        Änderungshistorie
      </button>
      <button
        type="button"
        class="button small tertiary"
        :disabled="branchPending || !!branchError"
        @click="openUpdateModal"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/></svg>
        Aktualisieren
      </button>
    </div>

    <div
      v-if="isHistoryModalOpen"
      class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
      role="presentation"
      @click.self="closeHistoryModal"
    >
      <div
        class="w-full max-w-140 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-4"
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

        <div class="flex flex-col gap-3">
          <div class="flex flex-col justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
            <div class="flex items-start justify-between gap-3 flex-1 w-full">
              <p class="font-bold">Max Mustermann</p>
              <p class="text-sm text-gray-500">vor 2 Stunden</p>
            </div>
            <p>
              Änderung: "Startseite: Neue Bilder hinzugefügt und Text aktualisiert"
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isUpdateModalOpen"
      class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
      role="presentation"
      @click.self="closeUpdateModal"
    >
      <div
        class="w-full max-w-140 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-6 flex flex-col gap-4"
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
            :disabled="!isSupportedBranch || !canUpdate || isUpdating"
            @click="runUpdate"
          >
            {{ isUpdating ? 'Aktualisiert…' : 'Aktualisieren' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
