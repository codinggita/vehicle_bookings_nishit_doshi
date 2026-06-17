import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarIcon from '@mui/icons-material/Star'
import PlaceIcon from '@mui/icons-material/Place'
import { getRevenueStats, getStatusDistribution, getLocationDemand, getRatingsSummary } from '../../services/analyticsService'
import { ErrorState } from '../../components/ui'
import SEO from '../../components/SEO'

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6']

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color }}>{icon}</Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={600}>{value}</Typography>
    </Box>
  </Paper>
)

export default function Analytics() {
  const [revenue, setRevenue] = useState([])
  const [statusDist, setStatusDist] = useState([])
  const [locations, setLocations] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r, s, l, ra] = await Promise.all([
          getRevenueStats(), getStatusDistribution(), getLocationDemand(), getRatingsSummary(),
        ])
        setRevenue(r.data.data || [])
        setStatusDist(s.data.data || [])
        const locData = l.data.data
        const pickups = (locData?.topPickups || []).map(p => ({ pickupLocation: p.location, count: p.count }))
        setLocations(pickups)
        setRatings(ra.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  const totalRev = revenue.reduce((s, r) => s + (r.totalRevenue || 0), 0)
  const totalBookings = revenue.reduce((s, r) => s + (r.totalBookings || 0), 0)
  const avgDriverRating = ratings.reduce((s, r) => s + (r.avgDriverRating || 0), 0) / (ratings.length || 1)
  const topLocation = locations[0]?.pickupLocation || 'N/A'

  return (
    <Box>
      <SEO title="Analytics" />
      <Typography variant="h4" fontWeight={600} gutterBottom>Analytics</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {loading ? [1,2,3,4].map(i => <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={80} /></Grid>) : (
          <>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Revenue" value={`₹${totalRev.toLocaleString()}`} icon={<AttachMoneyIcon />} color="#10b981" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Bookings" value={totalBookings.toLocaleString()} icon={<DirectionsCarIcon />} color="#6366f1" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Avg Driver Rating" value={avgDriverRating.toFixed(1)} icon={<StarIcon />} color="#f59e0b" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Top Location" value={topLocation} icon={<PlaceIcon />} color="#06b6d4" /></Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Revenue by Vehicle Type</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="vehicleType" tickLine={false} style={{ fontSize: 12 }} />
                  <YAxis tickLine={false} style={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Legend />
                  <Bar dataKey="totalRevenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
                  <Bar dataKey="totalBookings" name="Count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Booking Status Distribution</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusDist} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                    {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Top Pickup Locations</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locations.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tickLine={false} style={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="pickupLocation" width={120} tickLine={false} style={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Ratings Summary by Vehicle Type</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="vehicleType" tickLine={false} style={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tickLine={false} style={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Legend />
                  <Bar dataKey="avgDriverRating" name="Driver Rating" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="avgCustomerRating" name="Customer Rating" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
