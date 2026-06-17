import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Table, Loader, EmptyState, ErrorState, Button } from '../../components/ui'
import { getCustomers } from '../../services/customerService'
import useFilterPersistence from '../../hooks/useFilterPersistence'
import SEO from '../../components/SEO'
import { downloadCSV } from '../../utils/csv'

export default function Customers() {
  const [filters, setFilter] = useFilterPersistence('customers_filters', { search: '' })
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { key: '_id', label: 'Customer ID' },
    { key: 'totalBookings', label: 'Bookings' },
    { key: 'totalSpent', label: 'Total Spent', render: (r) => `₹${(r.totalSpent || 0).toLocaleString()}` },
    { key: 'avgDriverRating', label: 'Avg Rating', render: (r) => (r.avgDriverRating || 0).toFixed(1) },
    { key: 'lastBookingDate', label: 'Last Booking', render: (r) => r.lastBookingDate ? new Date(r.lastBookingDate).toLocaleDateString() : '-' },
  ]

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const params = { page: page + 1, limit }
      if (filters.search) params.search = filters.search
      const { data } = await getCustomers(params)
      setRows(data.data.customers || [])
      setPagination({ page, limit, total: data.data.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers')
    } finally { setLoading(false) }
  }, [filters])

  const csvFields = [
    { label: 'Customer ID', accessor: '_id' },
    { label: 'Bookings', accessor: 'totalBookings' },
    { label: 'Total Spent', accessor: (r) => r.totalSpent || 0 },
    { label: 'Avg Rating', accessor: (r) => (r.avgDriverRating || 0).toFixed(1) },
    { label: 'Last Booking', accessor: (r) => r.lastBookingDate ? new Date(r.lastBookingDate).toLocaleDateString() : '-' },
  ]

  useEffect(() => { fetchData() }, [fetchData]) // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <SEO title="Customers" />
        <Typography variant="h4" fontWeight={600}>Customers</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search customers..." value={filters.search || ''} onChange={(e) => setFilter('search', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
          <Button startIcon={<FileDownloadIcon />} onClick={() => downloadCSV(rows, csvFields, 'customers.csv')}>Export</Button>
        </Box>
      </Box>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No customers found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
