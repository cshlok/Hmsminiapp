import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addAppointment, IAppointment } from '../../store/slices/appointmentSlice';
import AppointmentForm from './AppointmentForm';
import { v4 as uuidv4 } from 'uuid';

const AddAppointmentContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Get patient ID from URL if available
  const patientId = searchParams.get('patientId') || '';
  
  // Get patients from store for patient selection
  const { patients } = useAppSelector(state => state.patient);
  
  // Initial empty appointment data
  const initialAppointment: Partial<IAppointment> = {
    patientId,
    title: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    notes: '',
    serviceIds: [],
  };
  
  // Handle form submission
  const handleSubmit = (appointmentData: Partial<IAppointment>) => {
    setLoading(true);
    
    // Create a new appointment object with ID and timestamps
    const newAppointment: IAppointment = {
      ...appointmentData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as IAppointment;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Add appointment to Redux store
        dispatch(addAppointment(newAppointment));
        
        // Navigate to the appointment details page
        navigate(`/appointments/${newAppointment.id}`);
      } catch (error) {
        console.error('Failed to add appointment:', error);
        // Error handling would be implemented here
      } finally {
        setLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/appointments');
  };
  
  return (
    <AppointmentForm
      appointment={initialAppointment}
      patients={patients}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
};

export default AddAppointmentContainer;
