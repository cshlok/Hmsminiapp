import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AppointmentDetailsScreen from './AppointmentDetailsScreen';

const AppointmentDetailsContainer = ({ navigation, route }) => {
  const { appointment } = route.params;
  const { patients } = useSelector((state: RootState) => state.patient);
  const { selectedAppointment } = useSelector((state: RootState) => state.appointment);
  
  // Use the appointment from route params or from Redux state
  const appointmentData = appointment || selectedAppointment;
  
  // Find the patient for this appointment
  const patient = patients.find(p => p.id === appointmentData?.patientId) || null;
  
  // If no appointment data is available, go back to the list
  useEffect(() => {
    if (!appointmentData) {
      navigation.goBack();
    }
  }, [appointmentData, navigation]);
  
  if (!appointmentData) {
    return <View style={styles.container} />;
  }
  
  return (
    <AppointmentDetailsScreen 
      appointment={appointmentData}
      patient={patient}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default AppointmentDetailsContainer;
