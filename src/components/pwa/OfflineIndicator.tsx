import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Chip,
  Paper,
  Slide,
  SlideProps
} from '@mui/material';
import {
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  CloudSync as SyncIcon
} from '@mui/icons-material';
import { useOnlineStatus, useBackgroundSync } from '../../hooks/use-pwa';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { requestSync } = useBackgroundSync();
  const [wasOffline, setWasOffline] = React.useState(false);
  const [showBackOnline, setShowBackOnline] = React.useState(false);

  React.useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowBackOnline(true);
      setWasOffline(false);
      
      // Request background sync when coming back online
      requestSync('background-sync');
      
      // Hide the back online message after 3 seconds
      setTimeout(() => setShowBackOnline(false), 3000);
    }
  }, [isOnline, wasOffline, requestSync]);

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            py: 1,
            px: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <OfflineIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              You're offline
            </Typography>
            <Typography variant="body2">
              • Some features may be limited
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Back Online Notification */}
      <Snackbar
        open={showBackOnline}
        autoHideDuration={3000}
        onClose={() => setShowBackOnline(false)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowBackOnline(false)}
          severity="success"
          variant="filled"
          icon={<OnlineIcon />}
          sx={{ width: '100%' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              You're back online!
            </Typography>
            <Chip
              icon={<SyncIcon />}
              label="Syncing data"
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'inherit',
                borderColor: 'rgba(255,255,255,0.3)'
              }}
            />
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

// Connection Status Chip (for use in headers or status bars)
export const ConnectionStatus: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <Chip
      icon={isOnline ? <OnlineIcon /> : <OfflineIcon />}
      label={isOnline ? 'Online' : 'Offline'}
      size="small"
      color={isOnline ? 'success' : 'warning'}
      variant="outlined"
      sx={{
        '& .MuiChip-icon': {
          fontSize: 16
        }
      }}
    />
  );
};
