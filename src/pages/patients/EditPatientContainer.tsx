import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { updatePatient, setSelectedPatient, setLoading, setError, IPatient } from '../../store/slices/patientSlice';
import PatientForm from './PatientForm';

const EditPatientContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { patients, selectedPatient, loading } = useAppSelector(state => state.patient);
  const [formLoading, setFormLoading] = useState(false);
  
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
  
  // Handle form submission
  const handleSubmit = (patientData: Partial<IPatient>) => {
    if (!selectedPatient) return;
    
    setFormLoading(true);
    
    // Create updated patient object
    const updatedPatient: IPatient = {
      ...selectedPatient,
      ...patientData,
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Update patient in Redux store
        dispatch(updatePatient(updatedPatient));
        
        // Navigate to the patient details page
        navigate(`/patients/${updatedPatient.id}`);
      } catch (error) {
        console.error('Failed to update patient:', error);
        // Error handling would be implemented here
      } finally {
        setFormLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/patients/${id}`);
  };
  
  return (
    <PatientForm
      patient={selectedPatient || {}}
      loading={loading || formLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={true}
    />
  );
};

export default EditPatientContainer;
