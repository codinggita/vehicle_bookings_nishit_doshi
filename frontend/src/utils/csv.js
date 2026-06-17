export function downloadCSV(rows, fields, filename) {
  const headers = fields.map(f => f.label)
  const csvRows = [headers.join(',')]

  for (const row of rows) {
    const values = fields.map(f => {
      let val = typeof f.accessor === 'function' ? f.accessor(row) : row[f.accessor]
      if (val === null || val === undefined) val = ''
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    })
    csvRows.push(values.join(','))
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
