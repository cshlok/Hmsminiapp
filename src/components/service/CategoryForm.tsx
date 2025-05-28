import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormHelperText,
  Grid
} from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
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
  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff', 
      p: 2,
      overflow: 'auto'
    }}>
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
        }: FormikProps<any>) => (
          <Form>
            <Box sx={{ p: 2 }}>
              {/* Category Name */}
              <TextField
                label="Category Name"
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

export default CategoryForm;
