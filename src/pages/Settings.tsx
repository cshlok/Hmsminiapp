import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Backup as BackupIcon
} from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Security</Typography>
              </Box>
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="PIN Authentication"
              />
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Biometric Authentication"
              />
              
              <FormControlLabel
                control={<Switch />}
                label="Two-Factor Authentication"
              />
              
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small">
                  Change PIN
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Appointment Reminders"
              />
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Payment Notifications"
              />
              
              <FormControlLabel
                control={<Switch />}
                label="System Updates"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Data Management</Typography>
              </Box>
              
              <Button variant="contained" sx={{ mr: 2, mb: 1 }}>
                Export Data
              </Button>
              
              <Button variant="outlined" sx={{ mb: 1 }}>
                Import Data
              </Button>
              
              <Divider sx={{ my: 2 }} />
              
              <Button variant="contained" color="success">
                Backup Data
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">General</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Clinic Name: HealthCare Plus
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Version: 1.0.0
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Backup: June 5, 2024
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small">
                  Edit Clinic Info
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
