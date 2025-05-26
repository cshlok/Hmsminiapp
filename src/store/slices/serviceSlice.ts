import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveServices, saveCategories, loadServices, loadCategories } from '../../utils/storage';
import { IServiceSlice as IService, ICategory } from '../../utils/modelConverters';
import { IServiceCategory } from '../../models/ServiceModel';

interface ServiceState {
  services: IService[];
  categories: ICategory[];
  selectedService: IService | null;
  selectedCategory: ICategory | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchQuery: string;
    categoryId: string | null;
    active: boolean | null;
  };
  // Add missing properties that are used in ServiceListContainer
  searchQuery: string;
  sortBy: 'name' | 'price' | 'duration';
  sortOrder: 'asc' | 'desc';
  filterCategoryId: string | null;
}

// Initialize state with data from local storage
const initialState: ServiceState = {
  services: loadServices(),
  categories: loadCategories(),
  selectedService: null,
  selectedCategory: null,
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    categoryId: null,
    active: null,
  },
  // Initialize missing properties
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filterCategoryId: null
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Service actions
    setServices: (state, action: PayloadAction<IService[]>) => {
      state.services = action.payload;
      saveServices(action.payload); // Persist to storage
    },
    addService: (state, action: PayloadAction<IService>) => {
      state.services.push(action.payload);
      saveServices(state.services); // Persist to storage
    },
    updateService: (state, action: PayloadAction<IService>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
        saveServices(state.services); // Persist to storage
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(s => s.id !== action.payload);
      saveServices(state.services); // Persist to storage
    },
    setSelectedService: (state, action: PayloadAction<IService | null>) => {
      state.selectedService = action.payload;
    },
    
    // Category actions
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
      saveCategories(action.payload); // Persist to storage
    },
    addCategory: (state, action: PayloadAction<ICategory>) => {
      state.categories.push(action.payload);
      saveCategories(state.categories); // Persist to storage
    },
    updateCategory: (state, action: PayloadAction<ICategory>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
        saveCategories(state.categories); // Persist to storage
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      saveCategories(state.categories); // Persist to storage
    },
    setSelectedCategory: (state, action: PayloadAction<ICategory | null>) => {
      state.selectedCategory = action.payload;
    },
    
    // Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.searchQuery = action.payload; // Update both locations
    },
    setFilterCategoryId: (state, action: PayloadAction<string | null>) => {
      state.filters.categoryId = action.payload;
      state.filterCategoryId = action.payload; // Update both locations
    },
    setFilterActive: (state, action: PayloadAction<boolean | null>) => {
      state.filters.active = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchQuery: '',
        categoryId: null,
        active: null,
      };
      state.searchQuery = '';
      state.filterCategoryId = null;
    },
    // Add missing reducers
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'duration'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setServices,
  addService,
  updateService,
  deleteService,
  setSelectedService,
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setSelectedCategory,
  setSearchQuery,
  setFilterCategoryId,
  setFilterActive,
  clearFilters,
  setSortBy,
  setSortOrder,
} = serviceSlice.actions;

export default serviceSlice.reducer;
