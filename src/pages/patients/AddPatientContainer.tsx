import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { addPatient, IPatient } from '../../store/slices/patientSlice';
import PatientForm from './PatientForm';
import { v4 as uuidv4 } from 'uuid';

const AddPatientContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  // Initial empty patient data
  const initialPatient: Partial<IPatient> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  };
  
  // Handle form submission
  const handleSubmit = (patientData: Partial<IPatient>) => {
    setLoading(true);
    
    // Create a new patient object with ID and timestamps
    const newPatient: IPatient = {
      ...patientData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as IPatient;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Add patient to Redux store
        dispatch(addPatient(newPatient));
        
        // Navigate to the patient details page
        navigate(`/patients/${newPatient.id}`);
      } catch (error) {
        console.error('Failed to add patient:', error);
        // Error handling would be implemented here
      } finally {
        setLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/patients');
  };
  
  return (
    <PatientForm
      patient={initialPatient}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
};

export default AddPatientContainer;
