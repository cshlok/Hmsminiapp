import React from 'react';
import { useAppDispatch } from '../../store';
import { deleteQuote } from '../../store/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';

interface DeleteQuoteProps {
  quoteId: string;
}

const DeleteQuoteContainer: React.FC<DeleteQuoteProps> = ({ quoteId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Delete quote from Redux store
          dispatch(deleteQuote(quoteId));
          
          // Navigate back to quotes list
          navigate('/quotes');
        } catch (error) {
          console.error('Failed to delete quote:', error);
          // Error handling would be implemented here
        }
      }, 500);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
    >
      Delete Quote
    </button>
  );
};

export default DeleteQuoteContainer;
