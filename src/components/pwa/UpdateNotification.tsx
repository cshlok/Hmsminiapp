import React from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  SystemUpdate as UpdateIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAppUpdate } from '../../hooks/use-pwa';

export const UpdateNotification: React.FC = () => {
  const { updateAvailable, updateApp } = useAppUpdate();
  const [updating, setUpdating] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateApp();
    } catch (error) {
      console.error('Update failed:', error);
      setUpdating(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="info"
        variant="filled"
        icon={<UpdateIcon />}
        onClose={handleDismiss}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleUpdate}
            disabled={updating}
            startIcon={
              updating ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <RefreshIcon />
              )
            }
            sx={{ ml: 1 }}
          >
            {updating ? 'Updating...' : 'Update Now'}
          </Button>
        }
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            New version available!
          </Typography>
          <Typography variant="body2">
            Update now to get the latest features and improvements.
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};
