import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormHelperText,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { IPatient } from '../../models/PatientModel';

interface PatientFormProps {
  initialValues?: Partial<IPatient>;
  onSubmit: (values: Partial<IPatient>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Validation schema for patient form
const PatientSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  gender: Yup.string().required('Gender is required'),
  contact: Yup.string().required('Contact number is required'),
  email: Yup.string().email('Invalid email format'),
  address: Yup.string(),
  medicalHistory: Yup.string(),
  allergies: Yup.string(),
  medications: Yup.string(),
});

const PatientForm: React.FC<PatientFormProps> = ({
  initialValues = {
    name: '',
    age: 0,
    gender: '',
    contact: '',
    email: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
  },
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedGender, setSelectedGender] = useState(initialValues.gender || '');

  const handleGenderSelect = (gender: string, setFieldValue: (field: string, value: string) => void) => {
    setSelectedGender(gender);
    setFieldValue('gender', gender);
  };

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#fff', 
      p: 2,
      overflow: 'auto'
    }}>
      <Formik
        initialValues={initialValues}
        validationSchema={PatientSchema}
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
        }: FormikProps<Partial<IPatient>>) => (
          <Form>
            <Box sx={{ p: 2 }}>
              <TextField
                label="Full Name"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name as string}
              />

              <TextField
                label="Age"
                value={String(values.age)}
                onChange={handleChange('age')}
                onBlur={handleBlur('age')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.age && !!errors.age}
                helperText={touched.age && errors.age as string}
                type="number"
              />

              <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                Gender
              </Typography>
              <ToggleButtonGroup
                value={values.gender}
                exclusive
                onChange={(e, value) => value && handleGenderSelect(value, setFieldValue)}
                aria-label="gender selection"
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="Male">Male</ToggleButton>
                <ToggleButton value="Female">Female</ToggleButton>
                <ToggleButton value="Other">Other</ToggleButton>
              </ToggleButtonGroup>
              {touched.gender && errors.gender && (
                <FormHelperText error>{errors.gender as string}</FormHelperText>
              )}

              <TextField
                label="Contact Number"
                value={values.contact}
                onChange={handleChange('contact')}
                onBlur={handleBlur('contact')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact as string}
              />

              <TextField
                label="Email (Optional)"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email as string}
                type="email"
              />

              <TextField
                label="Address (Optional)"
                value={values.address}
                onChange={handleChange('address')}
                onBlur={handleBlur('address')}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
              />

              <TextField
                label="Medical History (Optional)"
                value={values.medicalHistory}
                onChange={handleChange('medicalHistory')}
                onBlur={handleBlur('medicalHistory')}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />

              <TextField
                label="Allergies (Optional)"
                value={values.allergies}
                onChange={handleChange('allergies')}
                onBlur={handleBlur('allergies')}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
              />

              <TextField
                label="Medications (Optional)"
                value={values.medications}
                onChange={handleChange('medications')}
                onBlur={handleBlur('medications')}
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

export default PatientForm;
