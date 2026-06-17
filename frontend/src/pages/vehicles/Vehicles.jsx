import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Table, Loader, EmptyState, ErrorState } from '../../components/ui'
import { getVehicles } from '../../services/vehicleService'
import SEO from '../../components/SEO'

export default function Vehicles() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const columns = [
    { key: 'vehicleType', label: 'Vehicle Type' },
    { key: 'totalBookings', label: 'Bookings' },
    { key: 'totalRevenue', label: 'Revenue', render: (r) => `₹${(r.totalRevenue || 0).toLocaleString()}` },
    { key: 'totalDistance', label: 'Distance (km)', render: (r) => (r.totalDistance || 0).toLocaleString() },
    { key: 'avgDriverRating', label: 'Avg Rating', render: (r) => (r.avgDriverRating || 0).toFixed(1) },
  ]

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const { data } = await getVehicles({ page: page + 1, limit })
      setRows(data.data.vehicles || [])
      setPagination({ page, limit, total: data.data.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <Box>
      <SEO title="Vehicles" />
      <Typography variant="h4" fontWeight={600} gutterBottom>Vehicles</Typography>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No vehicles found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
