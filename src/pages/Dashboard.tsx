import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Paper
} from '@mui/material';
import { 
  People, 
  CalendarToday, 
  LocalHospital, 
  Receipt 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const cards = [
    { title: 'Patients', count: '156', icon: <People fontSize="large" />, color: '#1976d2', path: '/patients' },
    { title: 'Appointments', count: '23', icon: <CalendarToday fontSize="large" />, color: '#388e3c', path: '/appointments' },
    { title: 'Services', count: '12', icon: <LocalHospital fontSize="large" />, color: '#f57c00', path: '/services' },
    { title: 'Bills', count: '89', icon: <Receipt fontSize="large" />, color: '#d32f2f', path: '/billing' },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="div">
                      {card.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/patients')}
          >
            Add Patient
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/appointments')}
          >
            New Appointment
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/quotes')}
          >
            View Quotes
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/billing')}
          >
            Billing
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Patient John Doe scheduled for tomorrow at 10:00 AM
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • New patient Sarah Smith registered
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Payment received for Invoice #123
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
