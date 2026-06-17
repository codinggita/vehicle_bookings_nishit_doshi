import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { Table, Loader, EmptyState, ErrorState } from '../../components/ui'
import { getPayments } from '../../services/paymentService'

export default function Payments() {
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

  const fetchData = useCallback(async (page = 0, limit = 10) => {
    setLoading(true); setError(null)
    try {
      const { data } = await getPayments({ page: page + 1, limit })
      setRows(data.data.results || [])
      setPagination({ page, limit, total: data.data.pagination?.total || 0 })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load payments')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Payments</Typography>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => fetchData()} /> : rows.length === 0 ? <EmptyState message="No payments found" /> : (
        <Table columns={columns} rows={rows} loading={false} page={pagination.page} rowsPerPage={pagination.limit} total={pagination.total} onPageChange={(_, page) => fetchData(page, pagination.limit)} onRowsPerPageChange={(e) => fetchData(0, parseInt(e.target.value))} />
      )}
    </Box>
  )
}
