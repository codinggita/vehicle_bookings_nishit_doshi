import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import ErrorBoundary from './components/ErrorBoundary'
import AppRoutes from './routes'
import { fetchProfile } from './store/slices/authSlice'
import baseTheme from './app/theme'

export default function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, token } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.ui)

  useEffect(() => {
    if (isAuthenticated && token) dispatch(fetchProfile())
  }, [dispatch, isAuthenticated, token])

  const theme = createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode: darkMode ? 'dark' : 'light',
      background: darkMode 
        ? { default: '#0f172a', paper: '#1e293b' } 
        : { default: '#f8fafc', paper: '#ffffff' },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet><title>Vehicle Bookings</title><meta name="description" content="Vehicle Bookings Management Dashboard" /></Helmet>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
