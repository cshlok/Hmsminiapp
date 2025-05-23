# Settings and Data Export Module - Data Models

import Realm from 'realm';

// Settings schema
export interface ISettings {
  id: string;
  clinicName: string;
  clinicLogo?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  clinicWebsite?: string;
  taxPercentage: number;
  defaultDiscountType: 'percentage' | 'fixed' | 'none';
  defaultDiscountValue: number;
  defaultDueDays: number;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  pinEnabled: boolean;
  pinCode?: string;
  biometricEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Settings schema for Realm
export const SettingsSchema = {
  name: 'Settings',
  primaryKey: 'id',
  properties: {
    id: 'string',
    clinicName: 'string',
    clinicLogo: 'string?',
    clinicAddress: 'string?',
    clinicPhone: 'string?',
    clinicEmail: 'string?',
    clinicWebsite: 'string?',
    taxPercentage: 'double',
    defaultDiscountType: 'string',
    defaultDiscountValue: 'double',
    defaultDueDays: 'int',
    currency: 'string',
    dateFormat: 'string',
    timeFormat: 'string',
    theme: 'string',
    language: 'string',
    pinEnabled: 'bool',
    pinCode: 'string?',
    biometricEnabled: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Export job schema
export interface IExportJob {
  id: string;
  type: 'patients' | 'appointments' | 'services' | 'quotes' | 'bills' | 'all';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startDate?: Date;
  endDate?: Date;
  filePath?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Export job schema for Realm
export const ExportJobSchema = {
  name: 'ExportJob',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    status: 'string',
    startDate: 'date?',
    endDate: 'date?',
    filePath: 'string?',
    error: 'string?',
    createdAt: 'date',
    completedAt: 'date?',
  },
};

// Authentication log schema
export interface IAuthLog {
  id: string;
  action: 'login' | 'logout' | 'failed_login';
  method: 'pin' | 'biometric';
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

// Authentication log schema for Realm
export const AuthLogSchema = {
  name: 'AuthLog',
  primaryKey: 'id',
  properties: {
    id: 'string',
    action: 'string',
    method: 'string',
    timestamp: 'date',
    success: 'bool',
    errorMessage: 'string?',
  },
};
