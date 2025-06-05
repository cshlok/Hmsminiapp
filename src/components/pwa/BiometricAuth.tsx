import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Paper
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  Face as FaceIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useBiometricAuth } from '../../hooks/use-pwa';

interface BiometricAuthProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'register' | 'authenticate';
  username?: string;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({
  open,
  onClose,
  onSuccess,
  mode,
  username = ''
}) => {
  const { isSupported, registerBiometric, authenticateWithBiometric } = useBiometricAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleBiometricAction = async () => {
    setLoading(true);
    setError(null);

    try {
      let result = false;
      
      if (mode === 'register') {
        result = await registerBiometric(username);
      } else {
        result = await authenticateWithBiometric();
      }

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Biometric authentication was cancelled or not allowed.');
      } else if (err.name === 'SecurityError') {
        setError('Biometric authentication is not available on this device.');
      } else if (err.name === 'NotSupportedError') {
        setError('Biometric authentication is not supported on this device.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Biometric Authentication</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Biometric authentication is not supported on this device or browser.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">
              {mode === 'register' ? 'Setup Biometric Login' : 'Biometric Login'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'success.50',
              border: '1px solid',
              borderColor: 'success.200',
              borderRadius: 2
            }}
          >
            <CheckIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" color="success.main">
              {mode === 'register' ? 'Biometric Setup Complete!' : 'Authentication Successful!'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === 'register' 
                ? 'You can now use biometric authentication to login.'
                : 'Welcome back!'
              }
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <FingerprintIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <FaceIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              {mode === 'register' ? 'Setup Biometric Authentication' : 'Use Your Biometric'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {mode === 'register'
                ? 'Use your fingerprint, face, or other biometric to securely access your account.'
                : 'Place your finger on the sensor or look at your device to authenticate.'
              }
            </Typography>

            {loading && (
              <Box sx={{ mb: 3 }}>
                <CircularProgress size={32} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {mode === 'register' ? 'Setting up biometric...' : 'Authenticating...'}
                </Typography>
              </Box>
            )}

            {mode === 'register' && (
              <Alert severity="info" sx={{ textAlign: 'left', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  Your biometric data is:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Stored securely on your device</li>
                  <li>Never shared with our servers</li>
                  <li>Used only for authentication</li>
                </ul>
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      
      {!success && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleBiometricAction}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <FingerprintIcon />}
            sx={{ minWidth: 140 }}
          >
            {loading 
              ? 'Please wait...'
              : mode === 'register' 
                ? 'Setup Now'
                : 'Authenticate'
            }
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

// Biometric login button component
export const BiometricLoginButton: React.FC<{
  onSuccess: () => void;
  disabled?: boolean;
}> = ({ onSuccess, disabled = false }) => {
  const { isSupported, isRegistered } = useBiometricAuth();
  const [showAuth, setShowAuth] = React.useState(false);

  if (!isSupported || !isRegistered) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => setShowAuth(true)}
        disabled={disabled}
        startIcon={<FingerprintIcon />}
        sx={{
          py: 1.5,
          borderStyle: 'dashed',
          '&:hover': {
            borderStyle: 'solid'
          }
        }}
      >
        Use Biometric Login
      </Button>
      
      <BiometricAuth
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={onSuccess}
        mode="authenticate"
      />
    </>
  );
};
