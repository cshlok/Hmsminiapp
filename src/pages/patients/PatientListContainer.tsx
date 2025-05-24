import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setPatients, 
  setLoading, 
  setError, 
  setSearchQuery, 
  setFilterGender, 
  clearFilters,
  IPatient
} from '../../store/slices/patientSlice';
import PatientList from './PatientList';

// Mock data for initial development
const mockPatients: IPatient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    address: '123 Main St, Anytown, USA',
    medicalHistory: 'Hypertension, Diabetes',
    allergies: 'Penicillin',
    medications: 'Metformin, Lisinopril',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-03-20T14:45:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    address: '456 Oak Ave, Somewhere, USA',
    allergies: 'None',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-02-10T10:15:00Z'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1978-11-30',
    gender: 'male',
    address: '789 Pine St, Elsewhere, USA',
    medicalHistory: 'Asthma',
    medications: 'Albuterol',
    createdAt: '2023-03-05T09:20:00Z',
    updatedAt: '2023-04-12T11:30:00Z'
  }
];

const PatientListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { patients, loading, error, filters } = useAppSelector(state => state.patient);
  
  // Load mock data on component mount
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        dispatch(setPatients(mockPatients));
      } catch (err) {
        dispatch(setError('Failed to load patients'));
        console.error(err);
      }
    }, 1000);
  }, [dispatch]);
  
  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };
  
  // Handle filter by gender
  const handleFilterGender = (gender: string | null) => {
    dispatch(setFilterGender(gender));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Get filtered patients
  const getFilteredPatients = () => {
    let filtered = [...patients];
    
    // Apply gender filter if set
    if (filters.gender) {
      filtered = filtered.filter(patient => patient.gender === filters.gender);
    }
    
    // Apply search filter if query exists
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredPatients = getFilteredPatients();
  
  return (
    <PatientList
      patients={filteredPatients}
      loading={loading}
      error={error}
      searchQuery={filters.searchQuery}
      filterGender={filters.gender}
      onSearch={handleSearch}
      onFilterGender={handleFilterGender}
      onClearFilters={handleClearFilters}
    />
  );
};

export default PatientListContainer;
