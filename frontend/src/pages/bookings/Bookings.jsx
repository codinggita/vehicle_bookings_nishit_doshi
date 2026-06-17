import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useSnackbar } from 'notistack'
import { Table, Button, ErrorState, Loader } from '../../components/ui'
import { getBookings, createBooking } from '../../services/bookingService'
import BookingModal from '../../components/BookingModal'
import useFilterPersistence from '../../hooks/useFilterPersistence'
import SEO from '../../components/SEO'
import { downloadCSV } from '../../utils/csv'

const statusColors = {
  Success: 'success',
  'Canceled by Customer': 'error',
  'Canceled by Driver': 'warning',
  Incomplete: 'default',
}

export default function Bookings() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 0, limit: 10, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const [search, setSearch] = useState('')
  const [filters, setFilter, resetStoredFilters] = useFilterPersistence('bookings_filters', {
    status: '', vehicleType: '', paymentMethod: '',
    minVal: '', maxVal: '', minDistance: '', maxDistance: '',
  })

  const buildParams = useCallback((page, limit) => {
    const params = { page: page + 1, limit }
    if (search) params.search = search
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
    return params
  }, [search, filters])

  const fetchBookings = useCallback(async (page = 0, limit = 10, showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)
    try {
      const { data } = await getBookings(buildParams(page, limit))
      setRows(data.data.results)
      setPagination({ page, limit, total: data.data.pagination.total })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [buildParams])

  useEffect(() => { fetchBookings() }, [fetchBookings]) // eslint-disable-line react-hooks/set-state-in-effect

  const handleCreate = async (values) => {
    setSubmitting(true)
    try {
      await createBooking(values)
      enqueueSnackbar('Booking created successfully', { variant: 'success' })
      setModalOpen(false)
      fetchBookings(pagination.page, pagination.limit)
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create booking', { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const csvFields = [
    { label: 'Booking ID', accessor: 'bookingId' },
    { label: 'Date', accessor: (r) => r.date ? new Date(r.date).toLocaleDateString() : '' },
    { label: 'Vehicle', accessor: 'vehicleType' },
    { label: 'Pickup', accessor: 'pickupLocation' },
    { label: 'Drop', accessor: 'dropLocation' },
    { label: 'Status', accessor: 'bookingStatus' },
    { label: 'Value', accessor: (r) => r.bookingValue || 0 },
    { label: 'Distance (km)', accessor: (r) => r.rideDistance?.toFixed(1) || 0 },
    { label: 'Payment', accessor: 'paymentMethod' },
  ]

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'vehicleType', label: 'Vehicle' },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'dropLocation', label: 'Drop' },
    { key: 'bookingStatus', label: 'Status', render: (r) => <Chip label={r.bookingStatus} size="small" color={statusColors[r.bookingStatus] || 'default'} /> },
    { key: 'bookingValue', label: 'Value (₹)', render: (r) => r.bookingValue?.toLocaleString() },
    { key: 'rideDistance', label: 'Dist (km)', render: (r) => r.rideDistance?.toFixed(1) },
    { key: 'paymentMethod', label: 'Payment' },
  ]

  const filterFields = [
    { label: 'Status', name: 'status', options: ['', 'Success', 'Canceled by Customer', 'Canceled by Driver', 'Incomplete'] },
    { label: 'Vehicle Type', name: 'vehicleType', options: ['', 'Mini', 'Prime Sedan', 'SUV', 'Auto', 'Bike'] },
    { label: 'Payment Method', name: 'paymentMethod', options: ['', 'Cash', 'Card', 'UPI', 'Wallet'] },
    { label: 'Min Value', name: 'minVal', type: 'number' },
    { label: 'Max Value', name: 'maxVal', type: 'number' },
    { label: 'Min Distance', name: 'minDistance', type: 'number' },
    { label: 'Max Distance', name: 'maxDistance', type: 'number' },
  ]

  const handleFilterChange = (e) => setFilter(e.target.name, e.target.value)

  const handleSearch = (e) => { setSearch(e.target.value); fetchBookings(0, pagination.limit) }

  const clearFilters = () => {
    resetStoredFilters()
    setSearch('')
    fetchBookings(0, pagination.limit)
  }

  if (error) return <ErrorState message={error} onRetry={() => fetchBookings()} />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <SEO title="Bookings" />
        <Typography variant="h4" fontWeight={600}>Bookings</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField size="small" placeholder="Search bookings..." value={search} onChange={handleSearch} sx={{ minWidth: 240 }} />
          <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'primary' : 'default'}>
            <FilterListIcon />
          </IconButton>
          <Button variant="outlined" size="small" onClick={clearFilters}>Clear</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Create</Button>
          <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />} onClick={() => downloadCSV(rows, csvFields, 'bookings')}>Export</Button>
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          {filterFields.map((f) => (
            f.options ? (
              <TextField key={f.name} select size="small" label={f.label} name={f.name} value={filters[f.name]} onChange={handleFilterChange} sx={{ minWidth: 150 }}>
                {f.options.map((o) => <MenuItem key={o || 'all'} value={o}>{o || 'All'}</MenuItem>)}
              </TextField>
            ) : (
              <TextField key={f.name} size="small" label={f.label} name={f.name} type={f.type || 'text'} value={filters[f.name]} onChange={handleFilterChange} sx={{ minWidth: 120 }} />
            )
          ))}
        </Box>
      </Collapse>

      {loading && rows.length === 0 ? <Loader /> : (
        <Table
          columns={columns}
          rows={rows}
          loading={loading}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          total={pagination.total}
          onPageChange={(_, page) => fetchBookings(page, pagination.limit)}
          onRowsPerPageChange={(e) => fetchBookings(0, parseInt(e.target.value))}
          emptyMessage="No bookings found"
        />
      )}
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} loading={submitting} />
    </Box>
  )
}
