import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import ServiceForm from '../../components/service/ServiceForm';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface AddEditServiceScreenProps {
  navigation: any;
  route: any;
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
  const theme = useTheme();
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
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Service' : 'Add New Service'} />
      </Appbar.Header>
      
      <ServiceForm
        initialValues={initialValues}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AddEditServiceScreen;
