import { useState } from 'react'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

export default function Table({
  columns,
  rows,
  loading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortBy,
  sortOrder,
  emptyMessage = 'No data found',
}) {
  const [localSortBy, setLocalSortBy] = useState('')
  const [localSortOrder, setLocalSortOrder] = useState('asc')

  const activeSortBy = sortBy !== undefined ? sortBy : localSortBy
  const activeSortOrder = sortOrder !== undefined ? sortOrder : localSortOrder

  const handleSort = (key) => {
    const isAsc = activeSortBy === key && activeSortOrder === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    if (onSort) {
      onSort(key, newOrder)
    } else {
      setLocalSortBy(key)
      setLocalSortOrder(newOrder)
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={activeSortBy === col.key}
                      direction={activeSortBy === col.key ? activeSortOrder : 'asc'}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage || 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={row._id || i} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {total !== undefined && (
        <TablePagination
          component="div"
          count={total}
          page={page || 0}
          onPageChange={onPageChange || (() => {})}
          rowsPerPage={rowsPerPage || 10}
          onRowsPerPageChange={onRowsPerPageChange || (() => {})}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  )
}
