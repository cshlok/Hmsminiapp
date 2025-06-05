import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as InstallIcon,
  Smartphone as PhoneIcon
} from '@mui/icons-material';
import { useInstallPrompt } from '../../hooks/use-pwa';

interface InstallPromptProps {
  open: boolean;
  onClose: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ open, onClose }) => {
  const { promptInstall, isInstalled } = useInstallPrompt();

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      onClose();
    }
  };

  if (isInstalled) {
    return null;
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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="h6">Install Clinic App</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Get the best mobile experience by installing our app on your device.
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.200',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Benefits of installing:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <Typography variant="body2">
                Works offline - access your data anywhere
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Faster loading and better performance
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Push notifications for important updates
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Native app-like experience
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Direct access from home screen
              </Typography>
            </li>
          </ul>
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit">
          Not Now
        </Button>
        <Button
          onClick={handleInstall}
          variant="contained"
          startIcon={<InstallIcon />}
          sx={{ minWidth: 120 }}
        >
          Install App
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Compact install banner for mobile
export const InstallBanner: React.FC = () => {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = React.useState(false);

  if (!canInstall || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    await promptInstall();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'primary.main',
        color: 'primary.contrastText'
      }}
    >
      <PhoneIcon />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Install Clinic App
        </Typography>
        <Typography variant="caption">
          Add to home screen for better experience
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        onClick={handleInstall}
        sx={{
          color: 'inherit',
          borderColor: 'rgba(255,255,255,0.5)',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.8)',
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        Install
      </Button>
      <IconButton
        size="small"
        onClick={handleDismiss}
        sx={{ color: 'inherit' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};
