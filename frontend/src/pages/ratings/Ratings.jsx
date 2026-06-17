import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Table, Loader, EmptyState, ErrorState, Button } from '../../components/ui'
import { getRatings } from '../../services/ratingService'
import useFilterPersistence from '../../hooks/useFilterPersistence'
import SEO from '../../components/SEO'
import { downloadCSV } from '../../utils/csv'

export default function Ratings() {
  const [filters, setFilter] = useFilterPersistence('ratings_filters', { search: '' })
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'customerId', label: 'Customer ID' },
    { key: 'driverRating', label: 'Driver Rating', render: (r) => <Rating value={r.driverRating || 0} readOnly size="small" /> },
    { key: 'customerRating', label: 'Customer Rating', render: (r) => <Rating value={r.customerRating || 0} readOnly size="small" /> },
    { key: 'vehicleType', label: 'Vehicle' },
    { key: 'date', label: 'Date', render: (r) => r.date ? new Date(r.date).toLocaleDateString() : '-' },
  ]

  const csvFields = [
    { label: 'Booking ID', accessor: 'bookingId' },
    { label: 'Customer ID', accessor: 'customerId' },
    { label: 'Driver Rating', accessor: (r) => r.driverRating || 0 },
    { label: 'Customer Rating', accessor: (r) => r.customerRating || 0 },
    { label: 'Vehicle', accessor: 'vehicleType' },
    { label: 'Date', accessor: (r) => r.date ? new Date(r.date).toLocaleDateString() : '-' },
  ]

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const params = { page: page + 1, limit }
      if (filters.search) params.search = filters.search
      const { data } = await getRatings(params)
      setRows(data.data.results || [])
      setPagination({ page, limit, total: data.data.pagination?.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ratings')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData]) // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <Box>
      <SEO title="Ratings" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" fontWeight={600}>Ratings</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search ratings..." value={filters.search || ''} onChange={(e) => setFilter('search', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
          <Button startIcon={<FileDownloadIcon />} onClick={() => downloadCSV(rows, csvFields, 'ratings.csv')}>Export</Button>
        </Box>
      </Box>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No ratings found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
