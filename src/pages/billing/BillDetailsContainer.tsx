import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedBill, setLoading, setError, IBill } from '../../store/slices/billingSlice';
import BillDetails from './BillDetails';

const BillDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { bills, selectedBill, loading, error } = useAppSelector(state => state.billing);
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  const { quotes } = useAppSelector(state => state.quote);
  
  // Load bill data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const bill = bills.find(b => b.id === id);
        
        if (bill) {
          dispatch(setSelectedBill(bill));
        } else {
          dispatch(setError(`Bill with ID ${id} not found`));
          // Navigate back to list after a delay
          setTimeout(() => navigate('/billing'), 3000);
        }
      } catch (err) {
        dispatch(setError('Failed to load bill details'));
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    }, 500);
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedBill(null));
    };
  }, [id, bills, dispatch, navigate]);
  
  // Find patient for the bill
  const patient = selectedBill 
    ? patients.find(p => p.id === selectedBill.patientId) 
    : null;
  
  // Find quote for the bill if it exists
  const quote = selectedBill && selectedBill.quoteId
    ? quotes.find(q => q.id === selectedBill.quoteId)
    : null;
  
  // Find services for the bill items
  const getServiceDetails = (serviceId: string) => {
    return services.find(s => s.id === serviceId) || null;
  };
  
  // Handle edit navigation
  const handleEdit = () => {
    if (selectedBill && (selectedBill.status === 'draft' || selectedBill.status === 'pending')) {
      navigate(`/billing/${id}/edit`);
    } else {
      alert('Only draft or pending bills can be edited');
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    if (selectedBill && selectedBill.status === 'draft') {
      if (window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) {
        // Delete action will be implemented with API integration
        console.log('Delete bill:', id);
        navigate('/billing');
      }
    } else {
      alert('Only draft bills can be deleted');
    }
  };
  
  // Handle status change
  const handleStatusChange = (status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled') => {
    // Status change will be implemented with API integration
    console.log('Change status to:', status);
  };
  
  // Handle add payment navigation
  const handleAddPayment = () => {
    if (selectedBill && selectedBill.status !== 'paid' && selectedBill.status !== 'cancelled') {
      navigate(`/billing/${id}/payment`);
    } else {
      alert('Cannot add payment to a paid or cancelled bill');
    }
  };
  
  // Handle print bill
  const handlePrintBill = () => {
    // Print functionality will be implemented
    console.log('Print bill:', id);
    window.print();
  };
  
  return (
    <BillDetails
      bill={selectedBill}
      patient={patient}
      quote={quote}
      getServiceDetails={getServiceDetails}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
      onAddPayment={handleAddPayment}
      onPrintBill={handlePrintBill}
    />
  );
};

export default BillDetailsContainer;
