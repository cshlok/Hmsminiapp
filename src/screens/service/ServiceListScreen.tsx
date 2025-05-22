import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { Text, Divider, FAB, useTheme, ActivityIndicator, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Searchbar
          placeholder="Search services..."
          onChangeText={onSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <Text variant="bodyMedium" style={styles.filterLabel}>Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filterCategoryId === null}
              onPress={() => onFilterCategory(null)}
              style={styles.filterChip}
            >
              All
            </Chip>
            {categories.map(category => (
              <Chip
                key={category.id}
                selected={filterCategoryId === category.id}
                onPress={() => onFilterCategory(category.id)}
                style={styles.filterChip}
              >
                {category.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.sortContainer}>
          <Text variant="bodyMedium" style={styles.sortLabel}>Sort by:</Text>
          <SegmentedButtons
            value={sortBy}
            onValueChange={(value) => handleSortChange(value as 'name' | 'price' | 'duration')}
            buttons={[
              { value: 'name', label: `Name ${sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}` },
              { value: 'price', label: `Price ${sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}` },
              { value: 'duration', label: `Duration ${sortBy === 'duration' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}` },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No services found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery || filterCategoryId
              ? 'Try adjusting your search or filters'
              : 'Add a service to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              categoryName={getCategoryName(item.categoryId)}
              onPress={onServicePress}
              onEdit={onEditService}
              onDelete={onDeleteService}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <View style={styles.fabContainer}>
        <FAB
          icon="plus"
          label="Add Service"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={onAddService}
        />
        <FAB
          icon="tag-plus"
          label="Add Category"
          style={[styles.fab, { backgroundColor: theme.colors.secondary, marginTop: 8 }]}
          onPress={onAddCategory}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    marginRight: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  sortContainer: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  sortLabel: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100, // Space for FABs
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    marginBottom: 8,
  },
});

export default ServiceListScreen;
