import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
      <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h4" fontWeight={600}>403 - Unauthorized</Typography>
      <Typography variant="body1" color="text.secondary">You don't have permission to access this page.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Back to Dashboard</Button>
    </Box>
  )
}
