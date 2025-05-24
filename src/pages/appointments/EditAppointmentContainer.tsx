import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateAppointment, setSelectedAppointment, setLoading, setError, IAppointment } from '../../store/slices/appointmentSlice';
import AppointmentForm from './AppointmentForm';

const EditAppointmentContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { appointments, selectedAppointment, loading } = useAppSelector(state => state.appointment);
  const { patients } = useAppSelector(state => state.patient);
  const [formLoading, setFormLoading] = useState(false);
  
  // Load appointment data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const appointment = appointments.find(a => a.id === id);
        
        if (appointment) {
          dispatch(setSelectedAppointment(appointment));
        } else {
          dispatch(setError(`Appointment with ID ${id} not found`));
          // Navigate back to list after a delay
          setTimeout(() => navigate('/appointments'), 3000);
        }
      } catch (err) {
        dispatch(setError('Failed to load appointment details'));
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    }, 500);
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedAppointment(null));
    };
  }, [id, appointments, dispatch, navigate]);
  
  // Handle form submission
  const handleSubmit = (appointmentData: Partial<IAppointment>) => {
    if (!selectedAppointment) return;
    
    setFormLoading(true);
    
    // Create updated appointment object
    const updatedAppointment: IAppointment = {
      ...selectedAppointment,
      ...appointmentData,
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Update appointment in Redux store
        dispatch(updateAppointment(updatedAppointment));
        
        // Navigate to the appointment details page
        navigate(`/appointments/${updatedAppointment.id}`);
      } catch (error) {
        console.error('Failed to update appointment:', error);
        // Error handling would be implemented here
      } finally {
        setFormLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/appointments/${id}`);
  };
  
  return (
    <AppointmentForm
      appointment={selectedAppointment || {}}
      patients={patients}
      loading={loading || formLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={true}
    />
  );
};

export default EditAppointmentContainer;
