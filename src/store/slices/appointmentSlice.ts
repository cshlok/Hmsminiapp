import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppointment } from '../models/AppointmentModel';

interface AppointmentState {
  appointments: IAppointment[];
  selectedAppointment: IAppointment | null;
  loading: boolean;
  error: string | null;
  filterDate: Date | null;
  filterStatus: string | null;
  filterPatientId: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  filterDate: null,
  filterStatus: null,
  filterPatientId: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedAppointment: (state, action: PayloadAction<IAppointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<IAppointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.selectedAppointment?.id === action.payload.id) {
        state.selectedAppointment = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
      if (state.selectedAppointment?.id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    setFilterDate: (state, action: PayloadAction<Date | null>) => {
      state.filterDate = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    setFilterPatientId: (state, action: PayloadAction<string | null>) => {
      state.filterPatientId = action.payload;
    },
    clearFilters: (state) => {
      state.filterDate = null;
      state.filterStatus = null;
      state.filterPatientId = null;
    },
  },
});

export const {
  setAppointments,
  setSelectedAppointment,
  setLoading,
  setError,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setFilterDate,
  setFilterStatus,
  setFilterPatientId,
  clearFilters,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
