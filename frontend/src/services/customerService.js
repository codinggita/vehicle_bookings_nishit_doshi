import api from './api'

export const getCustomers = (params) => api.get('/customers', { params })
export const createCustomer = (data) => api.post('/customers', data)
export const bulkInsertCustomers = (data) => api.post('/customers/bulk-insert', data)
export const deleteCustomer = (id) => api.delete(`/customers/${id}`)
