import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import CategoryForm from '../../components/service/CategoryForm';
import { IServiceCategory } from '../../models/ServiceModel';

interface AddEditCategoryScreenProps {
  navigation: {goBack: () => void};
  route: {params?: {category?: IServiceCategory}};
  onSave: (category: IServiceCategory) => void;
  isLoading?: boolean;
}

const AddEditCategoryScreen: React.FC<AddEditCategoryScreenProps> = ({
  navigation,
  route,
  onSave,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { category } = route.params || {};
  const isEditing = !!category;
  
  const handleSubmit = (values: any) => {
    // Create a new category object or update existing one
    const categoryData: IServiceCategory = {
      id: isEditing ? category.id : uuidv4(),
      name: values.name,
      description: values.description || '',
      createdAt: isEditing ? category.createdAt : new Date(),
      updatedAt: new Date(),
    };
    
    onSave(categoryData);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  // Prepare initial values
  const initialValues = isEditing ? {
    name: category.name,
    description: category.description,
  } : {
    name: '',
    description: '',
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Category' : 'Add New Category'} />
      </Appbar.Header>
      
      <CategoryForm
        initialValues={initialValues}
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

export default AddEditCategoryScreen;
