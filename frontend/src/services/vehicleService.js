import api from './api'

export const getVehicles = (params) => api.get('/vehicles', { params })
export const createVehicle = (data) => api.post('/vehicles', data)
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`)
