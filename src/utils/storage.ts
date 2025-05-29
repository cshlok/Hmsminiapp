import { IPatient } from '../models/PatientModel'; // Use model definition
import { IAppointment } from '../models/AppointmentModel'; // Use model definition
import { IService, IServiceCategory } from '../models/ServiceModel'; // Use model definitions
import { IQuote } from '../models/QuoteModel'; // Use model definition
import { IBill } from '../models/BillingModel'; // Use model definition
import { 
  IClinicInfo, 
  IUserPreferences, 
  ITaxSettings, 
  IBackupSettings 
} from '../models/SettingsModel'; // Use model definitions

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

// Helper function to parse JSON safely
const safeJsonParse = <T>(data: string | null, defaultValue: T): T => {
  if (!data) return defaultValue;
  try {
    const parsed = JSON.parse(data);
    // Basic type validation could be added here if needed
    return parsed;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
};

// Patient storage
export const savePatients = (patients: IPatient[]): void => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const loadPatients = (): IPatient[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
  // Add date parsing if needed for Date fields in IPatient
  return safeJsonParse<IPatient[]>(data, []);
};

// Appointment storage
export const saveAppointments = (appointments: IAppointment[]): void => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const loadAppointments = (): IAppointment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  const appointments = safeJsonParse<IAppointment[]>(data, []);
  // Parse date strings back to Date objects
  return appointments.map(appt => ({
    ...appt,
    startTime: new Date(appt.startTime),
    endTime: new Date(appt.endTime),
    createdAt: new Date(appt.createdAt),
    updatedAt: new Date(appt.updatedAt),
  }));
};

// Service storage
export const saveServices = (services: IService[]): void => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const loadServices = (): IService[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  const services = safeJsonParse<IService[]>(data, []);
  // Parse date strings back to Date objects
  return services.map(service => ({
    ...service,
    createdAt: new Date(service.createdAt),
    updatedAt: new Date(service.updatedAt),
  }));
};

// Category storage
export const saveCategories = (categories: IServiceCategory[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const loadCategories = (): IServiceCategory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  const categories = safeJsonParse<IServiceCategory[]>(data, []);
  // Parse date strings back to Date objects
  return categories.map(category => ({
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
  }));
};

// Quote storage
export const saveQuotes = (quotes: IQuote[]): void => {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
};

export const loadQuotes = (): IQuote[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUOTES);
  const quotes = safeJsonParse<IQuote[]>(data, []);
  // Parse date strings back to Date objects
  return quotes.map(quote => ({
    ...quote,
    date: new Date(quote.date),
    validUntil: new Date(quote.validUntil),
    createdAt: new Date(quote.createdAt),
    updatedAt: new Date(quote.updatedAt),
    // Parse dates within items if necessary
    items: quote.items.map(item => ({
      ...item,
      // Assuming item might have dates, parse them here
    }))
  }));
};

// Bill storage
export const saveBills = (bills: IBill[]): void => {
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
};

export const loadBills = (): IBill[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BILLS);
  const bills = safeJsonParse<IBill[]>(data, []);
  // Parse date strings back to Date objects
  return bills.map(bill => ({
    ...bill,
    date: new Date(bill.date),
    dueDate: new Date(bill.dueDate),
    createdAt: new Date(bill.createdAt),
    updatedAt: new Date(bill.updatedAt),
    // Parse dates within items if necessary
    items: bill.items.map(item => ({
      ...item,
      // Assuming item might have dates, parse them here
    }))
  }));
};

// Settings storage
export const saveClinicInfo = (clinicInfo: IClinicInfo): void => {
  localStorage.setItem(STORAGE_KEYS.CLINIC_INFO, JSON.stringify(clinicInfo));
};

export const loadClinicInfo = (defaultInfo: IClinicInfo): IClinicInfo => {
  const data = localStorage.getItem(STORAGE_KEYS.CLINIC_INFO);
  return safeJsonParse<IClinicInfo>(data, defaultInfo);
};

export const saveUserPreferences = (preferences: IUserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

export const loadUserPreferences = (defaultPreferences: IUserPreferences): IUserPreferences => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return safeJsonParse<IUserPreferences>(data, defaultPreferences);
};

export const saveTaxSettings = (taxSettings: ITaxSettings): void => {
  localStorage.setItem(STORAGE_KEYS.TAX_SETTINGS, JSON.stringify(taxSettings));
};

export const loadTaxSettings = (defaultSettings: ITaxSettings): ITaxSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.TAX_SETTINGS);
  return safeJsonParse<ITaxSettings>(data, defaultSettings);
};

export const saveBackupSettings = (backupSettings: IBackupSettings): void => {
  localStorage.setItem(STORAGE_KEYS.BACKUP_SETTINGS, JSON.stringify(backupSettings));
};

export const loadBackupSettings = (defaultSettings: IBackupSettings): IBackupSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.BACKUP_SETTINGS);
  return safeJsonParse<IBackupSettings>(data, defaultSettings);
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
    clinicInfo: loadClinicInfo({} as IClinicInfo), // Provide default empty object
    userPreferences: loadUserPreferences({} as IUserPreferences), // Provide default empty object
    taxSettings: loadTaxSettings({} as ITaxSettings), // Provide default empty object
    backupSettings: loadBackupSettings({} as IBackupSettings), // Provide default empty object
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
    
    // Restore all data using the correctly typed load functions
    if (backup.patients) savePatients(backup.patients);
    if (backup.appointments) saveAppointments(backup.appointments.map((appt: any) => ({ ...appt, startTime: new Date(appt.startTime), endTime: new Date(appt.endTime), createdAt: new Date(appt.createdAt), updatedAt: new Date(appt.updatedAt) })));
    if (backup.services) saveServices(backup.services.map((service: any) => ({ ...service, createdAt: new Date(service.createdAt), updatedAt: new Date(service.updatedAt) })));
    if (backup.categories) saveCategories(backup.categories.map((category: any) => ({ ...category, createdAt: new Date(category.createdAt), updatedAt: new Date(category.updatedAt) })));
    if (backup.quotes) saveQuotes(backup.quotes.map((quote: any) => ({ ...quote, date: new Date(quote.date), validUntil: new Date(quote.validUntil), createdAt: new Date(quote.createdAt), updatedAt: new Date(quote.updatedAt) })));
    if (backup.bills) saveBills(backup.bills.map((bill: any) => ({ ...bill, date: new Date(bill.date), dueDate: new Date(bill.dueDate), createdAt: new Date(bill.createdAt), updatedAt: new Date(bill.updatedAt) })));
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
