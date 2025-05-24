import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { updateService, setSelectedService, setLoading, setError, IService } from '../../store/slices/serviceSlice';
import ServiceForm from './ServiceForm';

const EditServiceContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { services, categories, selectedService, loading } = useAppSelector(state => state.service);
  const [formLoading, setFormLoading] = useState(false);
  
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
  
  // Handle form submission
  const handleSubmit = (serviceData: Partial<IService>) => {
    if (!selectedService) return;
    
    setFormLoading(true);
    
    // Create updated service object
    const updatedService: IService = {
      ...selectedService,
      ...serviceData,
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Update service in Redux store
        dispatch(updateService(updatedService));
        
        // Navigate to the service details page
        navigate(`/services/${updatedService.id}`);
      } catch (error) {
        console.error('Failed to update service:', error);
        // Error handling would be implemented here
      } finally {
        setFormLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/services/${id}`);
  };
  
  return (
    <ServiceForm
      service={selectedService || {}}
      categories={categories}
      loading={loading || formLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={true}
    />
  );
};

export default EditServiceContainer;
