import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addService, IService } from '../../store/slices/serviceSlice';
import ServiceForm from './ServiceForm';
import { v4 as uuidv4 } from 'uuid';

const AddServiceContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  
  // Get categories from store for category selection
  const { categories } = useAppSelector(state => state.service);
  
  // Initial empty service data
  const initialService: Partial<IService> = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    categoryId: categories.length > 0 ? categories[0].id : '',
    isActive: true,
  };
  
  // Handle form submission
  const handleSubmit = (serviceData: Partial<IService>) => {
    setLoading(true);
    
    // Create a new service object with ID and timestamps
    const newService: IService = {
      ...serviceData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as IService;
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Add service to Redux store
        dispatch(addService(newService));
        
        // Navigate to the service details page
        navigate(`/services/${newService.id}`);
      } catch (error) {
        console.error('Failed to add service:', error);
        // Error handling would be implemented here
      } finally {
        setLoading(false);
      }
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/services');
  };
  
  return (
    <ServiceForm
      service={initialService}
      categories={categories}
      loading={loading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditing={false}
    />
  );
};

export default AddServiceContainer;
