import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { 
  setServices,
  setCategories,
  addService,
  updateService,
  deleteService,
  addCategory,
  updateCategory,
  setLoading,
  setError,
  setSelectedService,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setFilterCategoryId
} from '../../store/slices/serviceSlice';
import { ServiceRepository } from '../../storage/ServiceRepository';
import { IService, IServiceCategory } from '../../models/ServiceModel';
import ServiceListScreen from './ServiceListScreen';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
}

const ServiceListContainer: React.FC<{ navigation: NavigationProps }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    services, 
    categories, 
    loading, 
    searchQuery, 
    sortBy, 
    sortOrder, 
    filterCategoryId 
  } = useSelector((state: RootState) => state.service);
  const [serviceRepo, setServiceRepo] = useState<ServiceRepository | null>(null);

  // Initialize repository and load services and categories
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new ServiceRepository(null as any);
        setServiceRepo(repository);
        
        // Load all services and categories
        // In a real implementation, this would fetch from Realm
        // For now, we'll just set empty arrays
        dispatch(setServices([]));
        dispatch(setCategories([]));
      } catch (error) {
        console.error('Failed to initialize service repository:', error);
        dispatch(setError('Failed to load services. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRepository();
  }, [dispatch]);

  // Handle service selection
  const handleServicePress = (service: IService) => {
    dispatch(setSelectedService(service as any));
    navigation.navigate('ServiceDetails', { 
      service,
      category: categories.find(c => c.id === service.categoryId) || null
    });
  };

  // Navigate to add service screen
  const handleAddService = () => {
    if (categories.length === 0) {
      // Use browser confirm for web compatibility
      if (confirm('You need to create at least one category before adding a service. Would you like to add a category now?')) {
        handleAddCategory();
      }
      return;
    }
    
    navigation.navigate('AddEditService', { 
      categories,
      onSave: handleSaveService
    });
  };

  // Navigate to edit service screen
  const handleEditService = (service: IService) => {
    navigation.navigate('AddEditService', { 
      service,
      categories,
      onSave: handleSaveService
    });
  };

  // Save new or updated service
  const handleSaveService = (serviceData: IService) => {
    if (!serviceRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new service or an update
      const existingService = services.find(s => s.id === serviceData.id);
      
      if (existingService) {
        // Update existing service
        // In a real implementation, this would update in Realm
        dispatch(updateService(serviceData as any));
      } else {
        // Create new service
        // In a real implementation, this would create in Realm
        const newService = {
          ...serviceData,
          id: uuidv4(), // Ensure unique ID
        };
        dispatch(addService(newService as any));
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      dispatch(setError('Failed to save service. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete service with confirmation
  const handleDeleteService = (serviceId: string) => {
    // Use browser confirm for web compatibility
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      if (!serviceRepo) return;
      
      try {
        dispatch(setLoading(true));
        // In a real implementation, this would delete from Realm
        dispatch(deleteService(serviceId));
      } catch (error) {
        console.error('Failed to delete service:', error);
        dispatch(setError('Failed to delete service. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  // Navigate to add category screen
  const handleAddCategory = () => {
    navigation.navigate('AddEditCategory', { 
      onSave: handleSaveCategory
    });
  };

  // Save new or updated category
  const handleSaveCategory = (categoryData: IServiceCategory) => {
    if (!serviceRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new category or an update
      const existingCategory = categories.find(c => c.id === categoryData.id);
      
      if (existingCategory) {
        // Update existing category
        // In a real implementation, this would update in Realm
        dispatch(updateCategory(categoryData as any));
      } else {
        // Create new category
        // In a real implementation, this would create in Realm
        const newCategory = {
          ...categoryData,
          id: uuidv4(), // Ensure unique ID
        };
        dispatch(addCategory(newCategory as any));
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      dispatch(setError('Failed to save category. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  // Handle sort change
  const handleSortChange = (newSortBy: 'name' | 'price' | 'duration', newSortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
  };

  // Handle filter by category
  const handleFilterCategory = (categoryId: string | null) => {
    dispatch(setFilterCategoryId(categoryId));
  };

  return (
    <ServiceListScreen
      services={services as unknown as IService[]}
      categories={categories as unknown as IServiceCategory[]}
      loading={loading}
      searchQuery={searchQuery}
      sortBy={sortBy}
      sortOrder={sortOrder}
      filterCategoryId={filterCategoryId}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      onFilterCategory={handleFilterCategory}
      onServicePress={handleServicePress}
      onAddService={handleAddService}
      onEditService={handleEditService}
      onDeleteService={handleDeleteService}
      onAddCategory={handleAddCategory}
    />
  );
};

export default ServiceListContainer;
