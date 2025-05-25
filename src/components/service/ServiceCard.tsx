import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  IconButton, 
  Box, 
  CardActionArea 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { IService } from '../../models/ServiceModel';

interface ServiceCardProps {
  service: IService;
  categoryName: string;
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
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        my: 0.75, 
        mx: 2, 
        boxShadow: 2 
      }}
    >
      <CardActionArea onClick={() => onPress(service)}>
        <CardContent sx={{ 
          display: 'flex', 
          flexDirection: 'row',
          p: 1.5
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                {service.name}
              </Typography>
              <Chip 
                label={categoryName} 
                size="small"
                sx={{ 
                  ml: 1, 
                  bgcolor: `${theme.palette.primary.main}20` 
                }}
              />
            </Box>
            
            {service.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {service.description}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: theme.palette.primary.main 
                }}
              >
                ${service.price.toFixed(2)}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 2, 
                  color: '#666' 
                }}
              >
                {service.duration} min
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(service);
              }}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(service.id);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ServiceCard;
