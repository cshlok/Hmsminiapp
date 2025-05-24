import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  saveClinicInfo, 
  saveUserPreferences, 
  saveTaxSettings, 
  saveBackupSettings,
  loadClinicInfo,
  loadUserPreferences,
  loadTaxSettings,
  loadBackupSettings
} from '../../utils/storage';

export interface IClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  taxId?: string;
}

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    browser: boolean;
    appointmentReminders: boolean;
    billReminders: boolean;
  };
}

export interface ITaxSettings {
  enabled: boolean;
  rate: number;
  label: string;
  applyToAllServices: boolean;
}

export interface IBackupSettings {
  autoBackup: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastBackup: string | null;
}

export interface ISettingsState {
  clinicInfo: IClinicInfo;
  userPreferences: IUserPreferences;
  taxSettings: ITaxSettings;
  backupSettings: IBackupSettings;
  loading: boolean;
  error: string | null;
}

const defaultClinicInfo: IClinicInfo = {
  name: 'My Clinic',
  address: '123 Main St, City, State, 12345',
  phone: '(123) 456-7890',
  email: 'contact@myclinic.com',
  website: '',
  logo: '',
  taxId: '',
};

const defaultUserPreferences: IUserPreferences = {
  theme: 'light',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    email: true,
    browser: true,
    appointmentReminders: true,
    billReminders: true,
  },
};

const defaultTaxSettings: ITaxSettings = {
  enabled: false,
  rate: 0,
  label: 'Tax',
  applyToAllServices: false,
};

const defaultBackupSettings: IBackupSettings = {
  autoBackup: false,
  frequency: 'weekly',
  lastBackup: null,
};

// Initialize state with data from local storage
const initialState: ISettingsState = {
  clinicInfo: loadClinicInfo(defaultClinicInfo),
  userPreferences: loadUserPreferences(defaultUserPreferences),
  taxSettings: loadTaxSettings(defaultTaxSettings),
  backupSettings: loadBackupSettings(defaultBackupSettings),
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateClinicInfo: (state, action: PayloadAction<Partial<IClinicInfo>>) => {
      state.clinicInfo = {
        ...state.clinicInfo,
        ...action.payload,
      };
      saveClinicInfo(state.clinicInfo); // Persist to storage
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<IUserPreferences>>) => {
      state.userPreferences = {
        ...state.userPreferences,
        ...action.payload,
      };
      
      // Handle nested notifications object
      if (action.payload.notifications) {
        state.userPreferences.notifications = {
          ...state.userPreferences.notifications,
          ...action.payload.notifications,
        };
      }
      
      saveUserPreferences(state.userPreferences); // Persist to storage
    },
    updateTaxSettings: (state, action: PayloadAction<Partial<ITaxSettings>>) => {
      state.taxSettings = {
        ...state.taxSettings,
        ...action.payload,
      };
      saveTaxSettings(state.taxSettings); // Persist to storage
    },
    updateBackupSettings: (state, action: PayloadAction<Partial<IBackupSettings>>) => {
      state.backupSettings = {
        ...state.backupSettings,
        ...action.payload,
      };
      saveBackupSettings(state.backupSettings); // Persist to storage
    },
    resetSettings: (state) => {
      state.clinicInfo = defaultClinicInfo;
      state.userPreferences = defaultUserPreferences;
      state.taxSettings = defaultTaxSettings;
      state.backupSettings = defaultBackupSettings;
      
      // Persist reset settings to storage
      saveClinicInfo(defaultClinicInfo);
      saveUserPreferences(defaultUserPreferences);
      saveTaxSettings(defaultTaxSettings);
      saveBackupSettings(defaultBackupSettings);
    },
    performBackup: (state) => {
      // In a real app, this would trigger an API call
      const now = new Date().toISOString();
      state.backupSettings.lastBackup = now;
      saveBackupSettings(state.backupSettings); // Persist to storage
    },
  },
});

export const {
  setLoading,
  setError,
  updateClinicInfo,
  updateUserPreferences,
  updateTaxSettings,
  updateBackupSettings,
  resetSettings,
  performBackup,
} = settingsSlice.actions;

export default settingsSlice.reducer;
