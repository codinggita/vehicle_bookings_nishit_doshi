import { Component } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2, p: 4 }}>
          <WarningAmberIcon sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" fontWeight={600}>Something went wrong</Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Typography>
          <Button variant="contained" onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}>
            Reload Page
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}
