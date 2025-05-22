import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import PatientDetailsScreen from './PatientDetailsScreen';

const PatientDetailsContainer = ({ navigation, route }) => {
  const { patient } = route.params;
  const { selectedPatient } = useSelector((state: RootState) => state.patient);
  
  // Use the patient from route params or from Redux state
  const patientData = patient || selectedPatient;
  
  // If no patient data is available, go back to the list
  useEffect(() => {
    if (!patientData) {
      navigation.goBack();
    }
  }, [patientData, navigation]);
  
  if (!patientData) {
    return <View style={styles.container} />;
  }
  
  return (
    <PatientDetailsScreen patient={patientData} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PatientDetailsContainer;
