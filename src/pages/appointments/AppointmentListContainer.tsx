import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setAppointments, 
  setLoading, 
  setError, 
  setSearchQuery,
  setFilterPatientId,
  setFilterStatus,
  setFilterDateRange,
  clearFilters,
  IAppointment
} from '../../store/slices/appointmentSlice';
import AppointmentList from './AppointmentList';
import { useSearchParams } from 'react-router-dom';

// Mock data for initial development
const mockAppointments: IAppointment[] = [
  {
    id: '1',
    patientId: '1',
    title: 'Regular Checkup',
    date: '2025-05-24',
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    notes: 'Annual physical examination',
    serviceIds: ['1', '2'],
    createdAt: '2025-05-20T10:30:00Z',
    updatedAt: '2025-05-20T10:30:00Z'
  },
  {
    id: '2',
    patientId: '2',
    title: 'Dental Cleaning',
    date: '2025-05-24',
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    notes: 'Regular cleaning and checkup',
    serviceIds: ['3'],
    createdAt: '2025-05-19T14:15:00Z',
    updatedAt: '2025-05-20T09:00:00Z'
  },
  {
    id: '3',
    patientId: '3',
    title: 'Follow-up Consultation',
    date: '2025-05-25',
    startTime: '13:30',
    endTime: '14:00',
    status: 'scheduled',
    notes: 'Follow-up for previous treatment',
    serviceIds: ['1'],
    createdAt: '2025-05-18T11:45:00Z',
    updatedAt: '2025-05-18T11:45:00Z'
  },
  {
    id: '4',
    patientId: '1',
    title: 'Vaccination',
    date: '2025-05-26',
    startTime: '15:00',
    endTime: '15:15',
    status: 'scheduled',
    notes: 'Annual flu shot',
    serviceIds: ['4'],
    createdAt: '2025-05-20T16:20:00Z',
    updatedAt: '2025-05-20T16:20:00Z'
  },
  {
    id: '5',
    patientId: '2',
    title: 'X-Ray Session',
    date: '2025-05-27',
    startTime: '11:30',
    endTime: '12:00',
    status: 'scheduled',
    notes: 'Chest X-ray',
    serviceIds: ['5'],
    createdAt: '2025-05-21T09:10:00Z',
    updatedAt: '2025-05-21T09:10:00Z'
  }
];

const AppointmentListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { appointments, loading, error, filters } = useAppSelector(state => state.appointment);
  const { patients } = useAppSelector(state => state.patient);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Load mock data on component mount and handle URL params
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Check for patient filter in URL
    const patientId = searchParams.get('patientId');
    if (patientId) {
      dispatch(setFilterPatientId(patientId));
    }
    
    // Check for date filter in URL
    const date = searchParams.get('date');
    if (date) {
      dispatch(setFilterDateRange({
        startDate: date,
        endDate: null
      }));
    }
    
    // Check for status filter in URL
    const status = searchParams.get('status');
    if (status) {
      dispatch(setFilterStatus(status));
    }
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        dispatch(setAppointments(mockAppointments));
      } catch (err) {
        dispatch(setError('Failed to load appointments'));
        console.error(err);
      }
    }, 1000);
  }, [dispatch, searchParams]);
  
  // Handle date filter
  const handleFilterDate = (date: string | null) => {
    dispatch(setFilterDateRange({
      startDate: date,
      endDate: null
    }));
    updateSearchParams('date', date);
  };
  
  // Handle patient filter
  const handleFilterPatient = (patientId: string | null) => {
    dispatch(setFilterPatientId(patientId));
    updateSearchParams('patientId', patientId);
  };
  
  // Handle status filter
  const handleFilterStatus = (status: string | null) => {
    dispatch(setFilterStatus(status));
    updateSearchParams('status', status);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };
  
  // Update search params without losing existing ones
  const updateSearchParams = (key: string, value: string | null) => {
    const current = Object.fromEntries(searchParams.entries());
    if (value === null) {
      delete current[key];
    } else {
      current[key] = value;
    }
    setSearchParams(current);
  };
  
  // Get filtered appointments
  const getFilteredAppointments = () => {
    let filtered = [...appointments];
    
    // Apply date filter if set
    if (filters.dateRange.startDate) {
      filtered = filtered.filter(appointment => appointment.date === filters.dateRange.startDate);
    }
    
    // Apply patient filter if set
    if (filters.patientId) {
      filtered = filtered.filter(appointment => appointment.patientId === filters.patientId);
    }
    
    // Apply status filter if set
    if (filters.status) {
      filtered = filtered.filter(appointment => appointment.status === filters.status);
    }
    
    // Apply search filter if query exists
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(appointment => 
        appointment.title.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredAppointments = getFilteredAppointments();
  
  return (
    <AppointmentList
      appointments={filteredAppointments}
      patients={patients}
      loading={loading}
      error={error}
      filterDate={filters.dateRange.startDate}
      filterPatientId={filters.patientId}
      filterStatus={filters.status}
      searchQuery={filters.searchQuery}
      onFilterDate={handleFilterDate}
      onFilterPatient={handleFilterPatient}
      onFilterStatus={handleFilterStatus}
      onClearFilters={handleClearFilters}
      onSearch={(query) => dispatch(setSearchQuery(query))}
    />
  );
};

export default AppointmentListContainer;
