import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 4px 24px 0 rgba(0,0,0,0.35)' 
            : '0 4px 24px 0 rgba(0,0,0,0.02)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(241, 245, 249, 0.8)'}`,
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 18px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#ffffff',
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: '1.5px',
          borderColor: theme.palette.primary.light,
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(99, 102, 241, 0.04)',
            transform: 'translateY(-1px)',
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#ffffff',
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '16px',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(241, 245, 249, 0.8)'}`,
        }),
        head: ({ theme }) => ({
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.72rem',
          letterSpacing: '0.06em',
          color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8fafc',
          padding: '12px 16px',
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'all 0.2s',
          '&.MuiTableRow-hover:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(99, 102, 241, 0.015)',
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        colorPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
          color: theme.palette.primary.light,
        }),
        colorSecondary: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.08)',
          color: theme.palette.secondary.light,
        }),
        colorSuccess: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
          color: theme.palette.success.light,
        }),
        colorWarning: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)',
          color: theme.palette.warning.light,
        }),
        colorError: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
          color: theme.palette.error.light,
        }),
        colorDefault: ({ theme }) => ({
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          color: theme.palette.text.secondary,
        }),
      },
    },
  },
})

export default theme
