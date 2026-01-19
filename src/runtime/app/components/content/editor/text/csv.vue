<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const content = defineModel<string>('content', { default: '' })

type CsvGrid = {
  headers: string[]
  rows: string[][]
}

function parseSemicolonCsv(text: string): CsvGrid {
  const normalized = (text ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  if (!normalized.trim()) {
    return { headers: [], rows: [] }
  }

  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]

    if (inQuotes) {
      if (ch === '"') {
        const next = normalized[i + 1]
        if (next === '"') {
          field += '"'
          i++
        }
        else {
          inQuotes = false
        }
      }
      else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ';') {
      row.push(field)
      field = ''
      continue
    }

    if (ch === '\n') {
      row.push(field)
      field = ''
      // Skip trailing empty line at EOF
      if (!(row.length === 1 && row[0] === '' && i === normalized.length - 1)) {
        rows.push(row)
      }
      row = []
      continue
    }

    field += ch
  }

  row.push(field)
  rows.push(row)

  const headers = rows[0] ?? []
  const dataRows = rows.slice(1)

  const columnCount = Math.max(headers.length, ...dataRows.map(r => r.length), 0)
  const paddedHeaders = Array.from({ length: columnCount }, (_, i) => headers[i] ?? '')
  const paddedRows = dataRows.map(r => Array.from({ length: columnCount }, (_, i) => r[i] ?? ''))

  return { headers: paddedHeaders, rows: paddedRows }
}

function escapeSemicolonCsvField(value: string): string {
  const v = value ?? ''
  if (/[";\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`
  }
  return v
}

function serializeSemicolonCsv(grid: CsvGrid): string {
  const allRows = [grid.headers, ...grid.rows]
  return allRows
    .map(r => r.map(escapeSemicolonCsvField).join(';'))
    .join('\n')
}

const headers = ref<string[]>([])
const rows = ref<string[][]>([])

const columnCount = computed(() => headers.value.length)

let isApplyingFromContent = false
let isApplyingToContent = false

function applyFromContent() {
  isApplyingFromContent = true
  try {
    const grid = parseSemicolonCsv(content.value)
    headers.value = grid.headers
    rows.value = grid.rows
  }
  finally {
    isApplyingFromContent = false
  }
}

function applyToContent() {
  if (isApplyingFromContent) return
  isApplyingToContent = true
  try {
    content.value = serializeSemicolonCsv({ headers: headers.value, rows: rows.value })
  }
  finally {
    isApplyingToContent = false
  }
}

watch(
  () => content.value,
  () => {
    if (isApplyingToContent) return
    applyFromContent()
  },
  { immediate: true },
)

watch(
  () => [headers.value, rows.value] as const,
  () => applyToContent(),
  { deep: true },
)

function insertRow(atIndex: number) {
  if (columnCount.value === 0) return
  const clamped = Math.max(0, Math.min(atIndex, rows.value.length))
  rows.value.splice(clamped, 0, Array.from({ length: columnCount.value }, () => ''))
}

function moveRowUp(index: number) {
  if (index <= 0) return
  const tmp = rows.value[index - 1]
  rows.value[index - 1] = rows.value[index]!
  rows.value[index] = tmp!
}

function moveRowDown(index: number) {
  if (index < 0 || index >= rows.value.length - 1) return
  const tmp = rows.value[index + 1]
  rows.value[index + 1] = rows.value[index]!
  rows.value[index] = tmp!
}

function removeRow(index: number) {
  rows.value.splice(index, 1)
}

function onCellInput(rowIndex: number, colIndex: number, value: string) {
  const row = rows.value[rowIndex]
  if (!row) return
  row[colIndex] = value
}

type EditingCell = { rowIndex: number, colIndex: number }

const editingCell = ref<EditingCell | null>(null)
const editBuffer = ref('')
const editOriginal = ref('')

function getHeaderLabel(colIndex: number) {
  const label = headers.value[colIndex] ?? ''
  return label.trim() ? label : `Spalte ${colIndex + 1}`
}

function startEdit(rowIndex: number, colIndex: number) {
  const current = rows.value[rowIndex]?.[colIndex] ?? ''
  editingCell.value = { rowIndex, colIndex }
  editOriginal.value = current
  editBuffer.value = current
  nextTick(() => {
    const el = document.getElementById('csv-edit-textarea') as HTMLTextAreaElement | null
    el?.focus()
    el?.select()
  })
}

function cancelEdit() {
  editingCell.value = null
  editBuffer.value = ''
  editOriginal.value = ''
}

function saveEdit() {
  const cell = editingCell.value
  if (!cell) return
  const row = rows.value[cell.rowIndex]
  if (!row) return
  row[cell.colIndex] = editBuffer.value
  cancelEdit()
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

    <div class="rounded-md overflow-hidden bg-white">
      <div class="p-1.5 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          class="appearance-none border rounded-md px-3 py-2 font-[inherit] text-[13px] leading-[1.1] cursor-pointer select-none bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 hover:border-emerald-800 disabled:opacity-55 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          :disabled="headers.length === 0"
          @click="insertRow(0)"
        >
          Zeile einfügen
        </button>
      </div>

      <div class="block">
        <template
          v-for="(r, rowIndex) in rows"
          :key="rowIndex"
        >
          <div
            class="flex items-stretch border-b border-gray-200"
          >
            <div class="flex-1 min-w-0 overflow-x-auto overflow-y-hidden">
              <div class="grid grid-flow-col auto-cols-[minmax(160px,1fr)] max-[640px]:auto-cols-[minmax(220px,1fr)]">
                <div
                  v-for="(cell, colIndex) in r"
                  :key="colIndex"
                  class="p-1.5 border-r border-gray-200 box-border last:border-r-0"
                >
                  <div class="text-xs opacity-75 mb-1.5 leading-tight wrap-break-word">
                    {{ getHeaderLabel(colIndex) }}
                  </div>
                  <div class="flex flex-col gap-2">
                    <div
                      class="text-xs whitespace-pre-line wrap-break-word border border-gray-300/70 rounded bg-gray-50 p-1.5 min-h-9.5 leading-[1.35] box-border overflow-hidden line-clamp-4 h-[calc(4*1.35*1em+12px)] max-[640px]:line-clamp-3 max-[640px]:h-[calc(3*1.35*1em+12px)]"
                      :title="cell"
                    >
                      {{ cell || '—' }}
                    </div>
                    <button
                      type="button"
                      class="appearance-none border rounded-md px-2.5 py-1.5 font-[inherit] text-xs leading-[1.1] cursor-pointer select-none bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 hover:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      @click="startEdit(rowIndex, colIndex)"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-none flex items-start gap-1 p-1.5 border-l border-gray-200 bg-white max-[640px]:px-1 max-[640px]:gap-0.5">
              <button
                type="button"
                class="inline-flex items-center justify-center w-8.5 h-8.5 rounded-md p-0 border border-gray-300 bg-white text-emerald-700 cursor-pointer hover:bg-gray-100 disabled:opacity-45 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 max-[640px]:w-9 max-[640px]:h-9"
                :disabled="rowIndex === 0"
                aria-label="Zeile nach oben"
                title="Nach oben"
                @click="moveRowUp(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4.5 h-4.5 block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center w-8.5 h-8.5 rounded-md p-0 border border-gray-300 bg-white text-emerald-700 cursor-pointer hover:bg-gray-100 disabled:opacity-45 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 max-[640px]:w-9 max-[640px]:h-9"
                :disabled="rowIndex === rows.length - 1"
                aria-label="Zeile nach unten"
                title="Nach unten"
                @click="moveRowDown(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4.5 h-4.5 block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center w-8.5 h-8.5 rounded-md p-0 border border-red-200 bg-white text-red-800 cursor-pointer hover:bg-red-50 disabled:opacity-45 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500/20 max-[640px]:w-9 max-[640px]:h-9"
                aria-label="Zeile löschen"
                title="Löschen"
                @click="removeRow(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4.5 h-4.5 block">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-1.5 bg-gray-50 border-b border-gray-200">
            <button
              type="button"
              class="appearance-none border rounded-md px-3 py-2 font-[inherit] text-[13px] leading-[1.1] cursor-pointer select-none bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 hover:border-emerald-800 disabled:opacity-55 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              :disabled="headers.length === 0"
              @click="insertRow(rowIndex + 1)"
            >
              Zeile einfügen
            </button>
          </div>
        </template>
      </div>
    </div>

    <Teleport to="body">
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
            <div class="font-bold">Zelle bearbeiten</div>
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
              class="appearance-none border rounded-md px-3 py-2 font-[inherit] text-[13px] leading-[1.1] cursor-pointer select-none bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800 hover:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              @click="saveEdit()"
            >
              Speichern
            </button>
            <button
              type="button"
              class="appearance-none border rounded-md px-3 py-2 font-[inherit] text-[13px] leading-[1.1] cursor-pointer select-none bg-white border-gray-300 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
              @click="cancelEdit()"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
