import React from 'react';
import { useAppDispatch } from '../../store';
import { deleteService } from '../../store/slices/serviceSlice';
import { useNavigate } from 'react-router-dom';

interface DeleteServiceProps {
  serviceId: string;
}

const DeleteServiceContainer: React.FC<DeleteServiceProps> = ({ serviceId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Delete service from Redux store
          dispatch(deleteService(serviceId));
          
          // Navigate back to services list
          navigate('/services');
        } catch (error) {
          console.error('Failed to delete service:', error);
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
      Delete Service
    </button>
  );
};

export default DeleteServiceContainer;
