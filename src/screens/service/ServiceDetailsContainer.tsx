import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ServiceDetailsScreen from './ServiceDetailsScreen';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

interface RouteProps {
  params: {
    service?: any;
  };
}

const ServiceDetailsContainer: React.FC<{ navigation: NavigationProps, route: RouteProps }> = ({ navigation, route }) => {
  const { service } = route.params;
  const { categories } = useSelector((state: RootState) => state.service);
  const { selectedService } = useSelector((state: RootState) => state.service);
  
  // Use the service from route params or from Redux state
  const serviceData = service || selectedService;
  
  // Find the category for this service
  const category = categories.find(c => c.id === serviceData?.categoryId) || null;
  
  // If no service data is available, go back to the list
  useEffect(() => {
    if (!serviceData) {
      navigation.goBack();
    }
  }, [serviceData, navigation]);
  
  if (!serviceData) {
    return <Box sx={{ flex: 1, bgcolor: '#f5f5f5' }} />;
  }
  
  return (
    <ServiceDetailsScreen 
      service={serviceData}
      category={category}
    />
  );
};

export default ServiceDetailsContainer;
