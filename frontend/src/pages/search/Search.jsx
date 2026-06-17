import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import { Table, Loader, EmptyState, ErrorState } from '../../components/ui'
import { searchAll, searchByBookingId, searchByCustomerId, searchByPayment, searchByVehicle, searchByLocation, searchByCancelReason, searchByIncomplete, searchByRating } from '../../services/searchService'
import SEO from '../../components/SEO'

const modes = [
  { value: 'all', label: 'Keyword Search', params: ['keyword'] },
  { value: 'bookingId', label: 'By Booking ID', params: ['bookingId'] },
  { value: 'customerId', label: 'By Customer ID', params: ['customerId'] },
  { value: 'payment', label: 'By Payment Method', params: ['method'] },
  { value: 'vehicle', label: 'By Vehicle Type', params: ['type'] },
  { value: 'location', label: 'By Location', params: ['pickup', 'drop'] },
  { value: 'cancelReason', label: 'By Cancel Reason', params: ['reason'] },
  { value: 'incomplete', label: 'By Incomplete Reason', params: ['reason'] },
  { value: 'rating', label: 'By Rating', params: ['driver', 'customer'] },
]

const fnMap = {
  all: searchAll,
  bookingId: searchByBookingId,
  customerId: searchByCustomerId,
  payment: searchByPayment,
  vehicle: searchByVehicle,
  location: searchByLocation,
  cancelReason: searchByCancelReason,
  incomplete: searchByIncomplete,
  rating: searchByRating,
}

export default function Search() {
  const [mode, setMode] = useState('all')
  const [inputs, setInputs] = useState({})
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const currentMode = modes.find((m) => m.value === mode)

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }))
  }, [])

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'date', label: 'Date', render: (r) => r.date ? new Date(r.date).toLocaleDateString() : '-' },
    { key: 'vehicleType', label: 'Vehicle' },
    { key: 'bookingStatus', label: 'Status', render: (r) => <Chip label={r.bookingStatus} size="small" color={r.bookingStatus === 'Success' ? 'success' : r.bookingStatus?.toLowerCase().includes('cancel') ? 'error' : 'default'} /> },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'dropLocation', label: 'Drop' },
    { key: 'bookingValue', label: 'Value', render: (r) => `₹${r.bookingValue?.toLocaleString()}` },
    { key: 'paymentMethod', label: 'Payment' },
  ]

  const handleSearch = useCallback(async (page = 0, limit = 10) => {
    const fn = fnMap[mode]
    if (!fn) return
    const params = { page: page + 1, limit }
    currentMode.params.forEach((p) => { if (inputs[p]) params[p] = inputs[p] })
    setLoading(true)
    setError(null)
    try {
      const { data } = await fn(params)
      setRows(data.data.results || [])
      setPagination({ page, limit, total: data.data.pagination?.total || 0 })
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [mode, inputs, currentMode])

  useEffect(() => { setInputs({}) }, [mode]) // eslint-disable-line react-hooks/set-state-in-effect

  return (
    <Box>
      <SEO title="Search Bookings" />
      <Typography variant="h4" fontWeight={600} gutterBottom>Search</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
        <TextField select label="Search Mode" value={mode} onChange={(e) => setMode(e.target.value)} size="small" sx={{ minWidth: 200 }}>
          {modes.map((m) => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
        </TextField>
        {currentMode.params.map((p) => (
          <TextField key={p} label={p.charAt(0).toUpperCase() + p.slice(1)} size="small" value={inputs[p] || ''} onChange={(e) => handleInputChange(p, e.target.value)} sx={{ minWidth: 160 }} />
        ))}
        <Button variant="contained" startIcon={<SearchIcon />} onClick={() => handleSearch(0)}>Search</Button>
      </Box>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={() => handleSearch(0)} /> : !searched ? <EmptyState message="Enter search criteria and click Search" /> : rows.length === 0 ? <EmptyState message="No results found" /> : (
        <Table
          columns={columns}
          rows={rows}
          loading={false}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          total={pagination.total}
          onPageChange={(_, page) => handleSearch(page, pagination.limit)}
          onRowsPerPageChange={(e) => handleSearch(0, parseInt(e.target.value))}
        />
      )}
    </Box>
  )
}
