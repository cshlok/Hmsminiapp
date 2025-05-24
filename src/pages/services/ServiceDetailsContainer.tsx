import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSelectedService, setLoading, setError, IService } from '../../store/slices/serviceSlice';
import ServiceDetails from './ServiceDetails';

const ServiceDetailsContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { services, categories, selectedService, loading, error } = useAppSelector(state => state.service);
  
  // Load service data on component mount
  useEffect(() => {
    if (!id) return;
    
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const service = services.find(s => s.id === id);
        
        if (service) {
          dispatch(setSelectedService(service));
        } else {
          dispatch(setError(`Service with ID ${id} not found`));
          // Navigate back to list after a delay
          setTimeout(() => navigate('/services'), 3000);
        }
      } catch (err) {
        dispatch(setError('Failed to load service details'));
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    }, 500);
    
    // Cleanup on unmount
    return () => {
      dispatch(setSelectedService(null));
    };
  }, [id, services, dispatch, navigate]);
  
  // Find category for the service
  const category = selectedService 
    ? categories.find(c => c.id === selectedService.categoryId) 
    : null;
  
  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/services/${id}/edit`);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      // Delete action will be implemented with API integration
      console.log('Delete service:', id);
      navigate('/services');
    }
  };
  
  // Handle status toggle
  const handleToggleStatus = () => {
    // Status toggle will be implemented with API integration
    console.log('Toggle status for service:', id);
  };
  
  return (
    <ServiceDetails
      service={selectedService}
      category={category}
      loading={loading}
      error={error}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
    />
  );
};

export default ServiceDetailsContainer;
