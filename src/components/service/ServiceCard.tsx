import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { IService } from '../../models/ServiceModel';

interface ServiceCardProps {
  service: IService;
  categoryName?: string;
  onPress: (service: IService) => void;
  onEdit: (service: IService) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  categoryName,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <Card onClick={() => onPress(service)} sx={{ mb: 1, cursor: 'pointer' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {service.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" color="primary">
                ${service.price.toFixed(2)}
              </Typography>
              {service.duration && (
                <Chip 
                  label={`${service.duration} min`} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
            {categoryName && (
              <Chip 
                label={categoryName} 
                size="small" 
                color="secondary"
              />
            )}
          </Box>
          <Box>
            <IconButton onClick={(e) => { e.stopPropagation(); onEdit(service); }}>
              <Edit />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(service.id); }}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
