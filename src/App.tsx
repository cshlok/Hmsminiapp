import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon,
  GetApp as InstallIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { BiometricAuth } from './components/pwa/BiometricAuth';
import { ConnectionStatus } from './components/pwa/OfflineIndicator';
import { useInstallPrompt, useDeviceCapabilities, useNotifications } from './hooks/use-pwa';

// Mobile-optimized theme
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44, // Touch-friendly height
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 56, // Touch-friendly input height
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1976d2',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

// Make theme responsive
theme = responsiveFontSizes(theme);

function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { canInstall, promptInstall } = useInstallPrompt();
  const { deviceType } = useDeviceCapabilities();
  const { requestPermission } = useNotifications();
  
  const [showInstallDialog, setShowInstallDialog] = React.useState(false);
  const [showBiometricAuth, setShowBiometricAuth] = React.useState(false);

  // Auto-show install prompt after 30 seconds on mobile
  React.useEffect(() => {
    if (canInstall && (deviceType === 'iOS' || deviceType === 'Android')) {
      const timer = setTimeout(() => {
        setShowInstallDialog(true);
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [canInstall, deviceType]);

  // Request notification permission on first load
  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleInstallClick = () => {
    if (canInstall) {
      setShowInstallDialog(true);
    }
  };

  const handleInstallSuccess = () => {
    setShowInstallDialog(false);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricAuth(false);
    // Handle successful biometric authentication
    console.log('Biometric authentication successful');
  };

  return (
    <>
      {/* Mobile-optimized App Bar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            ClinicApp
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && <ConnectionStatus />}
            
            <IconButton
              color="inherit"
              aria-label="notifications"
            >
              <NotificationsIcon />
            </IconButton>
            
            {canInstall && (
              <IconButton
                color="inherit"
                onClick={handleInstallClick}
                aria-label="install app"
              >
                <InstallIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 1 : 2,
          px: isMobile ? 1 : 3,
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Dashboard />} />
          <Route path="/appointments" element={<Dashboard />} />
          <Route path="/services" element={<Dashboard />} />
          <Route path="/billing" element={<Dashboard />} />
          <Route path="/quotes" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

      {/* PWA Dialogs */}
      <InstallPrompt
        open={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
      />
      
      <BiometricAuth
        open={showBiometricAuth}
        onClose={() => setShowBiometricAuth(false)}
        onSuccess={handleBiometricSuccess}
        mode="register"
        username="clinic-user"
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
