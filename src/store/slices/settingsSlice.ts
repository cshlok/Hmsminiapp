import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface IUserPreferences {
  theme: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  notifications: boolean;
}

interface ITaxSettings {
  enabled: boolean;
  rate: number;
  label: string;
  applyToAllServices: boolean;
}

interface IBackupSettings {
  autoBackup: boolean;
  frequency: string;
  lastBackup: Date | null;
}

interface ISettingsState {
  clinicInfo: IClinicInfo;
  userPreferences: IUserPreferences;
  taxSettings: ITaxSettings;
  backupSettings: IBackupSettings;
  loading: boolean;
  error: string | null;
}

const defaultClinicInfo: IClinicInfo = {
  name: '',
  address: '',
  phone: '',
  email: '',
};

const defaultUserPreferences: IUserPreferences = {
  theme: 'light',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: true,
};

const defaultTaxSettings: ITaxSettings = {
  enabled: false,
  rate: 0,
  label: 'Tax',
  applyToAllServices: true,
};

const defaultBackupSettings: IBackupSettings = {
  autoBackup: false,
  frequency: 'daily',
  lastBackup: null,
};

const initialState: ISettingsState = {
  clinicInfo: defaultClinicInfo,
  userPreferences: defaultUserPreferences,
  taxSettings: defaultTaxSettings,
  backupSettings: defaultBackupSettings,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setClinicInfo: (state, action: PayloadAction<IClinicInfo>) => {
      state.clinicInfo = action.payload;
    },
    setUserPreferences: (state, action: PayloadAction<IUserPreferences>) => {
      state.userPreferences = action.payload;
    },
    setTaxSettings: (state, action: PayloadAction<ITaxSettings>) => {
      state.taxSettings = action.payload;
    },
    setBackupSettings: (state, action: PayloadAction<IBackupSettings>) => {
      state.backupSettings = action.payload;
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
  setClinicInfo,
  setUserPreferences,
  setTaxSettings,
  setBackupSettings,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
