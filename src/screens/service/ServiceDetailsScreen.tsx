import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Grid 
} from '@mui/material';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface ServiceDetailsScreenProps {
  service: IService;
  category: IServiceCategory | null;
}

const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({ 
  service, 
  category 
}) => {
  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5', 
      p: 2,
      overflow: 'auto'
    }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            {service.name}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Category
            </Typography>
            <Typography variant="body1">
              {category ? category.name : 'Uncategorized'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Price
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ${service.price.toFixed(2)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Duration
            </Typography>
            <Typography variant="body1">
              {service.duration} minutes
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Description
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body1">
            {service.description || 'No description provided for this service.'}
          </Typography>
        </CardContent>
      </Card>
      
      {category && category.description && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Category Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1">
              {category.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ServiceDetailsScreen;
