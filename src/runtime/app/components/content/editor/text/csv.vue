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

function onModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    cancelEdit()
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    saveEdit()
  }
}

function isEditing(rowIndex: number, colIndex: number) {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.colIndex === colIndex
}
</script>

<template>
  <div class="csv-editor">
    <div class="csv-toolbar">
      <span
        v-if="headers.length === 0"
        class="csv-hint"
      >
        Keine Kopfzeile gefunden. Bitte eine CSV mit Kopfzeile bereitstellen, um Zeilen zu bearbeiten.
      </span>
    </div>

    <div class="csv-frame">
      <div class="csv-insert csv-insert--top">
        <button
          type="button"
          class="csv-btn csv-btn--primary"
          :disabled="headers.length === 0"
          @click="insertRow(0)"
        >
          Zeile einfügen
        </button>
      </div>

      <div class="csv-body">
        <template
          v-for="(r, rowIndex) in rows"
          :key="rowIndex"
        >
          <div
            class="csv-row"
            :style="{ '--cols': columnCount }"
          >
            <div class="csv-scroll">
              <div class="csv-cells">
                <div
                  v-for="(cell, colIndex) in r"
                  :key="colIndex"
                  class="csv-cell"
                >
                  <div class="csv-cell-label">
                    {{ getHeaderLabel(colIndex) }}
                  </div>
                  <div class="csv-preview">
                    <div class="csv-preview-text" :title="cell">
                      {{ cell || '—' }}
                    </div>
                    <button
                      type="button"
                      class="csv-btn csv-btn--primary csv-btn--small"
                      @click="startEdit(rowIndex, colIndex)"
                    >
                      Bearbeiten
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="csv-actions">
              <button
                type="button"
                class="csv-action"
                :disabled="rowIndex === 0"
                aria-label="Zeile nach oben"
                title="Nach oben"
                @click="moveRowUp(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              </button>
              <button
                type="button"
                class="csv-action"
                :disabled="rowIndex === rows.length - 1"
                aria-label="Zeile nach unten"
                title="Nach unten"
                @click="moveRowDown(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
              </button>
              <button
                type="button"
                class="csv-action csv-action--danger"
                aria-label="Zeile löschen"
                title="Löschen"
                @click="removeRow(rowIndex)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <div class="csv-insert csv-insert--after">
            <button
              type="button"
              class="csv-btn csv-btn--primary"
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
        class="csv-modal-overlay"
        role="presentation"
        @click.self="cancelEdit()"
        @keydown.capture="onModalKeydown"
      >
        <div
          class="csv-modal"
          role="dialog"
          aria-modal="true"
          :aria-label="`CSV-Zelle bearbeiten: ${getHeaderLabel(editingCell.colIndex)}`"
        >
          <div class="csv-modal-header">
            <div class="csv-modal-title">Zelle bearbeiten</div>
            <div class="csv-modal-subtitle">
              {{ getHeaderLabel(editingCell.colIndex) }} · Zeile {{ editingCell.rowIndex + 1 }}
            </div>
          </div>

          <textarea
            id="csv-edit-textarea"
            v-model="editBuffer"
            class="csv-modal-textarea"
            rows="8"
          />

          <div class="csv-modal-actions">
            <button type="button" class="csv-btn csv-btn--primary" @click="saveEdit()">Speichern</button>
            <button type="button" class="csv-btn csv-btn--secondary" @click="cancelEdit()">Abbrechen</button>
          </div>

          <div class="csv-modal-hint">
            Tipp: <span class="csv-kbd">Esc</span> zum Schließen, <span class="csv-kbd">Strg</span>+<span class="csv-kbd">Enter</span> zum Speichern.
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.csv-editor {
  width: 100%;
}

.csv-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.csv-hint {
  opacity: 0.7;
}

.csv-frame {
  border: none;
  border-radius: 6px;
  overflow: clip;
  background: #fff;
}

.csv-body {
  display: block;
}

.csv-row {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #eee;
}

.csv-scroll {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.csv-cells {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(160px, 1fr));
}

.csv-cell {
  padding: 6px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
}

.csv-cell:last-child {
  border-right: none;
}


.csv-cell-label {
  font-size: 12px;
  opacity: 0.75;
  margin-bottom: 6px;
  line-height: 1.2;
  word-break: break-word;
}

.csv-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.csv-preview-text {
  --preview-lines: 4;
  --preview-line-height: 1.35;
  font-size: 12px;
  white-space: pre-line;
  word-break: break-word;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  background: #fbfbfb;
  padding: 6px;
  min-height: 38px;
  line-height: var(--preview-line-height);
  box-sizing: border-box;
  height: calc(var(--preview-lines) * var(--preview-line-height) * 1em + 12px);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--preview-lines);
  line-clamp: var(--preview-lines);
  overflow: hidden;
}

.csv-btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 8px 12px;
  font: inherit;
  font-size: 13px;
  line-height: 1.1;
  cursor: pointer;
  user-select: none;
}

.csv-btn--small {
  padding: 6px 10px;
  font-size: 12px;
}

.csv-btn--primary {
  background: #1f7a4a;
  border-color: #1f7a4a;
  color: #fff;
}

.csv-btn--primary:hover {
  background: #17633c;
  border-color: #17633c;
}

.csv-btn--secondary {
  background: #fff;
  border-color: #cfcfcf;
  color: #222;
}

.csv-btn--secondary:hover {
  background: #f4f4f4;
}

.csv-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.csv-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
}

.csv-modal {
  width: min(720px, 100%);
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.28);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.csv-modal-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.csv-modal-title {
  font-weight: 700;
}

.csv-modal-subtitle {
  opacity: 0.75;
  font-size: 13px;
}

.csv-modal-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #cfcfcf;
  border-radius: 8px;
  resize: vertical;
  min-height: 160px;
  font: inherit;
}

.csv-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.csv-modal-hint {
  opacity: 0.75;
  font-size: 12px;
}

.csv-kbd {
  display: inline-block;
  border: 1px solid #ddd;
  border-bottom-color: #bbb;
  padding: 0 6px;
  border-radius: 6px;
  background: #fafafa;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 11px;
  line-height: 18px;
}

.csv-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  resize: vertical;
  min-height: 38px;
  font: inherit;
}

.csv-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 6px;
  border-left: 1px solid #eee;
  background: #fff;
}

.csv-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  padding: 0;
  border: 1px solid #cfcfcf;
  background: #fff;
  color: #1f7a4a;
  cursor: pointer;
}

.csv-action:hover:not(:disabled) {
  background: #f4f4f4;
}

.csv-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.csv-action .button-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.csv-action--danger {
  color: #a30000;
  border-color: #e4b7b7;
}

.csv-action--danger:hover:not(:disabled) {
  background: #fff2f2;
}

.csv-insert {
  padding: 6px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.csv-insert--top {
  border-bottom: 1px solid #eee;
}

.csv-insert--after {
  border-bottom: 1px solid #eee;
}

@media (max-width: 640px) {
  .csv-cells {
    grid-template-columns: repeat(var(--cols), minmax(220px, 1fr));
  }

  .csv-actions {
    padding: 6px 4px;
    gap: 2px;
  }

  .csv-action {
    width: 36px;
    height: 36px;
  }

  .csv-preview-text {
    --preview-lines: 3;
  }

  .csv-btn {
    padding: 10px 12px;
    font-size: 14px;
  }

  .csv-btn--small {
    padding: 8px 10px;
    font-size: 13px;
  }
}
</style>
