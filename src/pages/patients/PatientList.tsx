import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock patient data
const mockPatients = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 45,
    gender: 'Male',
    phone: '(555) 123-4567',
    email: 'john.doe@email.com',
    lastVisit: '2024-06-01'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Smith',
    age: 32,
    gender: 'Female',
    phone: '(555) 987-6543',
    email: 'sarah.smith@email.com',
    lastVisit: '2024-05-28'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    age: 58,
    gender: 'Male',
    phone: '(555) 456-7890',
    email: 'michael.j@email.com',
    lastVisit: '2024-05-30'
  }
];

const PatientList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}
          sx={{ minHeight: 44 }}
        >
          Add Patient
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockPatients.map((patient) => (
          <Grid item xs={12} sm={6} md={4} key={patient.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Age: {patient.age} • {patient.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone: {patient.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email: {patient.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Visit: {patient.lastVisit}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/patients/${patient.id}`)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => navigate(`/patients/${patient.id}/edit`)}>
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

export default PatientList;
