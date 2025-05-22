import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPatient } from '../models/PatientModel';

interface PatientState {
  patients: IPatient[];
  selectedPatient: IPatient | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'lastVisit';
  sortOrder: 'asc' | 'desc';
}

const initialState: PatientState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<IPatient[]>) => {
      state.patients = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPatient: (state, action: PayloadAction<IPatient | null>) => {
      state.selectedPatient = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addPatient: (state, action: PayloadAction<IPatient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<IPatient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
      if (state.selectedPatient?.id === action.payload.id) {
        state.selectedPatient = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
      if (state.selectedPatient?.id === action.payload) {
        state.selectedPatient = null;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'lastVisit'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setPatients,
  setSelectedPatient,
  setLoading,
  setError,
  addPatient,
  updatePatient,
  deletePatient,
  setSearchQuery,
  setSortBy,
  setSortOrder,
} = patientSlice.actions;

export default patientSlice.reducer;
