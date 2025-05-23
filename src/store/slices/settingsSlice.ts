import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISettings, IExportJob, IAuthLog } from '../models/SettingsModel';

interface SettingsState {
  settings: ISettings | null;
  exportJobs: IExportJob[];
  authLogs: IAuthLog[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: SettingsState = {
  settings: null,
  exportJobs: [],
  authLogs: [],
  loading: false,
  error: null,
  isAuthenticated: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<ISettings>) => {
      state.settings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setExportJobs: (state, action: PayloadAction<IExportJob[]>) => {
      state.exportJobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAuthLogs: (state, action: PayloadAction<IAuthLog[]>) => {
      state.authLogs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateSettings: (state, action: PayloadAction<Partial<ISettings>>) => {
      if (state.settings) {
        state.settings = {
          ...state.settings,
          ...action.payload,
          updatedAt: new Date(),
        };
      }
    },
    addExportJob: (state, action: PayloadAction<IExportJob>) => {
      state.exportJobs.unshift(action.payload);
    },
    updateExportJob: (state, action: PayloadAction<Partial<IExportJob> & { id: string }>) => {
      const index = state.exportJobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.exportJobs[index] = {
          ...state.exportJobs[index],
          ...action.payload,
        };
      }
    },
    deleteExportJob: (state, action: PayloadAction<string>) => {
      state.exportJobs = state.exportJobs.filter(job => job.id !== action.payload);
    },
    addAuthLog: (state, action: PayloadAction<IAuthLog>) => {
      state.authLogs.unshift(action.payload);
    },
    clearAuthLogs: (state) => {
      state.authLogs = [];
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setSettings,
  setExportJobs,
  setAuthLogs,
  setLoading,
  setError,
  updateSettings,
  addExportJob,
  updateExportJob,
  deleteExportJob,
  addAuthLog,
  clearAuthLogs,
  setAuthenticated,
} = settingsSlice.actions;

export default settingsSlice.reducer;
