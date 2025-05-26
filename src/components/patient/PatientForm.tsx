import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
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
    age: '',
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
  const theme = useTheme();
  const [selectedGender, setSelectedGender] = useState(initialValues.gender || '');

  const handleGenderSelect = (gender: string, setFieldValue: (field: string, value: any) => void) => {
    setSelectedGender(gender);
    setFieldValue('gender', gender);
  };

  return (
    <ScrollView style={styles.container}>
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
        }) => (
          <View style={styles.formContainer}>
            <TextInput
              label="Full Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              style={styles.input}
              error={touched.name && !!errors.name}
              mode="outlined"
            />
            {touched.name && errors.name && (
              <HelperText type="error">{errors.name}</HelperText>
            )}

            <TextInput
              label="Age"
              value={String(values.age)}
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              style={styles.input}
              error={touched.age && !!errors.age}
              keyboardType="numeric"
              mode="outlined"
            />
            {touched.age && errors.age && (
              <HelperText type="error">{errors.age}</HelperText>
            )}

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <Button
                mode={selectedGender === 'Male' ? 'contained' : 'outlined'}
                onPress={() => handleGenderSelect('Male', setFieldValue)}
                style={[
                  styles.genderButton,
                  selectedGender === 'Male' && { backgroundColor: theme.colors.primary },
                ]}
              >
                Male
              </Button>
              <Button
                mode={selectedGender === 'Female' ? 'contained' : 'outlined'}
                onPress={() => handleGenderSelect('Female', setFieldValue)}
                style={[
                  styles.genderButton,
                  selectedGender === 'Female' && { backgroundColor: theme.colors.primary },
                ]}
              >
                Female
              </Button>
              <Button
                mode={selectedGender === 'Other' ? 'contained' : 'outlined'}
                onPress={() => handleGenderSelect('Other', setFieldValue)}
                style={[
                  styles.genderButton,
                  selectedGender === 'Other' && { backgroundColor: theme.colors.primary },
                ]}
              >
                Other
              </Button>
            </View>
            {touched.gender && errors.gender && (
              <HelperText type="error">{errors.gender}</HelperText>
            )}

            <TextInput
              label="Contact Number"
              value={values.contact}
              onChangeText={handleChange('contact')}
              onBlur={handleBlur('contact')}
              style={styles.input}
              error={touched.contact && !!errors.contact}
              keyboardType="phone-pad"
              mode="outlined"
            />
            {touched.contact && errors.contact && (
              <HelperText type="error">{errors.contact}</HelperText>
            )}

            <TextInput
              label="Email (Optional)"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
              error={touched.email && !!errors.email}
              keyboardType="email-address"
              mode="outlined"
            />
            {touched.email && errors.email && (
              <HelperText type="error">{errors.email}</HelperText>
            )}

            <TextInput
              label="Address (Optional)"
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
            />

            <TextInput
              label="Medical History (Optional)"
              value={values.medicalHistory}
              onChangeText={handleChange('medicalHistory')}
              onBlur={handleBlur('medicalHistory')}
              style={styles.input}
              multiline
              numberOfLines={4}
              mode="outlined"
            />

            <TextInput
              label="Allergies (Optional)"
              value={values.allergies}
              onChangeText={handleChange('allergies')}
              onBlur={handleBlur('allergies')}
              style={styles.input}
              multiline
              numberOfLines={2}
              mode="outlined"
            />

            <TextInput
              label="Medications (Optional)"
              value={values.medications}
              onChangeText={handleChange('medications')}
              onBlur={handleBlur('medications')}
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
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    marginRight: 8,
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

export default PatientForm;
