import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IService, IServiceCategory } from '../../models/ServiceModel';

interface ServiceState {
  services: IService[];
  categories: IServiceCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  categories: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<IService[]>) => {
      state.services = action.payload;
    },
    setCategories: (state, action: PayloadAction<IServiceCategory[]>) => {
      state.categories = action.payload;
    },
    addService: (state, action: PayloadAction<IService>) => {
      state.services.push(action.payload);
    },
    addCategory: (state, action: PayloadAction<IServiceCategory>) => {
      state.categories.push(action.payload);
    },
    updateService: (state, action: PayloadAction<IService>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    updateCategory: (state, action: PayloadAction<IServiceCategory>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(s => s.id !== action.payload);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setServices,
  setCategories,
  addService,
  addCategory,
  updateService,
  updateCategory,
  deleteService,
  deleteCategory,
  setLoading,
  setError,
} = serviceSlice.actions;

export default serviceSlice.reducer;
