import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { Table, Loader, EmptyState, ErrorState, Button } from '../../components/ui'
import { getVehicles } from '../../services/vehicleService'
import useFilterPersistence from '../../hooks/useFilterPersistence'
import SEO from '../../components/SEO'
import { downloadCSV } from '../../utils/csv'

export default function Vehicles() {
  const [filters, setFilter] = useFilterPersistence('vehicles_filters', { search: '' })
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { key: '_id', label: 'Vehicle Type' },
    { key: 'totalBookings', label: 'Bookings' },
    { key: 'totalRevenue', label: 'Revenue', render: (r) => `₹${(r.totalRevenue || 0).toLocaleString()}` },
    { key: 'totalDistance', label: 'Distance (km)', render: (r) => (r.totalDistance || 0).toLocaleString() },
    { key: 'avgDriverRating', label: 'Avg Rating', render: (r) => (r.avgDriverRating || 0).toFixed(1) },
  ]

  const csvFields = [
    { label: 'Vehicle Type', accessor: '_id' },
    { label: 'Bookings', accessor: 'totalBookings' },
    { label: 'Revenue', accessor: (r) => r.totalRevenue || 0 },
    { label: 'Distance (km)', accessor: (r) => r.totalDistance || 0 },
    { label: 'Avg Rating', accessor: (r) => (r.avgDriverRating || 0).toFixed(1) },
  ]

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const params = { page: page + 1, limit }
      if (filters.search) params.search = filters.search
      const { data } = await getVehicles(params)
      setRows(data.data.vehicles || [])
      setPagination({ page, limit, total: data.data.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles')
    } finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData]) // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <Box>
      <SEO title="Vehicles" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h4" fontWeight={600}>Vehicles</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search vehicles..." value={filters.search || ''} onChange={(e) => setFilter('search', e.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
          <Button startIcon={<FileDownloadIcon />} onClick={() => downloadCSV(rows, csvFields, 'vehicles.csv')}>Export</Button>
        </Box>
      </Box>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No vehicles found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
