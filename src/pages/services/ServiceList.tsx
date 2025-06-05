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
  LocalHospital as ServiceIcon,
  AttachMoney as MoneyIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock service data
const mockServices = [
  {
    id: 1,
    name: 'General Consultation',
    category: 'Consultation',
    price: 150,
    duration: 30,
    description: 'Standard medical consultation'
  },
  {
    id: 2,
    name: 'ECG Test',
    category: 'Diagnostic',
    price: 75,
    duration: 15,
    description: 'Electrocardiogram test'
  },
  {
    id: 3,
    name: 'Blood Pressure Check',
    category: 'Screening',
    price: 25,
    duration: 10,
    description: 'Blood pressure measurement'
  },
  {
    id: 4,
    name: 'Physiotherapy Session',
    category: 'Treatment',
    price: 100,
    duration: 45,
    description: 'Physical therapy session'
  },
  {
    id: 5,
    name: 'Vaccination',
    category: 'Prevention',
    price: 50,
    duration: 15,
    description: 'Vaccine administration'
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Consultation': return 'primary';
    case 'Diagnostic': return 'info';
    case 'Screening': return 'success';
    case 'Treatment': return 'warning';
    case 'Prevention': return 'secondary';
    default: return 'default';
  }
};

const ServiceList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Service Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/new')}
          sx={{ minHeight: 44 }}
        >
          Add Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mockServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ServiceIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {service.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={service.category} 
                    color={getCategoryColor(service.category) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {service.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                  <MoneyIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                  <Typography variant="h6" color="success.main">
                    ${service.price}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Duration: {service.duration} minutes
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/services/${service.id}`)}>
                  View Details
                </Button>
                <Button size="small" onClick={() => navigate(`/services/${service.id}/edit`)}>
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

export default ServiceList;
