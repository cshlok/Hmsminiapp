import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPatient } from '../../models/PatientModel';

interface PatientState {
  patients: IPatient[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<IPatient[]>) => {
      state.patients = action.payload;
    },
    addPatient: (state, action: PayloadAction<IPatient>) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action: PayloadAction<IPatient>) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
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
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setLoading,
  setError,
} = patientSlice.actions;

export default patientSlice.reducer;
