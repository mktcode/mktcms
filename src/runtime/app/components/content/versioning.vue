<script setup lang="ts">
import { ref } from 'vue'

const currentBranch = ref('main')
const availableBranches = ['main', 'staging', 'develop']

const isHistoryModalOpen = ref(false)
const isUpdateModalOpen = ref(false)

const selectedUpdateBranch = ref(currentBranch.value)

function openHistoryModal() {
  isHistoryModalOpen.value = true
}

function openUpdateModal() {
  selectedUpdateBranch.value = currentBranch.value
  isUpdateModalOpen.value = true
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false
}

function closeUpdateModal() {
  isUpdateModalOpen.value = false
}
</script>

<template>
  <div class="text-sm text-gray-700">
    <div class="flex items-center justify-end gap-3">
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
            Änderungen aus Vorschau übernehmen
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

        <label class="text-sm font-medium text-gray-700">
          Branch auswählen
        </label>
        <select
          v-model="selectedUpdateBranch"
          class="w-full border border-gray-200 rounded-sm px-3 py-2"
        >
          <option
            v-for="branch in availableBranches"
            :key="`update-${branch}`"
            :value="branch"
          >
            {{ branch }}
          </option>
        </select>

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
          >
            Aktualisieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
