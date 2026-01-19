<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
const tableColspan = computed(() => Math.max(headers.value.length, 1) + 1)

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
</script>

<template>
  <div style="width: 100%;">
    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center;">
      <span
        v-if="headers.length === 0"
        style="opacity: 0.7;"
      >
        Keine Kopfzeile gefunden. Bitte eine CSV mit Kopfzeile bereitstellen, um Zeilen zu bearbeiten.
      </span>
    </div>

    <div style="overflow: auto; border: 1px solid #d0d0d0;">
      <table style="width: 100%; border-collapse: collapse; min-width: 520px;">
        <thead>
          <tr>
            <th
              v-for="(h, colIndex) in headers"
              :key="colIndex"
              style="text-align: left; padding: 8px; border-bottom: 1px solid #d0d0d0; background: #f6f6f6; position: sticky; top: 0;"
              title="Kopfzeile (nicht editierbar)"
            >
              <span>{{ h }}</span>
            </th>
            <th style="width: 1%; white-space: nowrap; border-bottom: 1px solid #d0d0d0; background: #f6f6f6; position: sticky; top: 0;" />
          </tr>
          <tr>
            <td
              :colspan="tableColspan"
              style="padding: 6px; border-bottom: 1px solid #eee; background: #fafafa;"
            >
            <button
              type="button"
              :disabled="headers.length === 0"
              @click="insertRow(0)"
            >
              Zeile einfügen
            </button>
            </td>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="(r, rowIndex) in rows"
            :key="rowIndex"
          >
            <tr>
              <td
                v-for="(cell, colIndex) in r"
                :key="colIndex"
                style="padding: 6px; border-bottom: 1px solid #eee;"
              >
                <textarea
                  :value="cell"
                  type="text"
                  style="width: 100%; box-sizing: border-box; padding: 6px; border: 1px solid #cfcfcf; resize: vertical;"
                  @input="onCellInput(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                />
              </td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; white-space: nowrap;">
                <div style="display: flex; gap: 4px;">
                  <button
                    type="button"
                    :disabled="rowIndex === 0"
                    @click="moveRowUp(rowIndex)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    :disabled="rowIndex === rows.length - 1"
                    @click="moveRowDown(rowIndex)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="removeRow(rowIndex)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="button-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td
                :colspan="tableColspan"
                style="padding: 6px; border-bottom: 1px solid #eee; background: #fafafa;"
              >
                <button
                  type="button"
                  @click="insertRow(rowIndex + 1)"
                >
                  Zeile einfügen
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
