import api from './api'

export const getPublicDashboardStats = async () => {
  const { data } = await api.get('/public/dashboard-stats')
  return data
}
