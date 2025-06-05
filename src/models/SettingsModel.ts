export interface IExportJob {
  id: string;
  type: string;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  fileUrl?: string;
}

export interface IAuthLog {
  id: string;
  action: string;
  timestamp: Date;
  userId?: string;
  details?: string;
}

export interface ISettings {
  id: string;
  clinicName: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxNumber?: string;
  defaultTaxPercentage?: number;
  currencySymbol?: string;
  timeZone?: string;
  dateFormat?: string;
  timeFormat?: string;
  appointmentDuration?: number;
  workingHours?: any;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  autoBackup?: boolean;
  backupFrequency?: string;
  pinEnabled?: boolean;
  pinCode?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const SettingsSchema = {};
export const ExportJobSchema = {};
export const AuthLogSchema = {};
