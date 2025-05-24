import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveAppointments, loadAppointments } from '../../utils/storage';

export interface IAppointment {
  id: string;
  patientId: string;
  serviceId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentState {
  appointments: IAppointment[];
  selectedAppointment: IAppointment | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchQuery: string;
    patientId: string | null;
    status: string | null;
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}

// Initialize state with data from local storage
const initialState: AppointmentState = {
  appointments: loadAppointments(),
  selectedAppointment: null,
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    patientId: null,
    status: null,
    dateRange: {
      startDate: null,
      endDate: null,
    },
  },
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
      saveAppointments(action.payload); // Persist to storage
    },
    addAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointments.push(action.payload);
      saveAppointments(state.appointments); // Persist to storage
    },
    updateAppointment: (state, action: PayloadAction<IAppointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
        saveAppointments(state.appointments); // Persist to storage
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
      saveAppointments(state.appointments); // Persist to storage
    },
    setSelectedAppointment: (state, action: PayloadAction<IAppointment | null>) => {
      state.selectedAppointment = action.payload;
    },
    // Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setFilterPatientId: (state, action: PayloadAction<string | null>) => {
      state.filters.patientId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
    setFilterDateRange: (state, action: PayloadAction<{startDate: string | null, endDate: string | null}>) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchQuery: '',
        patientId: null,
        status: null,
        dateRange: {
          startDate: null,
          endDate: null,
        },
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setSelectedAppointment,
  setSearchQuery,
  setFilterPatientId,
  setFilterStatus,
  setFilterDateRange,
  clearFilters,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
