import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ServiceDetailsScreen from './ServiceDetailsScreen';

const ServiceDetailsContainer = ({ navigation, route }) => {
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
    return <View style={styles.container} />;
  }
  
  return (
    <ServiceDetailsScreen 
      service={serviceData}
      category={category}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ServiceDetailsContainer;
