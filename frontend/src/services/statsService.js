import api from './api'

export const getStats = () => api.get('/stats/total-bookings').then(async () => {
  const [total, success, cancelled, topV, topP] = await Promise.all([
    api.get('/stats/total-bookings'),
    api.get('/stats/success-rides'),
    api.get('/stats/cancelled-rides'),
    api.get('/stats/top-vehicle'),
    api.get('/stats/top-payment-method'),
  ])
  return {
    data: {
      data: {
        totalUsers: total.data.data?.total || 0,
        successRides: success.data.data?.count || 0,
        cancelledRides: cancelled.data.data?.count || 0,
        topVehicle: topV.data.data?.vehicleType || 'N/A',
        topPaymentMethod: topP.data.data?.paymentMethod || 'N/A',
      }
    }
  }
})
