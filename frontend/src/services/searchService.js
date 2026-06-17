import api from './api'

export const searchAll = (params) => api.get('/search', { params })
export const searchByBookingId = (params) => api.get('/search/bookings', { params })
export const searchByCustomerId = (params) => api.get('/search/customers', { params })
export const searchByPayment = (params) => api.get('/search/payment', { params })
export const searchByVehicle = (params) => api.get('/search/vehicle', { params })
export const searchByLocation = (params) => api.get('/search/location', { params })
export const searchByCancelReason = (params) => api.get('/search/cancel-reason', { params })
export const searchByIncomplete = (params) => api.get('/search/incomplete', { params })
export const searchByRating = (params) => api.get('/search/rating', { params })
