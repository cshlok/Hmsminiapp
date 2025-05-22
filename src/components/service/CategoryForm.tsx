import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IServiceCategory } from '../../models/ServiceModel';

interface CategoryFormProps {
  initialValues?: Partial<IServiceCategory>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Validation schema for category form
const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues = {
    name: '',
    description: '',
  },
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            {/* Category Name */}
            <TextInput
              label="Category Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              style={styles.input}
              mode="outlined"
              error={touched.name && !!errors.name}
            />
            {touched.name && errors.name && (
              <HelperText type="error">{errors.name}</HelperText>
            )}

            {/* Description */}
            <TextInput
              label="Description (Optional)"
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onCancel}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={isLoading}
                disabled={isLoading}
              >
                Save
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CategoryForm;
