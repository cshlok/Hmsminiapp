import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormHelperText, 
  Chip, 
  Stack,
  Grid,
  InputAdornment,
  Paper
} from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
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
  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff', 
      p: 2,
      overflow: 'auto'
    }}>
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
        }: FormikProps<any>) => (
          <Form>
            <Box sx={{ p: 2 }}>
              {/* Category Selection */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Category
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                mb: 2 
              }}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setFieldValue('categoryId', category.id)}
                    color={values.categoryId === category.id ? 'primary' : 'default'}
                    variant={values.categoryId === category.id ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
              {touched.categoryId && errors.categoryId && (
                <FormHelperText error>{errors.categoryId}</FormHelperText>
              )}

              {/* Service Name */}
              <TextField
                label="Service Name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />

              {/* Description */}
              <TextField
                label="Description (Optional)"
                value={values.description}
                onChange={handleChange('description')}
                onBlur={handleBlur('description')}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
              />

              {/* Price */}
              <TextField
                label="Price"
                value={String(values.price)}
                onChange={(e) => {
                  // Allow only numbers and decimal point
                  const sanitizedText = e.target.value.replace(/[^0-9.]/g, '');
                  setFieldValue('price', sanitizedText);
                }}
                onBlur={handleBlur('price')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />

              {/* Duration */}
              <TextField
                label="Duration (minutes)"
                value={String(values.duration)}
                onChange={(e) => {
                  // Allow only numbers
                  const sanitizedText = e.target.value.replace(/[^0-9]/g, '');
                  setFieldValue('duration', sanitizedText);
                }}
                onBlur={handleBlur('duration')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.duration && !!errors.duration}
                helperText={touched.duration && errors.duration}
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                }}
              />

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 4,
                mb: 4
              }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{ flex: 1, mx: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSubmit()}
                  sx={{ flex: 1, mx: 1 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ServiceForm;
