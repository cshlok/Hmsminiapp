import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton 
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import ServiceForm from '../../components/service/ServiceForm';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

interface RouteProps {
  params?: {
    service?: IService;
  };
}

interface AddEditServiceScreenProps {
  navigation: NavigationProps;
  route: RouteProps;
  categories: IServiceCategory[];
  onSave: (service: IService) => void;
  isLoading?: boolean;
}

const AddEditServiceScreen: React.FC<AddEditServiceScreenProps> = ({
  navigation,
  route,
  categories,
  onSave,
  isLoading = false,
}) => {
  const { service } = route.params || {};
  const isEditing = !!service;
  
  const handleSubmit = (values: any) => {
    // Create a new service object or update existing one
    const serviceData: IService = {
      id: isEditing ? service.id : uuidv4(),
      categoryId: values.categoryId,
      name: values.name,
      description: values.description || '',
      price: parseFloat(values.price),
      duration: parseInt(values.duration, 10),
      createdAt: isEditing ? service.createdAt : new Date(),
      updatedAt: new Date(),
    };
    
    onSave(serviceData);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  // Prepare initial values
  const initialValues = isEditing ? {
    categoryId: service.categoryId,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
  } : {
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    duration: 30,
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigation.goBack()}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <ServiceForm
        initialValues={initialValues}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default AddEditServiceScreen;
