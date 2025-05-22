import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IService, IServiceCategory } from '../models/ServiceModel';

interface ServiceState {
  services: IService[];
  categories: IServiceCategory[];
  selectedService: IService | null;
  selectedCategory: IServiceCategory | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'price' | 'duration';
  sortOrder: 'asc' | 'desc';
  filterCategoryId: string | null;
}

const initialState: ServiceState = {
  services: [],
  categories: [],
  selectedService: null,
  selectedCategory: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
  filterCategoryId: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<IService[]>) => {
      state.services = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCategories: (state, action: PayloadAction<IServiceCategory[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedService: (state, action: PayloadAction<IService | null>) => {
      state.selectedService = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<IServiceCategory | null>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addService: (state, action: PayloadAction<IService>) => {
      state.services.push(action.payload);
    },
    updateService: (state, action: PayloadAction<IService>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      if (state.selectedService?.id === action.payload.id) {
        state.selectedService = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(s => s.id !== action.payload);
      if (state.selectedService?.id === action.payload) {
        state.selectedService = null;
      }
    },
    addCategory: (state, action: PayloadAction<IServiceCategory>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<IServiceCategory>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (state.selectedCategory?.id === action.payload.id) {
        state.selectedCategory = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      if (state.selectedCategory?.id === action.payload) {
        state.selectedCategory = null;
      }
      // Also remove this category from filter if it's currently selected
      if (state.filterCategoryId === action.payload) {
        state.filterCategoryId = null;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'duration'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setFilterCategoryId: (state, action: PayloadAction<string | null>) => {
      state.filterCategoryId = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.filterCategoryId = null;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setServices,
  setCategories,
  setSelectedService,
  setSelectedCategory,
  setLoading,
  setError,
  addService,
  updateService,
  deleteService,
  addCategory,
  updateCategory,
  deleteCategory,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setFilterCategoryId,
  clearFilters,
} = serviceSlice.actions;

export default serviceSlice.reducer;
