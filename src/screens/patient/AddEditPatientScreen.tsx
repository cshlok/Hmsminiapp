import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import PatientForm from '../../components/patient/PatientForm';
import { IPatient } from '../../models/PatientModel';

interface AddEditPatientScreenProps {
  navigation: {goBack: () => void};
  route: {params?: {patient?: IPatient}};
  onSave: (patient: IPatient) => void;
  isLoading?: boolean;
}

const AddEditPatientScreen: React.FC<AddEditPatientScreenProps> = ({
  navigation,
  route,
  onSave,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { patient } = route.params || {};
  const isEditing = !!patient;
  
  const handleSubmit = (values: any) => {
    // Create a new patient object or update existing one
    const patientData: IPatient = {
      id: isEditing ? patient.id : uuidv4(),
      name: values.name,
      age: parseInt(values.age, 10),
      gender: values.gender,
      contact: values.contact,
      email: values.email || '',
      address: values.address || '',
      medicalHistory: values.medicalHistory || '',
      allergies: values.allergies || '',
      medications: values.medications || '',
      lastVisit: isEditing ? patient.lastVisit : null,
      createdAt: isEditing ? patient.createdAt : new Date(),
      updatedAt: new Date(),
    };
    
    onSave(patientData);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Patient' : 'Add New Patient'} />
      </Appbar.Header>
      
      <PatientForm
        initialValues={patient}
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

export default AddEditPatientScreen;
