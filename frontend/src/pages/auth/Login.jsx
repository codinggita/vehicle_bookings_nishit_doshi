import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { login, clearError } from '../../store/slices/authSlice'
import SEO from '../../components/SEO'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      bgcolor: 'background.default',
      backgroundImage: (theme) => theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 1) 90%)'
        : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.04) 0%, rgba(248, 250, 252, 1) 90%)',
    }}>
      <SEO title="Sign In" noIndex />
      <Card sx={{ 
        maxWidth: 420, 
        width: '100%', 
        mx: 2, 
        borderRadius: 5,
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
          : '0 10px 40px rgba(99, 102, 241, 0.05)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '50%', 
              bgcolor: 'primary.main', 
              color: '#ffffff', 
              display: 'inline-flex', 
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
              background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
            }}>
              <DirectionsCarIcon sx={{ fontSize: 32 }} />
            </Box>
          </Box>
          
          <Typography variant="h4" fontWeight={700} align="center" sx={{ fontFamily: '"Outfit", sans-serif', mb: 1 }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome back! Enter your details to continue.
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required sx={{ mb: 2.5 }} />
            <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} required sx={{ mb: 3.5 }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
          
          <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 600, color: 'primary.main' }}>Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
