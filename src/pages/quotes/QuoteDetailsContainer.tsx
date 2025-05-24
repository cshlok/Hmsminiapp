import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedQuote, setLoading, setError, IQuote } from '../../store/slices/quoteSlice';
import QuoteDetails from './QuoteDetails';

const QuoteDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { quotes, selectedQuote, loading, error } = useAppSelector(state => state.quote);
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  
  // Load quote data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const quote = quotes.find(q => q.id === id);
        
        if (quote) {
          dispatch(setSelectedQuote(quote));
        } else {
          dispatch(setError(`Quote with ID ${id} not found`));
          // Navigate back to list after a delay
          setTimeout(() => navigate('/quotes'), 3000);
        }
      } catch (err) {
        dispatch(setError('Failed to load quote details'));
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    }, 500);
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedQuote(null));
    };
  }, [id, quotes, dispatch, navigate]);
  
  // Find patient for the quote
  const patient = selectedQuote 
    ? patients.find(p => p.id === selectedQuote.patientId) 
    : null;
  
  // Find services for the quote items
  const getServiceDetails = (serviceId: string) => {
    return services.find(s => s.id === serviceId) || null;
  };
  
  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/quotes/${id}/edit`);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      // Delete action will be implemented with API integration
      console.log('Delete quote:', id);
      navigate('/quotes');
    }
  };
  
  // Handle status change
  const handleStatusChange = (status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired') => {
    // Status change will be implemented with API integration
    console.log('Change status to:', status);
  };
  
  // Handle create bill from quote
  const handleCreateBill = () => {
    // Create bill action will be implemented with API integration
    console.log('Create bill from quote:', id);
    navigate('/billing/new', { state: { quoteId: id } });
  };
  
  return (
    <QuoteDetails
      quote={selectedQuote}
      patient={patient}
      getServiceDetails={getServiceDetails}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
      onCreateBill={handleCreateBill}
    />
  );
};

export default QuoteDetailsContainer;
