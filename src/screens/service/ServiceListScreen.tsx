import React from 'react';
import { 
  Box, 
  TextField, 
  Divider, 
  Fab, 
  CircularProgress, 
  Chip, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  List,
  Paper,
  Stack
} from '@mui/material';
import { Add as AddIcon, LocalOffer as TagIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ServiceCard from '../../components/service/ServiceCard';
import { IService, IServiceCategory } from '../../models/ServiceModel';

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
  onSearch,
  onSortChange,
  onFilterCategory,
  onServicePress,
  onAddService,
  onEditService,
  onDeleteService,
  onAddCategory,
}) => {
  const theme = useTheme();
  
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
  
  // Handle sort change
  const handleSortChange = (newSortBy: 'name' | 'price' | 'duration') => {
    // If clicking the same sort option, toggle the order
    if (newSortBy === sortBy) {
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a different sort option, use that with ascending order
      onSortChange(newSortBy, 'asc');
    }
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
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search services..."
          onChange={(e) => onSearch(e.target.value)}
          value={searchQuery}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: 2,
          overflowX: 'auto'
        }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Category:</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
            <Chip
              label="All"
              color={filterCategoryId === null ? "primary" : "default"}
              onClick={() => onFilterCategory(null)}
              sx={{ mr: 0.5 }}
            />
            {categories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                color={filterCategoryId === category.id ? "primary" : "default"}
                onClick={() => onFilterCategory(category.id)}
                sx={{ mr: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
        
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Sort by:</Typography>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                handleSortChange(value as 'name' | 'price' | 'duration');
              }
            }}
            size="small"
            sx={{ width: '100%' }}
          >
            <ToggleButton value="name" sx={{ flex: 1 }}>
              Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </ToggleButton>
            <ToggleButton value="price" sx={{ flex: 1 }}>
              Price {sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </ToggleButton>
            <ToggleButton value="duration" sx={{ flex: 1 }}>
              Duration {sortBy === 'duration' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      
      <Divider />
      
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
        <List sx={{ 
          flex: 1, 
          overflow: 'auto',
          pb: 12 // Space for FABs
        }}>
          {filteredServices.map((item) => (
            <Paper key={item.id} sx={{ m: 1 }}>
              <ServiceCard
                service={item}
                categoryName={getCategoryName(item.categoryId)}
                onPress={onServicePress}
                onEdit={onEditService}
                onDelete={onDeleteService}
              />
            </Paper>
          ))}
        </List>
      )}
      
      <Box sx={{ 
        position: 'fixed', 
        right: 16, 
        bottom: 16,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Fab
          color="primary"
          variant="extended"
          onClick={onAddService}
          sx={{ mb: 1 }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Service
        </Fab>
        <Fab
          color="secondary"
          variant="extended"
          onClick={onAddCategory}
        >
          <TagIcon sx={{ mr: 1 }} />
          Add Category
        </Fab>
      </Box>
    </Box>
  );
};

export default ServiceListScreen;
