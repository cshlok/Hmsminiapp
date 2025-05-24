import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { savePatients, loadPatients } from '../../utils/storage';

export interface IPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchQuery: string;
    gender: string | null;
  };
}

// Initialize state with data from local storage
const initialState: PatientState = {
  patients: loadPatients(),
  selectedPatient: null,
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    gender: null,
  },
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPatients: (state, action: PayloadAction<IPatient[]>) => {
      state.patients = action.payload;
      savePatients(action.payload); // Persist to storage
    },
    addPatient: (state, action: PayloadAction<IPatient>) => {
      state.patients.push(action.payload);
      savePatients(state.patients); // Persist to storage
    },
    updatePatient: (state, action: PayloadAction<IPatient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
        savePatients(state.patients); // Persist to storage
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
      savePatients(state.patients); // Persist to storage
    },
    setSelectedPatient: (state, action: PayloadAction<IPatient | null>) => {
      state.selectedPatient = action.payload;
    },
    // Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setFilterGender: (state, action: PayloadAction<string | null>) => {
      state.filters.gender = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchQuery: '',
        gender: null,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setSelectedPatient,
  setSearchQuery,
  setFilterGender,
  clearFilters,
} = patientSlice.actions;

export default patientSlice.reducer;
