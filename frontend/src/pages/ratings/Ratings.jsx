import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import { Table, Loader, EmptyState, ErrorState } from '../../components/ui'
import { getRatings } from '../../services/ratingService'

export default function Ratings() {
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

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const { data } = await getRatings({ page: page + 1, limit })
      setRows(data.data.results || [])
      setPagination({ page, limit, total: data.data.pagination?.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ratings')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Ratings</Typography>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No ratings found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
