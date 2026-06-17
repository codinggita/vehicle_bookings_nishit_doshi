import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PaymentIcon from '@mui/icons-material/Payment'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SEO from '../../components/SEO'
import { getRevenueStats, getRatingsSummary } from '../../services/analyticsService'
import { getStats } from '../../services/statsService'

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color }}>{icon}</Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={600}>{value}</Typography>
    </Box>
  </Paper>
)

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'admin'
  const [revenueData, setRevenueData] = useState(null)
  const [avgRating, setAvgRating] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: rev }, { data: ratings }] = await Promise.all([getRevenueStats(), getRatingsSummary()])
        setRevenueData(rev.data)
        if (ratings?.data?.length) {
          const avg = ratings.data.reduce((s, r) => s + (r.avgDriverRating || 0), 0) / ratings.data.length
          setAvgRating(avg)
        }
        if (isAdmin) {
          const { data: st } = await getStats()
          setStats(st.data)
        }
      } catch {
        /* silently fail - UI shows partial data */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAdmin])

  const totalRevenue = useMemo(() => revenueData?.reduce((sum, r) => sum + (r.totalRevenue || 0), 0) || 0, [revenueData])
  const totalRides = useMemo(() => revenueData?.reduce((sum, r) => sum + (r.totalBookings || 0), 0) || 0, [revenueData])

  return (
    <Box>
      <SEO title="Dashboard" />
      <Typography variant="h4" fontWeight={600} gutterBottom>Welcome, {user?.name || 'User'}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin ? 'Admin dashboard with full system overview.' : 'Your vehicle booking dashboard.'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : <StatCard title="Total Bookings" value={totalRides.toLocaleString()} icon={<DirectionsCarIcon />} color="#1976d2" />}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<AttachMoneyIcon />} color="#2e7d32" />}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : <StatCard title="Avg Driver Rating" value={avgRating.toFixed(1)} icon={<StarIcon />} color="#ed6c02" />}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : <StatCard title={isAdmin ? 'Total Users' : 'Vehicle Types'} value={isAdmin ? (stats?.totalUsers ?? revenueData?.length ?? 0) : (revenueData?.length || 0)} icon={<PeopleIcon />} color="#9c27b0" />}
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Chart Section */}
        <Grid item xs={12} md={isAdmin ? 8 : 12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 380 }} elevation={1}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Vehicle Type Analytics Overview
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
            ) : revenueData && revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="vehicleType" tickLine={false} axisLine={false} style={{ fontSize: 12, fontWeight: 500 }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: 12, fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    formatter={(value, name) => [name === 'totalRevenue' ? `₹${value.toLocaleString()}` : value, name === 'totalRevenue' ? 'Revenue' : 'Bookings']}
                  />
                  <Bar dataKey="totalRevenue" name="totalRevenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
                  <Bar dataKey="totalBookings" name="totalBookings" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Admin Stats Sidebar Cards */}
        {isAdmin && stats && (
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={12}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.main', color: '#ffffff', display: 'flex' }}>
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Success Rides</Typography>
                    <Typography variant="h6" fontWeight={700}>{stats.successRides?.toLocaleString()}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'error.main', color: '#ffffff', display: 'flex' }}>
                    <CancelIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Cancelled Rides</Typography>
                    <Typography variant="h6" fontWeight={700}>{stats.cancelledRides?.toLocaleString()}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.main', color: '#ffffff', display: 'flex' }}>
                    <DirectionsCarIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Top Vehicle</Typography>
                    <Typography variant="h6" fontWeight={700}>{stats.topVehicle || 'N/A'}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={12}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'secondary.main', color: '#ffffff', display: 'flex' }}>
                    <PaymentIcon />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Top Payment</Typography>
                    <Typography variant="h6" fontWeight={700}>{stats.topPaymentMethod || 'N/A'}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
