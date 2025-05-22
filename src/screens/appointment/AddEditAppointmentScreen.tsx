import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import AppointmentForm from '../../components/appointment/AppointmentForm';
import { IAppointment } from '../../models/AppointmentModel';

interface AddEditAppointmentScreenProps {
  navigation: any;
  route: any;
  patients: any[];
  onSave: (appointment: IAppointment) => void;
  checkTimeSlotAvailability: (date: Date, startTime: string, endTime: string, appointmentId?: string) => boolean;
  isLoading?: boolean;
}

const AddEditAppointmentScreen: React.FC<AddEditAppointmentScreenProps> = ({
  navigation,
  route,
  patients,
  onSave,
  checkTimeSlotAvailability,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { appointment, selectedDate } = route.params || {};
  const isEditing = !!appointment;
  
  const handleSubmit = (values: any) => {
    // Create a new appointment object or update existing one
    const appointmentData: IAppointment = {
      id: isEditing ? appointment.id : uuidv4(),
      patientId: values.patientId,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      duration: values.duration,
      status: values.status,
      notes: values.notes || '',
      reminderSent: isEditing ? appointment.reminderSent : false,
      createdAt: isEditing ? appointment.createdAt : new Date(),
      updatedAt: new Date(),
    };
    
    onSave(appointmentData);
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  // Prepare initial values
  const initialValues = isEditing ? appointment : {
    patientId: '',
    date: selectedDate || new Date(),
    startTime: '',
    endTime: '',
    duration: 30,
    status: 'scheduled',
    notes: '',
    reminderSent: false,
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Appointment' : 'Add New Appointment'} />
      </Appbar.Header>
      
      <AppointmentForm
        initialValues={initialValues}
        patients={patients}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        checkTimeSlotAvailability={checkTimeSlotAvailability}
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

export default AddEditAppointmentScreen;
