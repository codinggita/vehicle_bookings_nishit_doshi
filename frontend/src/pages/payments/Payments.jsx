import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Table, Loader, EmptyState, ErrorState, Button } from '../../components/ui'
import { getPayments } from '../../services/paymentService'
import useFilterPersistence from '../../hooks/useFilterPersistence'
import SEO from '../../components/SEO'
import { downloadCSV } from '../../utils/csv'

export default function Payments() {
  const [filters, setFilter] = useFilterPersistence('payments_filters', { search: '' })
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'paymentMethod', label: 'Method', render: (r) => <Chip label={r.paymentMethod || '-'} size="small" /> },
    { key: 'bookingValue', label: 'Amount', render: (r) => `₹${(r.bookingValue || 0).toLocaleString()}` },
    { key: 'date', label: 'Date', render: (r) => r.date ? new Date(r.date).toLocaleDateString() : '-' },
    { key: 'bookingStatus', label: 'Status', render: (r) => <Chip label={r.bookingStatus || '-'} size="small" color={r.bookingStatus === 'Success' ? 'success' : 'default'} /> },
  ]

  const csvFields = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'bookingValue', label: 'Amount', accessor: (r) => r.bookingValue || 0 },
    { key: 'date', label: 'Date', accessor: (r) => r.date ? new Date(r.date).toLocaleDateString() : '-' },
    { key: 'bookingStatus', label: 'Status' },
  ]

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const params = { page: page + 1, limit }
      if (filters.search) params.search = filters.search
      const { data } = await getPayments(params)
      setRows(data.data.results || [])
      setPagination({ page, limit, total: data.data.pagination?.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData]) // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <Box>
      <SEO title="Payments" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" fontWeight={600}>Payments</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search payments..." value={filters.search || ''} onChange={(e) => setFilter('search', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
          <Button startIcon={<FileDownloadIcon />} onClick={() => downloadCSV(rows, csvFields, 'payments.csv')}>Export</Button>
        </Box>
      </Box>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No payments found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
