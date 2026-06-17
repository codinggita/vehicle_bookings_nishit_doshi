import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Card, Input, Button } from '../../components/ui'
import { fetchProfile } from '../../store/slices/authSlice'
import { updateProfile as updateProfileService, changePassword as changePasswordService } from '../../services/authService'
import SEO from '../../components/SEO'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', customerId: '' })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' })

  const startEdit = () => {
    setForm({ name: user?.name || '', email: user?.email || '', customerId: user?.customerId || '' })
    setEditing(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await updateProfileService(form)
      dispatch(fetchProfile())
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      setEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value })

  const handlePwSubmit = async () => {
    setPwMessage({ type: '', text: '' })
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwMessage({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    setPwLoading(true)
    try {
      await changePasswordService({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwMessage({ type: 'success', text: 'Password changed successfully.' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed.' })
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <Box>
      <SEO title="Profile" />
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>Profile</Typography>
      
      <Grid container spacing={3}>
        {/* Left Side: Avatar and Info Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, textAlign: 'center' }}>
              <Avatar sx={{ 
                width: 90, 
                height: 90, 
                mb: 2, 
                bgcolor: 'primary.main', 
                fontSize: 36,
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
              <Chip label={user?.role?.toUpperCase()} size="small" color="primary" sx={{ mt: 1.5, px: 1.5, fontWeight: 700, letterSpacing: '0.05em' }} />
            </Box>

            <Divider sx={{ my: 2, opacity: 0.6 }} />

            <Box sx={{ px: 2, py: 1 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Email Address</Typography>
                <Typography variant="body1" fontWeight={600}>{user?.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Customer ID</Typography>
                <Typography variant="body1" fontWeight={600}>{user?.customerId || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Member Since</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Side: Forms */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Edit Info Card */}
            <Card>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Account Information</Typography>
              {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

              {editing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Input label="Name" name="name" value={form.name} onChange={handleChange} />
                  <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                  <Input label="Customer ID" name="customerId" value={form.customerId} onChange={handleChange} />
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                    <Button variant="contained" onClick={handleSave} loading={loading}>Save Changes</Button>
                    <Button color="inherit" variant="outlined" onClick={() => setEditing(false)}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage your account details and update your contact information here.
                  </Typography>
                  <Button variant="outlined" onClick={startEdit}>Edit Profile Details</Button>
                </Box>
              )}
            </Card>

            {/* Change Password Card */}
            <Card>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Change Password</Typography>
              {pwMessage.text && <Alert severity={pwMessage.type} sx={{ mb: 2 }}>{pwMessage.text}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input label="Current Password" name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} />
                <Input label="New Password" name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} />
                <Input label="Confirm New Password" name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} />
                <Box sx={{ mt: 1 }}>
                  <Button variant="contained" onClick={handlePwSubmit} loading={pwLoading}>Update Password</Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
