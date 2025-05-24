import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedPatient, setLoading, setError, IPatient } from '../../store/slices/patientSlice';
import PatientDetails from './PatientDetails';

const PatientDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { patients, selectedPatient, loading, error } = useAppSelector(state => state.patient);
  
  // Load patient data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const patient = patients.find(p => p.id === id);
        
        if (patient) {
          dispatch(setSelectedPatient(patient));
        } else {
          dispatch(setError(`Patient with ID ${id} not found`));
          // Navigate back to list after a delay
          setTimeout(() => navigate('/patients'), 3000);
        }
      } catch (err) {
        dispatch(setError('Failed to load patient details'));
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    }, 500);
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedPatient(null));
    };
  }, [id, patients, dispatch, navigate]);
  
  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/patients/${id}/edit`);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      // Delete action will be implemented with API integration
      console.log('Delete patient:', id);
      navigate('/patients');
    }
  };
  
  // Handle new appointment
  const handleNewAppointment = () => {
    navigate(`/appointments/new?patientId=${id}`);
  };
  
  // Handle view appointments
  const handleViewAppointments = () => {
    navigate(`/appointments?patientId=${id}`);
  };
  
  // Handle new quote
  const handleNewQuote = () => {
    navigate(`/quotes/new?patientId=${id}`);
  };
  
  // Handle view quotes
  const handleViewQuotes = () => {
    navigate(`/quotes?patientId=${id}`);
  };
  
  // Handle view bills
  const handleViewBills = () => {
    navigate(`/billing?patientId=${id}`);
  };
  
  return (
    <PatientDetails
      patient={selectedPatient}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onNewAppointment={handleNewAppointment}
      onViewAppointments={handleViewAppointments}
      onNewQuote={handleNewQuote}
      onViewQuotes={handleViewQuotes}
      onViewBills={handleViewBills}
    />
  );
};

export default PatientDetailsContainer;
