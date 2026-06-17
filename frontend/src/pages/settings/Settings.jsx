import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SecurityIcon from '@mui/icons-material/Security'
import LanguageIcon from '@mui/icons-material/Language'
import { Card, Button } from '../../components/ui'
import { toggleDarkMode } from '../../store/slices/uiSlice'
import SEO from '../../components/SEO'
import { useSnackbar } from 'notistack'

export default function Settings() {
  const { darkMode } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  // Local state for interactive preferences
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailCancel: false,
    smsAlerts: true,
  })
  const [language, setLanguage] = useState('en')
  const [sessionTimeout, setSessionTimeout] = useState('30')

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked })
  }

  const handleSavePreferences = () => {
    enqueueSnackbar('Settings and preferences saved successfully', { variant: 'success' })
  }

  return (
    <Box>
      <SEO title="Settings" />
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 1 }}>Settings</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your application configurations, notification rules, and visual settings.
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Theme and Regional Settings */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Appearance Card */}
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <DarkModeIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Appearance</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} color="primary" />}
                label={<Typography fontWeight={600}>Dark Mode Theme</Typography>}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -0.5 }}>
                Switch between light and dark visual aesthetics for the dashboard layout.
              </Typography>
            </Card>

            {/* Regional Card */}
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <LanguageIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Regional & Preferences</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  size="small"
                  label="Interface Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="en">English (US)</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Session Auto-Timeout"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="15">15 Minutes</MenuItem>
                  <MenuItem value="30">30 Minutes</MenuItem>
                  <MenuItem value="60">1 Hour</MenuItem>
                  <MenuItem value="never">Never Timeout</MenuItem>
                </TextField>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Right Side: Notifications and Security */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Notifications Card */}
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Notifications</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <FormControlLabel
                  control={<Checkbox checked={notifications.emailBookings} onChange={handleNotificationChange} name="emailBookings" color="primary" />}
                  label="Email for successful rides"
                />
                <FormControlLabel
                  control={<Checkbox checked={notifications.emailCancel} onChange={handleNotificationChange} name="emailCancel" color="primary" />}
                  label="Email updates for cancellation alerts"
                />
                <FormControlLabel
                  control={<Checkbox checked={notifications.smsAlerts} onChange={handleNotificationChange} name="smsAlerts" color="primary" />}
                  label="Instant SMS updates for alerts"
                />
              </Box>
            </Card>

            {/* Security Alerts Card */}
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Security Options</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configure multi-factor credentials and account verification checks.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="small">Setup 2FA Authentication</Button>
                <Button variant="outlined" size="small" color="error">Revoke Active Sessions</Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Save Button Bar */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }} elevation={1}>
            <Button variant="contained" onClick={handleSavePreferences}>Save Preferences</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
