import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
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
      <Typography variant="h4" fontWeight={600} gutterBottom>Profile</Typography>
      <Card sx={{ maxWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>{user?.name}</Typography>
          <Chip label={user?.role} size="small" color="primary" sx={{ mt: 1 }} />
        </Box>

        {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        {editing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Customer ID" name="customerId" value={form.customerId} onChange={handleChange} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSave} loading={loading}>Save</Button>
              <Button color="inherit" onClick={() => setEditing(false)}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {user?.email}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Customer ID:</strong> {user?.customerId || 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
            <Button variant="outlined" onClick={startEdit}>Edit Profile</Button>
          </Box>
        )}
      </Card>

      <Card sx={{ maxWidth: 500, mt: 3 }}>
        <Box sx={{ p: 0 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ px: 2, pt: 2 }}>Change Password</Typography>
          {pwMessage.text && <Alert severity={pwMessage.type} sx={{ mx: 2, mb: 2 }}>{pwMessage.text}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, pb: 2 }}>
            <Input label="Current Password" name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} />
            <Input label="New Password" name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} />
            <Input label="Confirm New Password" name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} />
            <Button variant="contained" onClick={handlePwSubmit} loading={pwLoading}>Change Password</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
