import React from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress
} from '@mui/material';
import { IService, IServiceCategory } from '../../models/ServiceModel';
import ServiceCard from '../../components/service/ServiceCard';

interface ServiceListScreenProps {
  services: IService[];
  categories: IServiceCategory[];
  loading: boolean;
  searchQuery: string;
  sortBy: 'name' | 'price' | 'duration';
  sortOrder: 'asc' | 'desc';
  filterCategoryId: string | null;
  onSearch: (query: string) => void;
  onSortChange: (sortBy: 'name' | 'price' | 'duration', sortOrder: 'asc' | 'desc') => void;
  onFilterCategory: (categoryId: string | null) => void;
  onServicePress: (service: IService) => void;
  onAddService: () => void;
  onEditService: (service: IService) => void;
  onDeleteService: (serviceId: string) => void;
  onAddCategory: () => void;
}

const ServiceListScreen: React.FC<ServiceListScreenProps> = ({
  services,
  categories,
  loading,
  searchQuery,
  sortBy,
  sortOrder,
  filterCategoryId,
  onServicePress,
  onEditService,
  onDeleteService,
}) => {
  // Get category name for a service
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get filtered and sorted services
  const getFilteredServices = () => {
    // Start with all services
    let filtered = [...services];
    
    // Apply category filter if set
    if (filterCategoryId) {
      filtered = filtered.filter(service => service.categoryId === filterCategoryId);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'duration') {
        comparison = a.duration - b.duration;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };
  
  // Get filtered services
  const filteredServices = getFilteredServices();

  return (
    <Box sx={{ 
      flex: 1, 
      bgcolor: '#f5f5f5', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {loading ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <CircularProgress />
        </Box>
      ) : filteredServices.length === 0 ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          p: 2
        }}>
          <Typography variant="h6">No services found</Typography>
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
            {searchQuery || filterCategoryId
              ? 'Try adjusting your search or filters'
              : 'Add a service to get started'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          pb: 12 // Space for FABs
        }}>
          {filteredServices.map((item) => (
            <ServiceCard
              key={item.id}
              service={item}
              categoryName={getCategoryName(item.categoryId)}
              onPress={onServicePress}
              onEdit={onEditService}
              onDelete={onDeleteService}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServiceListScreen;
