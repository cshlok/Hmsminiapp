import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateQuote, setSelectedQuote, setLoading, setError, IQuote } from '../../store/slices/quoteSlice';
import QuoteForm from './QuoteForm';

const EditQuoteContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { quotes, selectedQuote, loading } = useAppSelector(state => state.quote);
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  const [formLoading, setFormLoading] = useState(false);
  
  // Load quote data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const quote = quotes.find(q => q.id === id);
        
        if (quote) {
          // Only allow editing of draft quotes
          if (quote.status !== 'draft') {
            dispatch(setError('Only draft quotes can be edited'));
            // Navigate back to details after a delay
            setTimeout(() => navigate(`/quotes/${id}`), 3000);
            return;
          }
          
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
  
  // Handle form submission
  const handleSubmit = (quoteData: Partial<IQuote>) => {
    if (!selectedQuote) return;
    
    setFormLoading(true);
    
    // Create updated quote object
    const updatedQuote: IQuote = {
      ...selectedQuote,
      ...quoteData,
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Update quote in Redux store
        dispatch(updateQuote(updatedQuote));
        
        // Navigate to the quote details page
        navigate(`/quotes/${updatedQuote.id}`);
      } catch (error) {
        console.error('Failed to update quote:', error);
        // Error handling would be implemented here
      } finally {
        setFormLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/quotes/${id}`);
  };
  
  return (
    <QuoteForm
      quote={selectedQuote || {}}
      patients={patients}
      services={services}
      loading={loading || formLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={true}
    />
  );
};

export default EditQuoteContainer;
