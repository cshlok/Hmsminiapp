import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  setServices, 
  setCategories,
  setLoading, 
  setError, 
  setSearchQuery, 
  setFilterCategoryId, 
  setFilterActive,
  clearFilters,
  IService,
  IServiceCategory
} from '../../store/slices/serviceSlice';
import ServiceList from './ServiceList';

// Mock data for initial development
const mockCategories: IServiceCategory[] = [
  {
    id: '1',
    name: 'General',
    description: 'General medical services',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Dental',
    description: 'Dental care services',
    createdAt: '2025-01-15T09:15:00Z',
    updatedAt: '2025-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Laboratory',
    description: 'Laboratory and diagnostic services',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }
];

const mockServices: IService[] = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Basic medical consultation with a general practitioner',
    price: 50.00,
    duration: 30,
    categoryId: '1',
    isActive: true,
    createdAt: '2025-01-15T08:45:00Z',
    updatedAt: '2025-01-15T08:45:00Z'
  },
  {
    id: '2',
    name: 'Physical Examination',
    description: 'Comprehensive physical examination',
    price: 100.00,
    duration: 60,
    categoryId: '1',
    isActive: true,
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z'
  },
  {
    id: '3',
    name: 'Dental Cleaning',
    description: 'Professional dental cleaning and checkup',
    price: 75.00,
    duration: 45,
    categoryId: '2',
    isActive: true,
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-01-15T09:30:00Z'
  },
  {
    id: '4',
    name: 'Vaccination',
    description: 'Standard vaccination service',
    price: 25.00,
    duration: 15,
    categoryId: '1',
    isActive: true,
    createdAt: '2025-01-15T10:15:00Z',
    updatedAt: '2025-01-15T10:15:00Z'
  },
  {
    id: '5',
    name: 'X-Ray',
    description: 'X-ray imaging service',
    price: 120.00,
    duration: 30,
    categoryId: '3',
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '6',
    name: 'Blood Test',
    description: 'Complete blood count and analysis',
    price: 80.00,
    duration: 15,
    categoryId: '3',
    isActive: false,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z'
  }
];

const ServiceListContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { services, categories, loading, error, filters } = useAppSelector(state => state.service);
  
  // Load mock data on component mount
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        dispatch(setCategories(mockCategories));
        dispatch(setServices(mockServices));
      } catch (err) {
        dispatch(setError('Failed to load services and categories'));
        console.error(err);
      }
    }, 1000);
  }, [dispatch]);
  
  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };
  
  // Handle filter by category
  const handleFilterCategory = (categoryId: string | null) => {
    dispatch(setFilterCategoryId(categoryId));
  };
  
  // Handle filter by active status
  const handleFilterActive = (isActive: boolean | null) => {
    dispatch(setFilterActive(isActive));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Get filtered services
  const getFilteredServices = () => {
    let filtered = [...services];
    
    // Apply category filter if set
    if (filters.categoryId) {
      filtered = filtered.filter(service => service.categoryId === filters.categoryId);
    }
    
    // Apply active filter if set
    if (filters.active !== null) {
      filtered = filtered.filter(service => service.isActive === filters.active);
    }
    
    // Apply search filter if query exists
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredServices = getFilteredServices();
  
  return (
    <ServiceList
      services={filteredServices}
      categories={categories}
      loading={loading}
      error={error}
      searchQuery={filters.searchQuery}
      filterCategoryId={filters.categoryId}
      filterActive={filters.active}
      onSearch={handleSearch}
      onFilterCategory={handleFilterCategory}
      onFilterActive={handleFilterActive}
      onClearFilters={handleClearFilters}
    />
  );
};

export default ServiceListContainer;
