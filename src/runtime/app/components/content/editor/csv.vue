<script setup lang="ts">
import { computed, ref } from 'vue'
import useSaveContent from '../../../composables/useSaveContent'
import { parseSemicolonCsv, serializeSemicolonCsv } from '../../../util/csv'
import Saved from '../saved.vue'

const { content, saveContent, isSaving, savingSuccessful } = await useSaveContent()
const parsedCsv = parseSemicolonCsv(content.value)

const headers = ref<string[]>(parsedCsv.headers)
const rows = ref<string[][]>(parsedCsv.rows)
const hasUnsavedChanges = ref(false)
const columnCount = computed(() => headers.value.length)

async function saveCsv() {
  const serializedCsv = serializeSemicolonCsv({ headers: headers.value, rows: rows.value })
  content.value = serializedCsv
  await saveContent()
  hasUnsavedChanges.value = false
}

function getHeaderLabel(colIndex: number): string {
  return headers.value[colIndex] || `Spalte ${colIndex + 1}`
}

function insertRow(atIndex: number) {
  const newRow = Array(columnCount.value).fill('')
  rows.value.splice(atIndex, 0, newRow)
  hasUnsavedChanges.value = true
}

function removeRow(rowIndex: number) {
  rows.value.splice(rowIndex, 1)
  hasUnsavedChanges.value = true
}

function moveRowUp(rowIndex: number) {
  if (rowIndex <= 0) return
  const row = rows.value.splice(rowIndex, 1)[0]
  if (!row) return
  rows.value.splice(rowIndex - 1, 0, row)
  hasUnsavedChanges.value = true
}

function moveRowDown(rowIndex: number) {
  if (rowIndex >= rows.value.length - 1) return
  const row = rows.value.splice(rowIndex, 1)[0]
  if (!row) return
  rows.value.splice(rowIndex + 1, 0, row)
  hasUnsavedChanges.value = true
}

const editingCell = ref<{ rowIndex: number, colIndex: number } | null>(null)
const editBuffer = ref('')

function startEdit(rowIndex: number, colIndex: number) {
  editingCell.value = { rowIndex, colIndex }
  editBuffer.value = rows.value[rowIndex]![colIndex] || ''
}

function saveEdit() {
  if (!editingCell.value) return
  const { rowIndex, colIndex } = editingCell.value
  rows.value[rowIndex]![colIndex] = editBuffer.value
  hasUnsavedChanges.value = true
  cancelEdit()
}

function cancelEdit() {
  editingCell.value = null
  editBuffer.value = ''
}
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 mb-2.5">
      <span
        v-if="headers.length === 0"
        class="opacity-70 text-sm"
      >
        Keine Kopfzeile gefunden. Bitte eine CSV mit Kopfzeile bereitstellen, um Zeilen zu bearbeiten.
      </span>
    </div>

    <div class="bg-white">
      <div class="flex items-center h-0 justify-center border border-gray-200 rounded-sm mb-6">
        <button
          type="button"
          class="button small soft"
          :disabled="headers.length === 0"
          @click="insertRow(0)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      <div>
        <template
          v-for="(r, rowIndex) in rows"
          :key="rowIndex"
        >
          <div
            class="flex items-stretch rounded-sm border border-gray-200"
          >
            <div class="flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
              <div class="grid grid-flow-col auto-cols-[minmax(160px,1fr)] max-[640px]:auto-cols-[minmax(220px,1fr)]">
                <div
                  v-for="(cell, colIndex) in r"
                  :key="colIndex"
                  class="p-1.5 border-r border-gray-200 box-border last:border-r-0"
                >
                  <div class="text-xs mb-1.5 leading-tight wrap-break-word flex items-center justify-between gap-1">
                    {{ getHeaderLabel(colIndex) }}
                  </div>
                  <div
                    class="text-xs whitespace-pre-line wrap-break-word border border-gray-300/70 rounded bg-gray-50 p-1.5 min-h-9.5 leading-[1.35] box-border overflow-hidden line-clamp-4 h-[calc(4*1.35*1em+12px)] max-[640px]:line-clamp-3 max-[640px]:h-[calc(3*1.35*1em+12px)] cursor-pointer"
                    :title="cell"
                    @click="startEdit(rowIndex, colIndex)"
                  >
                    {{ cell || '—' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-none flex flex-col items-start gap-1 p-1.5 border-l border-gray-200 bg-white max-[640px]:px-1 max-[640px]:gap-0.5">
              <button
                type="button"
                class="button small"
                :disabled="rowIndex === 0"
                aria-label="Zeile nach oben"
                title="Nach oben"
                @click="moveRowUp(rowIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="button small"
                :disabled="rowIndex === rows.length - 1"
                aria-label="Zeile nach unten"
                title="Nach unten"
                @click="moveRowDown(rowIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="button small"
                aria-label="Zeile löschen"
                title="Löschen"
                @click="removeRow(rowIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="h-0 flex items-center justify-center border border-gray-200 rounded-sm my-6">
            <button
              type="button"
              class="button small"
              :disabled="headers.length === 0"
              @click="insertRow(rowIndex + 1)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>

    <button
      type="button"
      class="button w-full mt-3 justify-center"
      @click="saveCsv"
    >
      <span v-if="isSaving">Speichern...</span>
      <span v-else>Speichern</span>
    </button>
    <Saved v-if="savingSuccessful && !hasUnsavedChanges" />

    <div
      v-if="editingCell"
      class="fixed inset-0 bg-black/45 flex items-center justify-center p-4 z-9999"
      role="presentation"
      @click.self="cancelEdit()"
    >
      <div
        class="w-full max-w-180 bg-white rounded-[10px] border border-black/10 shadow-[0_10px_40px_rgba(0,0,0,0.28)] p-3.5 flex flex-col gap-2.5"
        role="dialog"
        aria-modal="true"
        :aria-label="`CSV-Zelle bearbeiten: ${getHeaderLabel(editingCell.colIndex)}`"
      >
        <div class="flex flex-col gap-0.5">
          <div class="font-bold">
            Zelle bearbeiten
          </div>
          <div class="opacity-75 text-[13px]">
            {{ getHeaderLabel(editingCell.colIndex) }} · Zeile {{ editingCell.rowIndex + 1 }}
          </div>
        </div>

        <textarea
          id="csv-edit-textarea"
          v-model="editBuffer"
          class="w-full box-border p-2.5 border border-gray-300 rounded-lg resize-y min-h-40 font-[inherit] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          rows="8"
        />

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="button"
            @click="saveEdit()"
          >
            schließen
          </button>
          <button
            type="button"
            class="button secondary"
            @click="cancelEdit()"
          >
            zurücksetzen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
