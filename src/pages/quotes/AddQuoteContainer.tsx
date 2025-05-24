import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addQuote, IQuote, IQuoteItem } from '../../store/slices/quoteSlice';
import QuoteForm from './QuoteForm';
import { v4 as uuidv4 } from 'uuid';

const AddQuoteContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  // Get patients and services from store for selection
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  
  // Calculate a default valid until date (30 days from now)
  const getDefaultValidUntil = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  // Initial empty quote data
  const initialQuote: Partial<IQuote> = {
    title: '',
    patientId: patients.length > 0 ? patients[0].id : '',
    status: 'draft',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    notes: '',
    validUntil: getDefaultValidUntil(),
  };
  
  // Handle form submission
  const handleSubmit = (quoteData: Partial<IQuote>) => {
    setLoading(true);
    
    // Create a new quote object with ID and timestamps
    const newQuote: IQuote = {
      ...quoteData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: quoteData.items || [],
    } as IQuote;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Add quote to Redux store
        dispatch(addQuote(newQuote));
        
        // Navigate to the quote details page
        navigate(`/quotes/${newQuote.id}`);
      } catch (error) {
        console.error('Failed to add quote:', error);
        // Error handling would be implemented here
      } finally {
        setLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/quotes');
  };
  
  return (
    <QuoteForm
      quote={initialQuote}
      patients={patients}
      services={services}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
};

export default AddQuoteContainer;
