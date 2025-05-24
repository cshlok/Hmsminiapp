import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setBills, 
  setLoading, 
  setError, 
  setSearchQuery, 
  setFilterPatientId, 
  setFilterStatus, 
  setFilterDateRange,
  clearFilters,
  IBill
} from '../../store/slices/billingSlice';
import BillList from './BillList';

// Mock data for initial development
const mockBills: IBill[] = [
  {
    id: '1',
    patientId: '1',
    quoteId: '1',
    billNumber: 'BILL-2025-001',
    status: 'pending',
    items: [
      {
        id: '1-1',
        serviceId: '1',
        quoteItemId: '1-1',
        description: 'General Checkup',
        quantity: 1,
        unitPrice: 50.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '1-2',
        serviceId: '2',
        quoteItemId: '1-2',
        description: 'Blood Test',
        quantity: 1,
        unitPrice: 100.00,
        discount: 10.00,
        total: 90.00
      }
    ],
    payments: [],
    subtotal: 150.00,
    discount: 10.00,
    tax: 0,
    total: 140.00,
    amountPaid: 0,
    amountDue: 140.00,
    dueDate: '2025-06-23',
    notes: 'Initial consultation and physical examination',
    createdAt: '2025-05-20T10:30:00Z',
    updatedAt: '2025-05-20T10:30:00Z'
  },
  {
    id: '2',
    patientId: '2',
    billNumber: 'BILL-2025-002',
    status: 'partially_paid',
    items: [
      {
        id: '2-1',
        serviceId: '3',
        description: 'Dental Cleaning',
        quantity: 1,
        unitPrice: 75.00,
        discount: 0,
        total: 75.00
      }
    ],
    payments: [
      {
        id: '2-p1',
        amount: 30.00,
        method: 'cash',
        date: '2025-05-18T15:00:00Z'
      }
    ],
    subtotal: 75.00,
    discount: 0,
    tax: 5.25,
    total: 80.25,
    amountPaid: 30.00,
    amountDue: 50.25,
    dueDate: '2025-06-15',
    notes: 'Standard dental cleaning',
    createdAt: '2025-05-18T14:15:00Z',
    updatedAt: '2025-05-18T15:00:00Z'
  },
  {
    id: '3',
    patientId: '3',
    quoteId: '3',
    billNumber: 'BILL-2025-003',
    status: 'paid',
    items: [
      {
        id: '3-1',
        serviceId: '1',
        quoteItemId: '3-1',
        description: 'General Checkup',
        quantity: 1,
        unitPrice: 50.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '3-2',
        serviceId: '4',
        quoteItemId: '3-2',
        description: 'Vaccination',
        quantity: 2,
        unitPrice: 25.00,
        discount: 0,
        total: 50.00
      },
      {
        id: '3-3',
        serviceId: '5',
        quoteItemId: '3-3',
        description: 'X-Ray',
        quantity: 1,
        unitPrice: 120.00,
        discount: 20.00,
        total: 100.00
      }
    ],
    payments: [
      {
        id: '3-p1',
        amount: 215.00,
        method: 'credit_card',
        reference: 'TRANS-123456',
        date: '2025-05-16T11:30:00Z'
      }
    ],
    subtotal: 220.00,
    discount: 20.00,
    tax: 15.00,
    total: 215.00,
    amountPaid: 215.00,
    amountDue: 0,
    dueDate: '2025-06-10',
    notes: 'Full health checkup with vaccinations and X-ray',
    createdAt: '2025-05-15T09:45:00Z',
    updatedAt: '2025-05-16T11:30:00Z'
  },
  {
    id: '4',
    patientId: '1',
    billNumber: 'BILL-2025-004',
    status: 'overdue',
    items: [
      {
        id: '4-1',
        serviceId: '1',
        description: 'Follow-up Consultation',
        quantity: 1,
        unitPrice: 50.00,
        discount: 5.00,
        total: 45.00
      }
    ],
    payments: [],
    subtotal: 50.00,
    discount: 5.00,
    tax: 0,
    total: 45.00,
    amountPaid: 0,
    amountDue: 45.00,
    dueDate: '2025-05-15',
    notes: 'Follow-up consultation after initial treatment',
    createdAt: '2025-05-10T13:20:00Z',
    updatedAt: '2025-05-10T13:20:00Z'
  },
  {
    id: '5',
    patientId: '2',
    billNumber: 'BILL-2025-005',
    status: 'cancelled',
    items: [
      {
        id: '5-1',
        serviceId: '6',
        description: 'Laboratory Tests',
        quantity: 1,
        unitPrice: 80.00,
        discount: 0,
        total: 80.00
      }
    ],
    payments: [],
    subtotal: 80.00,
    discount: 0,
    tax: 5.60,
    total: 85.60,
    amountPaid: 0,
    amountDue: 0,
    dueDate: '2025-05-15',
    notes: 'Complete blood work and analysis - Cancelled due to patient request',
    createdAt: '2025-05-01T09:10:00Z',
    updatedAt: '2025-05-02T14:30:00Z'
  }
];

const BillListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bills, loading, error, filters } = useAppSelector(state => state.billing);
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  
  // Load mock data on component mount
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        dispatch(setBills(mockBills));
      } catch (err) {
        dispatch(setError('Failed to load bills'));
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
  
  // Get filtered bills
  const getFilteredBills = () => {
    let filtered = [...bills];
    
    // Apply patient filter if set
    if (filters.patientId) {
      filtered = filtered.filter(bill => bill.patientId === filters.patientId);
    }
    
    // Apply status filter if set
    if (filters.status) {
      filtered = filtered.filter(bill => bill.status === filters.status);
    }
    
    // Apply date range filter if set
    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.createdAt);
        
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          const startDate = new Date(filters.dateRange.startDate);
          const endDate = new Date(filters.dateRange.endDate);
          return billDate >= startDate && billDate <= endDate;
        } else if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          return billDate >= startDate;
        } else if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          return billDate <= endDate;
        }
        
        return true;
      });
    }
    
    // Apply search filter if query exists
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(bill => 
        bill.billNumber.toLowerCase().includes(query) ||
        (bill.notes && bill.notes.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  const filteredBills = getFilteredBills();
  
  return (
    <BillList
      bills={filteredBills}
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

export default BillListContainer;
