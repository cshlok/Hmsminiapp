import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Container
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalBagIcon,
  Description as DocumentIcon,
  PointOfSale as CashRegisterIcon,
  FileUpload as ExportIcon,
  Shield as ShieldLockIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AboutScreen = () => {
  const theme = useTheme();

  const handleOpenWebsite = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Container sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5', 
      py: 2,
      maxWidth: 'md'
    }}>
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          py: 3 
        }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: theme.palette.primary.main 
            }}
          >
            <MedicalBagIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Clinic Management App
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, color: '#666' }}>
            Version 1.0.0
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            About This App
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography paragraph>
            The Clinic Management App is designed for small clinics and solo practitioners to efficiently manage patients, 
            appointments, services, quotes, and billing in one integrated solution.
          </Typography>
          
          <Typography paragraph>
            This app works completely offline, storing all your data securely on your device. 
            No internet connection is required, ensuring your practice can run smoothly anywhere, anytime.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Features
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <List disablePadding>
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Patient Management" 
                secondary="Add, edit, and manage patient profiles with medical history" 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Appointment Scheduling" 
                secondary="Book and manage appointments with calendar view" 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <MedicalBagIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Service Management" 
                secondary="Create and organize services with custom pricing" 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <DocumentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Quote Generator" 
                secondary="Create professional quotes with automatic calculations" 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <CashRegisterIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Billing System" 
                secondary="Generate invoices and track payments" 
              />
            </ListItem>
            
            <ListItem disablePadding sx={{ pb: 1 }}>
              <ListItemIcon>
                <ExportIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Data Export" 
                secondary="Export your data to Excel format for backup or analysis" 
              />
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemIcon>
                <ShieldLockIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Security" 
                secondary="Protect your data with PIN or biometric authentication" 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Privacy & Security
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography paragraph>
            Your data never leaves your device unless you explicitly export it. 
            We do not collect, store, or transmit any of your clinic or patient data.
          </Typography>
          
          <Typography paragraph>
            For additional security, you can enable PIN or biometric authentication 
            to prevent unauthorized access to the app.
          </Typography>
          
          <Button
            variant="outlined"
            onClick={() => handleOpenWebsite('https://example.com/privacy-policy')}
            sx={{ mb: 1.5, width: '100%' }}
          >
            Privacy Policy
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Support
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography paragraph>
            If you need assistance or have any questions about the app, 
            please contact our support team.
          </Typography>
          
          <Button
            variant="outlined"
            onClick={() => handleOpenWebsite('mailto:support@example.com')}
            sx={{ mb: 1.5, width: '100%' }}
          >
            Contact Support
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleOpenWebsite('https://example.com/help')}
            sx={{ mb: 1.5, width: '100%' }}
          >
            Help Center
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ 
        py: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography sx={{ color: '#666', mb: 0.5 }}>
          © 2025 Clinic Management App
        </Typography>
        <Typography sx={{ color: '#666' }}>
          All Rights Reserved
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutScreen;
