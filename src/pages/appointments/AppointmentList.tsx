import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock appointment data
const mockAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    date: '2024-06-06',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'scheduled',
    doctor: 'Dr. Smith'
  },
  {
    id: 2,
    patientName: 'Sarah Smith',
    date: '2024-06-06',
    time: '2:30 PM',
    type: 'Follow-up',
    status: 'confirmed',
    doctor: 'Dr. Johnson'
  },
  {
    id: 3,
    patientName: 'Michael Johnson',
    date: '2024-06-07',
    time: '9:15 AM',
    type: 'Check-up',
    status: 'pending',
    doctor: 'Dr. Wilson'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'success';
    case 'scheduled': return 'primary';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointment Scheduling
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
          sx={{ minHeight: 44 }}
        >
          New Appointment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockAppointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {appointment.patientName}
                  </Typography>
                  <Chip 
                    label={appointment.status} 
                    color={getStatusColor(appointment.status) as any}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.date}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {appointment.time}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {appointment.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctor: {appointment.doctor}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/appointments/${appointment.id}`)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => navigate(`/appointments/${appointment.id}/edit`)}>
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AppointmentList;
