import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedAppointment, setLoading, setError, IAppointment } from '../../store/slices/appointmentSlice';
import AppointmentDetails from './AppointmentDetails';

const AppointmentDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { appointments, selectedAppointment, loading, error } = useAppSelector(state => state.appointment);
  const { patients } = useAppSelector(state => state.patient);
  
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
  
  // Find patient for the appointment
  const patient = selectedAppointment 
    ? patients.find(p => p.id === selectedAppointment.patientId) 
    : null;
  
  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/appointments/${id}/edit`);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      // Delete action will be implemented with API integration
      console.log('Delete appointment:', id);
      navigate('/appointments');
    }
  };
  
  // Handle status change
  const handleStatusChange = (status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show') => {
    // Status change will be implemented with API integration
    console.log('Change status to:', status);
  };
  
  return (
    <AppointmentDetails
      appointment={selectedAppointment}
      patient={patient}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
    />
  );
};

export default AppointmentDetailsContainer;
