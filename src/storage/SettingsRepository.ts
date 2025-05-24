import Realm from 'realm';
import { SettingsSchema, ExportJobSchema, AuthLogSchema } from '../models/SettingsModel';
import { ISettings, IExportJob, IAuthLog } from '../models/SettingsModel';
import { v4 as uuidv4 } from 'uuid';

// Database configuration
export const settingsDatabaseOptions = {
  schema: [SettingsSchema, ExportJobSchema, AuthLogSchema],
  schemaVersion: 1,
};

// Settings repository for CRUD operations
export class SettingsRepository {
  private realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  // Get settings (there should only be one settings object)
  getSettings(): ISettings | null {
    try {
      const settings = this.realm.objects<ISettings>('Settings');
      return settings.length > 0 ? settings[0] : null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw error;
    }
  }

  // Initialize settings with default values if not exists
  initializeSettings(): ISettings {
    try {
      let settings = this.getSettings();
      
      if (!settings) {
        this.realm.write(() => {
          settings = this.realm.create('Settings', {
            id: uuidv4(),
            clinicName: 'My Clinic',
            clinicLogo: null,
            clinicAddress: '',
            clinicPhone: '',
            clinicEmail: '',
            clinicWebsite: '',
            taxPercentage: 0,
            defaultDiscountType: 'none',
            defaultDiscountValue: 0,
            defaultDueDays: 30,
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            theme: 'light',
            language: 'en',
            pinEnabled: false,
            pinCode: null,
            biometricEnabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }
      
      return settings as ISettings;
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      throw error;
    }
  }

  // Update settings
  updateSettings(updatedSettings: Partial<ISettings>): ISettings | null {
    try {
      let settings = this.getSettings();
      
      if (settings) {
        this.realm.write(() => {
          // Update settings properties
          Object.keys(updatedSettings).forEach(key => {
            if (key !== 'id' && key !== 'createdAt') {
              // Type-safe property access
              const typedKey = key as keyof ISettings;
              if (updatedSettings[typedKey] !== undefined) {
                (settings as any)[key] = updatedSettings[typedKey];
              }
            }
          });
          
          settings.updatedAt = new Date();
        });
        
        return settings;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  // Create export job
  createExportJob(type: 'patients' | 'appointments' | 'services' | 'quotes' | 'bills' | 'all', startDate?: Date, endDate?: Date): IExportJob {
    try {
      let exportJob: IExportJob;
      
      this.realm.write(() => {
        exportJob = this.realm.create('ExportJob', {
          id: uuidv4(),
          type,
          status: 'pending',
          startDate: startDate || null,
          endDate: endDate || null,
          filePath: null,
          error: null,
          createdAt: new Date(),
          completedAt: null,
        }) as unknown as IExportJob;
      });
      
      return exportJob;
    } catch (error) {
      console.error('Failed to create export job:', error);
      throw error;
    }
  }

  // Get all export jobs
  getAllExportJobs() {
    try {
      return this.realm.objects<IExportJob>('ExportJob').sorted('createdAt', true);
    } catch (error) {
      console.error('Failed to get export jobs:', error);
      throw error;
    }
  }

  // Get export job by ID
  getExportJobById(id: string): IExportJob | null {
    try {
      return this.realm.objectForPrimaryKey<IExportJob>('ExportJob', id) || null;
    } catch (error) {
      console.error('Failed to get export job by ID:', error);
      throw error;
    }
  }

  // Update export job status
  updateExportJobStatus(id: string, status: 'pending' | 'processing' | 'completed' | 'failed', filePath?: string, error?: string): IExportJob | null {
    try {
      const exportJob = this.getExportJobById(id);
      
      if (exportJob) {
        this.realm.write(() => {
          exportJob.status = status;
          
          if (filePath) {
            exportJob.filePath = filePath;
          }
          
          if (error) {
            exportJob.error = error;
          }
          
          if (status === 'completed' || status === 'failed') {
            exportJob.completedAt = new Date();
          }
        });
        
        return exportJob;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to update export job status:', error);
      throw error;
    }
  }

  // Delete export job
  deleteExportJob(id: string): boolean {
    try {
      const exportJob = this.getExportJobById(id);
      
      if (exportJob) {
        this.realm.write(() => {
          this.realm.delete(exportJob);
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to delete export job:', error);
      throw error;
    }
  }

  // Log authentication attempt
  logAuthAttempt(action: 'login' | 'logout' | 'failed_login', method: 'pin' | 'biometric', success: boolean, errorMessage?: string): IAuthLog {
    try {
      let authLog: IAuthLog;
      
      this.realm.write(() => {
        authLog = this.realm.create('AuthLog', {
          id: uuidv4(),
          action,
          method,
          timestamp: new Date(),
          success,
          errorMessage: errorMessage || null,
        }) as unknown as IAuthLog;
      });
      
      return authLog;
    } catch (error) {
      console.error('Failed to log auth attempt:', error);
      throw error;
    }
  }

  // Get all auth logs
  getAllAuthLogs() {
    try {
      return this.realm.objects<IAuthLog>('AuthLog').sorted('timestamp', true);
    } catch (error) {
      console.error('Failed to get auth logs:', error);
      throw error;
    }
  }

  // Clear auth logs
  clearAuthLogs(): boolean {
    try {
      const authLogs = this.realm.objects('AuthLog');
      
      this.realm.write(() => {
        this.realm.delete(authLogs);
      });
      
      return true;
    } catch (error) {
      console.error('Failed to clear auth logs:', error);
      throw error;
    }
  }

  // Verify PIN
  verifyPin(pin: string): boolean {
    try {
      const settings = this.getSettings();
      
      if (settings && settings.pinEnabled && settings.pinCode) {
        return settings.pinCode === pin;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to verify PIN:', error);
      throw error;
    }
  }

  // Update PIN
  updatePin(pin: string): boolean {
    try {
      const settings = this.getSettings();
      
      if (settings) {
        this.realm.write(() => {
          settings.pinCode = pin;
          settings.pinEnabled = true;
          settings.updatedAt = new Date();
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update PIN:', error);
      throw error;
    }
  }

  // Disable PIN
  disablePin(): boolean {
    try {
      const settings = this.getSettings();
      
      if (settings) {
        this.realm.write(() => {
          settings.pinEnabled = false;
          settings.updatedAt = new Date();
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to disable PIN:', error);
      throw error;
    }
  }

  // Toggle biometric authentication
  toggleBiometric(enabled: boolean): boolean {
    try {
      const settings = this.getSettings();
      
      if (settings) {
        this.realm.write(() => {
          settings.biometricEnabled = enabled;
          settings.updatedAt = new Date();
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to toggle biometric:', error);
      throw error;
    }
  }
}
