import api from './api'

export const getRatings = (params) => api.get('/ratings', { params })
export const createRating = (data) => api.post('/ratings', data)
export const deleteRating = (id) => api.delete(`/ratings/${id}`)
