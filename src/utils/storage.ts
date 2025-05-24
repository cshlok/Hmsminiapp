import { IPatient } from '../store/slices/patientSlice';
import { IAppointment } from '../store/slices/appointmentSlice';
import { IServiceSlice as IService, ICategory } from '../utils/modelConverters';
import { IQuote } from '../store/slices/quoteSlice';
import { IBill } from '../store/slices/billingSlice';
import { 
  IClinicInfo, 
  IUserPreferences, 
  ITaxSettings, 
  IBackupSettings 
} from '../store/slices/settingsSlice';

// Storage keys
const STORAGE_KEYS = {
  PATIENTS: 'clinic_patients',
  APPOINTMENTS: 'clinic_appointments',
  SERVICES: 'clinic_services',
  CATEGORIES: 'clinic_categories',
  QUOTES: 'clinic_quotes',
  BILLS: 'clinic_bills',
  CLINIC_INFO: 'clinic_info',
  USER_PREFERENCES: 'clinic_user_preferences',
  TAX_SETTINGS: 'clinic_tax_settings',
  BACKUP_SETTINGS: 'clinic_backup_settings',
};

// Patient storage
export const savePatients = (patients: IPatient[]): void => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const loadPatients = (): IPatient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  return data ? JSON.parse(data) : [];
};

// Appointment storage
export const saveAppointments = (appointments: IAppointment[]): void => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const loadAppointments = (): IAppointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : [];
};

// Service storage
export const saveServices = (services: IService[]): void => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const loadServices = (): IService[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

// Category storage
export const saveCategories = (categories: ICategory[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const loadCategories = (): ICategory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

// Quote storage
export const saveQuotes = (quotes: IQuote[]): void => {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

export const loadQuotes = (): IQuote[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
  return data ? JSON.parse(data) : [];
};

// Bill storage
export const saveBills = (bills: IBill[]): void => {
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
};

export const loadBills = (): IBill[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BILLS);
  return data ? JSON.parse(data) : [];
};

// Settings storage
export const saveClinicInfo = (clinicInfo: IClinicInfo): void => {
  localStorage.setItem(STORAGE_KEYS.CLINIC_INFO, JSON.stringify(clinicInfo));
};

export const loadClinicInfo = (defaultInfo: IClinicInfo): IClinicInfo => {
  const data = localStorage.getItem(STORAGE_KEYS.CLINIC_INFO);
  return data ? JSON.parse(data) : defaultInfo;
};

export const saveUserPreferences = (preferences: IUserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

export const loadUserPreferences = (defaultPreferences: IUserPreferences): IUserPreferences => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return data ? JSON.parse(data) : defaultPreferences;
};

export const saveTaxSettings = (taxSettings: ITaxSettings): void => {
  localStorage.setItem(STORAGE_KEYS.TAX_SETTINGS, JSON.stringify(taxSettings));
};

export const loadTaxSettings = (defaultSettings: ITaxSettings): ITaxSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.TAX_SETTINGS);
  return data ? JSON.parse(data) : defaultSettings;
};

export const saveBackupSettings = (backupSettings: IBackupSettings): void => {
  localStorage.setItem(STORAGE_KEYS.BACKUP_SETTINGS, JSON.stringify(backupSettings));
};

export const loadBackupSettings = (defaultSettings: IBackupSettings): IBackupSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.BACKUP_SETTINGS);
  return data ? JSON.parse(data) : defaultSettings;
};

// Backup and restore
export const createFullBackup = (): string => {
  const backup = {
    patients: loadPatients(),
    appointments: loadAppointments(),
    services: loadServices(),
    categories: loadCategories(),
    quotes: loadQuotes(),
    bills: loadBills(),
    clinicInfo: loadClinicInfo({} as IClinicInfo),
    userPreferences: loadUserPreferences({} as IUserPreferences),
    taxSettings: loadTaxSettings({} as ITaxSettings),
    backupSettings: loadBackupSettings({} as IBackupSettings),
    timestamp: new Date().toISOString(),
  };
  
  return JSON.stringify(backup);
};

export const restoreFromBackup = (backupData: string): boolean => {
  try {
    const backup = JSON.parse(backupData);
    
    // Validate backup data structure
    if (!backup.timestamp) {
      throw new Error('Invalid backup format');
    }
    
    // Restore all data
    if (backup.patients) savePatients(backup.patients);
    if (backup.appointments) saveAppointments(backup.appointments);
    if (backup.services) saveServices(backup.services);
    if (backup.categories) saveCategories(backup.categories);
    if (backup.quotes) saveQuotes(backup.quotes);
    if (backup.bills) saveBills(backup.bills);
    if (backup.clinicInfo) saveClinicInfo(backup.clinicInfo);
    if (backup.userPreferences) saveUserPreferences(backup.userPreferences);
    if (backup.taxSettings) saveTaxSettings(backup.taxSettings);
    if (backup.backupSettings) saveBackupSettings(backup.backupSettings);
    
    return true;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
};

// Clear all data (for testing or reset)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check if storage is available
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
