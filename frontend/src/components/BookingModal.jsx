import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import { Modal, Button, Input } from './ui'

const vehicleTypes = ['Mini', 'Prime Sedan', 'SUV', 'Auto', 'Bike']
const bookingStatuses = ['Success', 'Canceled by Customer', 'Canceled by Driver', 'Incomplete']
const paymentMethods = ['Cash', 'Card', 'UPI', 'Wallet']

export default function BookingModal({ open, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    bookingId: '', date: '', time: '', bookingStatus: 'Success',
    customerId: '', vehicleType: '', pickupLocation: '', dropLocation: '',
    bookingValue: '', paymentMethod: 'Cash', rideDistance: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setForm({
        bookingId: '', date: new Date().toISOString().split('T')[0],
        time: '', bookingStatus: 'Success', customerId: '',
        vehicleType: '', pickupLocation: '', dropLocation: '',
        bookingValue: '', paymentMethod: 'Cash', rideDistance: '',
      })
      setErrors({})
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const errs = {}
    if (!form.bookingId.trim()) errs.bookingId = 'Required'
    if (!form.vehicleType) errs.vehicleType = 'Required'
    if (!form.pickupLocation.trim()) errs.pickupLocation = 'Required'
    if (!form.dropLocation.trim()) errs.dropLocation = 'Required'
    if (!form.bookingValue || Number(form.bookingValue) <= 0) errs.bookingValue = 'Must be > 0'
    if (!form.rideDistance || Number(form.rideDistance) <= 0) errs.rideDistance = 'Must be > 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      ...form,
      bookingValue: Number(form.bookingValue),
      rideDistance: Number(form.rideDistance),
    })
  }

  const field = (name, label, opts = {}) => (
    <Input
      label={label}
      name={name}
      value={form[name]}
      onChange={handleChange}
      error={errors[name]}
      type={opts.type || 'text'}
      required={opts.required}
      select={opts.select}
      fullWidth
    >
      {opts.options?.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
    </Input>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Booking"
      maxWidth="md"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} variant="contained">Create</Button>
        </Box>
      }
    >
      <Grid container spacing={2} sx={{ py: 1 }}>
        <Grid item xs={12} sm={6}>{field('bookingId', 'Booking ID', { required: true })}</Grid>
        <Grid item xs={12} sm={6}>
          {field('customerId', 'Customer ID')}
        </Grid>
        <Grid item xs={12} sm={4}>{field('date', 'Date', { type: 'date', required: true })}</Grid>
        <Grid item xs={12} sm={4}>{field('time', 'Time', { type: 'time' })}</Grid>
        <Grid item xs={12} sm={4}>
          {field('bookingStatus', 'Status', { select: true, options: bookingStatuses })}
        </Grid>
        <Grid item xs={12} sm={6}>
          {field('vehicleType', 'Vehicle Type', { select: true, required: true, options: vehicleTypes })}
        </Grid>
        <Grid item xs={12} sm={6}>
          {field('paymentMethod', 'Payment Method', { select: true, options: paymentMethods })}
        </Grid>
        <Grid item xs={12} sm={6}>{field('pickupLocation', 'Pickup Location', { required: true })}</Grid>
        <Grid item xs={12} sm={6}>{field('dropLocation', 'Drop Location', { required: true })}</Grid>
        <Grid item xs={12} sm={6}>{field('bookingValue', 'Booking Value (₹)', { type: 'number', required: true })}</Grid>
        <Grid item xs={12} sm={6}>{field('rideDistance', 'Ride Distance (km)', { type: 'number', required: true })}</Grid>
      </Grid>
    </Modal>
  )
}
