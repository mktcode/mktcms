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
        } else {
          inQuotes = false
        }
      } else {
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
  } finally {
    isApplyingFromContent = false
  }
}

function applyToContent() {
  if (isApplyingFromContent) return
  isApplyingToContent = true
  try {
    content.value = serializeSemicolonCsv({ headers: headers.value, rows: rows.value })
  } finally {
    isApplyingToContent = false
  }
}

watch(
  () => content.value,
  () => {
    if (isApplyingToContent) return
    applyFromContent()
  },
  { immediate: true }
)

watch(
  () => [headers.value, rows.value] as const,
  () => applyToContent(),
  { deep: true }
)

function addRow() {
  if (columnCount.value === 0) return
  rows.value.push(Array.from({ length: columnCount.value }, () => ''))
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
      <button type="button" @click="addRow">
        + Row
      </button>
      <span v-if="headers.length === 0" style="opacity: 0.7;">
        No headers found. Provide a CSV with a header row to edit rows.
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
              title="Header (not editable)"
            >
              <span>{{ h }}</span>
            </th>
            <th style="width: 1%; white-space: nowrap; border-bottom: 1px solid #d0d0d0; background: #f6f6f6; position: sticky; top: 0;" />
          </tr>
        </thead>

        <tbody>
          <tr v-for="(r, rowIndex) in rows" :key="rowIndex">
            <td
              v-for="(cell, colIndex) in r"
              :key="colIndex"
              style="padding: 6px; border-bottom: 1px solid #eee;"
            >
              <input
                :value="cell"
                type="text"
                @input="onCellInput(rowIndex, colIndex, ($event.target as HTMLInputElement).value)"
                style="width: 100%; box-sizing: border-box; padding: 6px; border: 1px solid #cfcfcf;"
              />
            </td>
            <td style="padding: 6px; border-bottom: 1px solid #eee; white-space: nowrap;">
              <button type="button" @click="removeRow(rowIndex)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>