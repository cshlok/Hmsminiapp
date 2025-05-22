import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, Chip, SegmentedButtons } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface ServiceFormProps {
  initialValues?: Partial<IService>;
  categories: IServiceCategory[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Validation schema for service form
const ServiceSchema = Yup.object().shape({
  categoryId: Yup.string().required('Category is required'),
  name: Yup.string().required('Service name is required').min(2, 'Name must be at least 2 characters'),
  description: Yup.string(),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative')
    .typeError('Price must be a number'),
  duration: Yup.number()
    .required('Duration is required')
    .positive('Duration must be positive')
    .integer('Duration must be a whole number')
    .typeError('Duration must be a number'),
});

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialValues = {
    categoryId: '',
    name: '',
    description: '',
    price: 0,
    duration: 30,
  },
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={ServiceSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            {/* Category Selection */}
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  selected={values.categoryId === category.id}
                  onPress={() => setFieldValue('categoryId', category.id)}
                  style={styles.categoryChip}
                  mode={values.categoryId === category.id ? 'flat' : 'outlined'}
                >
                  {category.name}
                </Chip>
              ))}
            </ScrollView>
            {touched.categoryId && errors.categoryId && (
              <HelperText type="error">{errors.categoryId}</HelperText>
            )}

            {/* Service Name */}
            <TextInput
              label="Service Name"
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

            {/* Price */}
            <TextInput
              label="Price ($)"
              value={String(values.price)}
              onChangeText={(text) => {
                // Allow only numbers and decimal point
                const sanitizedText = text.replace(/[^0-9.]/g, '');
                setFieldValue('price', sanitizedText);
              }}
              onBlur={handleBlur('price')}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              error={touched.price && !!errors.price}
              left={<TextInput.Affix text="$" />}
            />
            {touched.price && errors.price && (
              <HelperText type="error">{errors.price}</HelperText>
            )}

            {/* Duration */}
            <TextInput
              label="Duration (minutes)"
              value={String(values.duration)}
              onChangeText={(text) => {
                // Allow only numbers
                const sanitizedText = text.replace(/[^0-9]/g, '');
                setFieldValue('duration', sanitizedText);
              }}
              onBlur={handleBlur('duration')}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              error={touched.duration && !!errors.duration}
              right={<TextInput.Affix text="min" />}
            />
            {touched.duration && errors.duration && (
              <HelperText type="error">{errors.duration}</HelperText>
            )}

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
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
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

export default ServiceForm;
