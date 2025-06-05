// Storage utility functions
export const saveAppointments = async (appointments: any[]) => {
  localStorage.setItem('appointments', JSON.stringify(appointments));
};

export const loadAppointments = async () => {
  const data = localStorage.getItem('appointments');
  return data ? JSON.parse(data) : [];
};

export const saveBills = async (bills: any[]) => {
  localStorage.setItem('bills', JSON.stringify(bills));
};

export const loadBills = async () => {
  const data = localStorage.getItem('bills');
  return data ? JSON.parse(data) : [];
};

export const savePatients = async (patients: any[]) => {
  localStorage.setItem('patients', JSON.stringify(patients));
};

export const loadPatients = async () => {
  const data = localStorage.getItem('patients');
  return data ? JSON.parse(data) : [];
};

export const saveQuotes = async (quotes: any[]) => {
  localStorage.setItem('quotes', JSON.stringify(quotes));
};

export const loadQuotes = async () => {
  const data = localStorage.getItem('quotes');
  return data ? JSON.parse(data) : [];
};

export const saveServices = async (services: any[]) => {
  localStorage.setItem('services', JSON.stringify(services));
};

export const loadServices = async () => {
  const data = localStorage.getItem('services');
  return data ? JSON.parse(data) : [];
};

export const saveCategories = async (categories: any[]) => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

export const loadCategories = async () => {
  const data = localStorage.getItem('categories');
  return data ? JSON.parse(data) : [];
};

export const saveClinicInfo = async (info: any) => {
  localStorage.setItem('clinicInfo', JSON.stringify(info));
};

export const loadClinicInfo = async () => {
  const data = localStorage.getItem('clinicInfo');
  return data ? JSON.parse(data) : {};
};

export const saveUserPreferences = async (preferences: any) => {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
};

export const loadUserPreferences = async () => {
  const data = localStorage.getItem('userPreferences');
  return data ? JSON.parse(data) : {};
};

export const saveTaxSettings = async (settings: any) => {
  localStorage.setItem('taxSettings', JSON.stringify(settings));
};

export const loadTaxSettings = async () => {
  const data = localStorage.getItem('taxSettings');
  return data ? JSON.parse(data) : {};
};

export const saveBackupSettings = async (settings: any) => {
  localStorage.setItem('backupSettings', JSON.stringify(settings));
};

export const loadBackupSettings = async () => {
  const data = localStorage.getItem('backupSettings');
  return data ? JSON.parse(data) : {};
};
