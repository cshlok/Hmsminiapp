import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { 
  setAppointments, 
  addAppointment, 
  updateAppointment, 
  deleteAppointment, 
  setLoading, 
  setError,
  setSelectedAppointment,
  setFilterStatus
} from '../../store/slices/appointmentSlice';
import { AppointmentRepository } from '../../storage/AppointmentRepository';
import { IAppointment } from '../../models/AppointmentModel';
import AppointmentListScreen from './AppointmentListScreen';

const AppointmentListContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { appointments, loading, error, filterStatus } = useSelector((state: RootState) => state.appointment);
  const { patients } = useSelector((state: RootState) => state.patient);
  const [appointmentRepo, setAppointmentRepo] = useState<AppointmentRepository | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Initialize repository and load appointments
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new AppointmentRepository(null);
        setAppointmentRepo(repository);
        
        // Load all appointments
        // In a real implementation, this would fetch from Realm
        // For now, we'll just set an empty array
        dispatch(setAppointments([]));
      } catch (error) {
        console.error('Failed to initialize appointment repository:', error);
        dispatch(setError('Failed to load appointments. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRepository();
  }, [dispatch]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle appointment selection
  const handleAppointmentPress = (appointment: IAppointment) => {
    dispatch(setSelectedAppointment(appointment));
    navigation.navigate('AppointmentDetails', { 
      appointment,
      patient: patients.find(p => p.id === appointment.patientId) || null
    });
  };

  // Navigate to add appointment screen
  const handleAddAppointment = () => {
    navigation.navigate('AddEditAppointment', { 
      selectedDate,
      patients,
      onSave: handleSaveAppointment,
      checkTimeSlotAvailability: checkTimeSlotAvailability
    });
  };

  // Navigate to edit appointment screen
  const handleEditAppointment = (appointment: IAppointment) => {
    navigation.navigate('AddEditAppointment', { 
      appointment,
      patients,
      onSave: handleSaveAppointment,
      checkTimeSlotAvailability: checkTimeSlotAvailability
    });
  };

  // Save new or updated appointment
  const handleSaveAppointment = (appointmentData: IAppointment) => {
    if (!appointmentRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new appointment or an update
      const existingAppointment = appointments.find(a => a.id === appointmentData.id);
      
      if (existingAppointment) {
        // Update existing appointment
        // In a real implementation, this would update in Realm
        dispatch(updateAppointment(appointmentData));
      } else {
        // Create new appointment
        // In a real implementation, this would create in Realm
        const newAppointment = {
          ...appointmentData,
          id: uuidv4(), // Ensure unique ID
        };
        dispatch(addAppointment(newAppointment));
      }
    } catch (error) {
      console.error('Failed to save appointment:', error);
      dispatch(setError('Failed to save appointment. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete appointment with confirmation
  const handleDeleteAppointment = (appointmentId: string) => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (!appointmentRepo) return;
            
            try {
              dispatch(setLoading(true));
              // In a real implementation, this would delete from Realm
              dispatch(deleteAppointment(appointmentId));
            } catch (error) {
              console.error('Failed to delete appointment:', error);
              dispatch(setError('Failed to delete appointment. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          }
        },
      ]
    );
  };

  // Handle filter status change
  const handleFilterStatus = (status: string | null) => {
    dispatch(setFilterStatus(status));
  };

  // Check if a time slot is available
  const checkTimeSlotAvailability = (date: Date, startTime: string, endTime: string, appointmentId?: string) => {
    // In a real implementation, this would check against Realm database
    // For now, we'll just return true
    return true;
  };

  return (
    <AppointmentListScreen
      appointments={appointments}
      patients={patients}
      loading={loading}
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onAppointmentPress={handleAppointmentPress}
      onAddAppointment={handleAddAppointment}
      onEditAppointment={handleEditAppointment}
      onDeleteAppointment={handleDeleteAppointment}
      onFilterStatus={handleFilterStatus}
      filterStatus={filterStatus}
    />
  );
};

export default AppointmentListContainer;
