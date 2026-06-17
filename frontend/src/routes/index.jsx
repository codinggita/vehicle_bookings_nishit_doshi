import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { Loader } from '../components/ui'

const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Users = lazy(() => import('../pages/users/Users'))
const Profile = lazy(() => import('../pages/profile/Profile'))
const Settings = lazy(() => import('../pages/settings/Settings'))
const Analytics = lazy(() => import('../pages/analytics/Analytics'))
const Bookings = lazy(() => import('../pages/bookings/Bookings'))
const Search = lazy(() => import('../pages/search/Search'))
const Customers = lazy(() => import('../pages/customers/Customers'))
const Vehicles = lazy(() => import('../pages/vehicles/Vehicles'))
const Payments = lazy(() => import('../pages/payments/Payments'))
const Ratings = lazy(() => import('../pages/ratings/Ratings'))
const Unauthorized = lazy(() => import('../pages/Unauthorized'))

const LazyLoad = ({ children }) => <Suspense fallback={<Loader />}>{children}</Suspense>

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LazyLoad><Login /></LazyLoad>} />
      <Route path="/register" element={<LazyLoad><Register /></LazyLoad>} />
      <Route path="/unauthorized" element={<LazyLoad><Unauthorized /></LazyLoad>} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<LazyLoad><Dashboard /></LazyLoad>} />
        <Route path="users" element={<ProtectedRoute roles={['admin']}><LazyLoad><Users /></LazyLoad></ProtectedRoute>} />
        <Route path="bookings" element={<LazyLoad><Bookings /></LazyLoad>} />
        <Route path="search" element={<LazyLoad><Search /></LazyLoad>} />
        <Route path="customers" element={<ProtectedRoute roles={['admin']}><LazyLoad><Customers /></LazyLoad></ProtectedRoute>} />
        <Route path="vehicles" element={<ProtectedRoute roles={['admin']}><LazyLoad><Vehicles /></LazyLoad></ProtectedRoute>} />
        <Route path="payments" element={<ProtectedRoute roles={['admin']}><LazyLoad><Payments /></LazyLoad></ProtectedRoute>} />
        <Route path="ratings" element={<ProtectedRoute roles={['admin']}><LazyLoad><Ratings /></LazyLoad></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute roles={['admin']}><LazyLoad><Analytics /></LazyLoad></ProtectedRoute>} />
        <Route path="profile" element={<LazyLoad><Profile /></LazyLoad>} />
        <Route path="settings" element={<LazyLoad><Settings /></LazyLoad>} />
      </Route>
    </Routes>
  )
}
