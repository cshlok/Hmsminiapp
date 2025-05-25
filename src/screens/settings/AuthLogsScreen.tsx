import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Button, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Logout as LogoutIcon, 
  Error as ErrorIcon, 
  AccountCircle as AccountIcon, 
  AccessTime as ClockIcon, 
  Dialpad as DialpadIcon, 
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';
import { IAuthLog } from '../../models/SettingsModel';
import { format } from 'date-fns';

interface AuthLogsScreenProps {
  authLogs: IAuthLog[];
  loading: boolean;
  onClearLogs: () => void;
}

const AuthLogsScreen: React.FC<AuthLogsScreenProps> = ({
  authLogs,
  loading,
  onClearLogs,
}) => {
  const getStatusColor = (success: boolean) => {
    return success ? 'primary' : 'error';
  };

  // Removed unused getActionIcon function

  const renderAuthLog = (item: IAuthLog) => {
    const formattedDate = item.timestamp ? format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm:ss') : 'Unknown';
    
    return (
      <Card sx={{ mb: 2 }} key={item.id}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {item.action === 'login' ? 'Login' : 
               item.action === 'logout' ? 'Logout' : 
               'Failed Login Attempt'}
            </Typography>
            <Chip 
              label={item.success ? 'Success' : 'Failed'}
              color={getStatusColor(item.success)}
              variant="outlined"
              size="small"
            />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List disablePadding>
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <ClockIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Time" 
                secondary={formattedDate} 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                {item.method === 'pin' ? <DialpadIcon /> : <FingerprintIcon />}
              </ListItemIcon>
              <ListItemText 
                primary="Method" 
                secondary={item.method === 'pin' ? 'PIN Authentication' : 'Biometric Authentication'} 
              />
            </ListItem>
            
            {!item.success && item.errorMessage && (
              <ListItem disablePadding>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Error" 
                  secondary={item.errorMessage} 
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh', 
      p: 2 
    }}>
      {authLogs.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '70vh', 
          p: 3 
        }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            No authentication logs found.
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            Authentication activity will be recorded here when you use PIN or biometric authentication.
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={onClearLogs}
              startIcon={<ErrorIcon />}
              disabled={loading}
            >
              Clear All Logs
            </Button>
          </Box>
          
          <Box>
            {authLogs.map(item => renderAuthLog(item))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AuthLogsScreen;
