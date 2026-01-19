import Papa from 'papaparse'

export type CsvGrid = {
	headers: string[]
	rows: string[][]
}

function normalizeNewlines(text: string): string {
	return (text ?? '')
		.replace(/^\uFEFF/, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
}

function padToColumnCount(headerRow: string[], dataRows: string[][]): CsvGrid {
	const columnCount = Math.max(headerRow.length, ...dataRows.map(r => r.length), 0)
	const headers = Array.from({ length: columnCount }, (_, i) => headerRow[i] ?? '')
	const rows = dataRows.map(r => Array.from({ length: columnCount }, (_, i) => r[i] ?? ''))
	return { headers, rows }
}

/**
 * Parses a semicolon-separated CSV string into headers + rows.
 *
 * - Uses "" as an escaped quote inside quoted fields.
 * - Normalizes CRLF/CR to LF.
 * - Avoids creating a phantom empty last row when the input ends with a newline.
 */
export function parseSemicolonCsv(text: string): CsvGrid {
	const normalized = normalizeNewlines(text)
	if (!normalized.trim()) return { headers: [], rows: [] }

	const result = Papa.parse<string[]>(normalized, {
		delimiter: ';',
		newline: '\n',
		quoteChar: '"',
		escapeChar: '"',
		skipEmptyLines: 'greedy',
	})

	const parsedRows: string[][] = (result.data ?? []).map((r: string[]) => (r ?? []).map((cell: string) => cell ?? ''))
	const headerRow = parsedRows[0] ?? []
	return padToColumnCount(headerRow, parsedRows.slice(1))
}

export function serializeSemicolonCsv(grid: CsvGrid): string {
	return Papa.unparse(
		{
			fields: grid.headers,
			data: grid.rows,
		},
		{
			delimiter: ';',
			newline: '\n',
			quoteChar: '"',
			escapeChar: '"',
		},
	)
}
