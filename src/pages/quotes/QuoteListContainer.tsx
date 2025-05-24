import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setQuotes, 
  setLoading, 
  setError, 
  setSearchQuery, 
  setFilterPatientId, 
  setFilterStatus, 
  setFilterDateRange,
  clearFilters,
  IQuote
} from '../../store/slices/quoteSlice';
import QuoteList from './QuoteList';

// Mock data for initial development
const mockQuotes: IQuote[] = [
  {
    id: '1',
    patientId: '1',
    title: 'General Checkup Package',
    status: 'draft',
    items: [
      {
        id: '1-1',
        serviceId: '1',
        quantity: 1,
        unitPrice: 50.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '1-2',
        serviceId: '2',
        quantity: 1,
        unitPrice: 100.00,
        discount: 10.00,
        total: 90.00
      }
    ],
    subtotal: 150.00,
    discount: 10.00,
    tax: 0,
    total: 140.00,
    notes: 'Initial consultation and physical examination package',
    validUntil: '2025-06-23',
    createdAt: '2025-05-20T10:30:00Z',
    updatedAt: '2025-05-20T10:30:00Z'
  },
  {
    id: '2',
    patientId: '2',
    title: 'Dental Care Package',
    status: 'sent',
    items: [
      {
        id: '2-1',
        serviceId: '3',
        quantity: 1,
        unitPrice: 75.00,
        discount: 0,
        total: 75.00
      }
    ],
    subtotal: 75.00,
    discount: 0,
    tax: 5.25,
    total: 80.25,
    notes: 'Standard dental cleaning package',
    validUntil: '2025-06-15',
    createdAt: '2025-05-18T14:15:00Z',
    updatedAt: '2025-05-18T14:15:00Z'
  },
  {
    id: '3',
    patientId: '3',
    title: 'Comprehensive Health Package',
    status: 'accepted',
    items: [
      {
        id: '3-1',
        serviceId: '1',
        quantity: 1,
        unitPrice: 50.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '3-2',
        serviceId: '4',
        quantity: 2,
        unitPrice: 25.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '3-3',
        serviceId: '5',
        quantity: 1,
        unitPrice: 120.00,
        discount: 20.00,
        total: 100.00
      }
    ],
    subtotal: 220.00,
    discount: 20.00,
    tax: 15.00,
    total: 215.00,
    notes: 'Full health checkup with vaccinations and X-ray',
    validUntil: '2025-06-10',
    createdAt: '2025-05-15T09:45:00Z',
    updatedAt: '2025-05-16T11:30:00Z'
  },
  {
    id: '4',
    patientId: '1',
    title: 'Follow-up Consultation',
    status: 'rejected',
    items: [
      {
        id: '4-1',
        serviceId: '1',
        quantity: 1,
        unitPrice: 50.00,
        discount: 5.00,
        total: 45.00
      }
    ],
    subtotal: 50.00,
    discount: 5.00,
    tax: 0,
    total: 45.00,
    notes: 'Follow-up consultation after initial treatment',
    validUntil: '2025-05-30',
    createdAt: '2025-05-10T13:20:00Z',
    updatedAt: '2025-05-12T10:15:00Z'
  },
  {
    id: '5',
    patientId: '2',
    title: 'Laboratory Tests Package',
    status: 'expired',
    items: [
      {
        id: '5-1',
        serviceId: '6',
        quantity: 1,
        unitPrice: 80.00,
        discount: 0,
        total: 80.00
      }
    ],
    subtotal: 80.00,
    discount: 0,
    tax: 5.60,
    total: 85.60,
    notes: 'Complete blood work and analysis',
    validUntil: '2025-05-15',
    createdAt: '2025-05-01T09:10:00Z',
    updatedAt: '2025-05-01T09:10:00Z'
  }
];

const QuoteListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quotes, loading, error, filters } = useAppSelector(state => state.quote);
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  
  // Load mock data on component mount
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        dispatch(setQuotes(mockQuotes));
      } catch (err) {
        dispatch(setError('Failed to load quotes'));
        console.error(err);
      }
    }, 1000);
  }, [dispatch]);
  
  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };
  
  // Handle filter by patient
  const handleFilterPatient = (patientId: string | null) => {
    dispatch(setFilterPatientId(patientId));
  };
  
  // Handle filter by status
  const handleFilterStatus = (status: string | null) => {
    dispatch(setFilterStatus(status));
  };
  
  // Handle filter by date range
  const handleFilterDateRange = (startDate: string | null, endDate: string | null) => {
    dispatch(setFilterDateRange({ startDate, endDate }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Get filtered quotes
  const getFilteredQuotes = () => {
    let filtered = [...quotes];
    
    // Apply patient filter if set
    if (filters.patientId) {
      filtered = filtered.filter(quote => quote.patientId === filters.patientId);
    }
    
    // Apply status filter if set
    if (filters.status) {
      filtered = filtered.filter(quote => quote.status === filters.status);
    }
    
    // Apply date range filter if set
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      filtered = filtered.filter(quote => {
        const quoteDate = new Date(quote.createdAt);
        
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          const startDate = new Date(filters.dateRange.startDate);
          const endDate = new Date(filters.dateRange.endDate);
          return quoteDate >= startDate && quoteDate <= endDate;
        } else if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          return quoteDate >= startDate;
        } else if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          return quoteDate <= endDate;
        }
        
        return true;
      });
    }
    
    // Apply search filter if query exists
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.title.toLowerCase().includes(query) ||
        (quote.notes && quote.notes.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  const filteredQuotes = getFilteredQuotes();
  
  return (
    <QuoteList
      quotes={filteredQuotes}
      patients={patients}
      services={services}
      loading={loading}
      error={error}
      searchQuery={filters.searchQuery}
      filterPatientId={filters.patientId}
      filterStatus={filters.status}
      filterDateRange={filters.dateRange}
      onSearch={handleSearch}
      onFilterPatient={handleFilterPatient}
      onFilterStatus={handleFilterStatus}
      onFilterDateRange={handleFilterDateRange}
      onClearFilters={handleClearFilters}
    />
  );
};

export default QuoteListContainer;
