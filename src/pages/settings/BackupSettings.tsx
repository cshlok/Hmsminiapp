import React, { useState } from 'react';
import { IBackupSettings } from '../../store/slices/settingsSlice';
import { Save, Database, Download, RefreshCw } from 'lucide-react';

interface BackupSettingsProps {
  backupSettings: IBackupSettings;
  loading: boolean;
  onUpdate: (updatedBackupSettings: Partial<IBackupSettings>) => void;
  onManualBackup: () => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({
  backupSettings,
  loading,
  onUpdate,
  onManualBackup,
}) => {
  const [formData, setFormData] = useState<IBackupSettings>(backupSettings);
  const [backupInProgress, setBackupInProgress] = useState(false);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };
  
  // Handle manual backup
  const handleManualBackup = () => {
    setBackupInProgress(true);
    
    // Simulate backup process
    setTimeout(() => {
      onManualBackup();
      setBackupInProgress(false);
    }, 2000);
  };
  
  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Backup & Restore</h2>
      
      {/* Manual Backup */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Database size={24} className="text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Manual Backup</h3>
            <p className="text-gray-500 mt-1 mb-4">
              Create a backup of all your clinic data. This includes patients, appointments, services, quotes, and billing information.
            </p>
            
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleManualBackup}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={backupInProgress}
              >
                {backupInProgress ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Backing up...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download size={18} className="mr-2" />
                    Create Backup
                  </span>
                )}
              </button>
              
              <div className="ml-4 text-sm text-gray-500">
                Last backup: <span className="font-medium">{formatDate(formData.lastBackup)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Automatic Backup Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Automatic Backup Settings</h3>
          
          <div className="space-y-4">
            {/* Enable Auto Backup */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                name="autoBackup"
                checked={formData.autoBackup}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="autoBackup" className="ml-2 block text-sm font-medium text-gray-700">
                Enable Automatic Backups
              </label>
            </div>
            
            {/* Backup Frequency (only shown if auto backup is enabled) */}
            {formData.autoBackup && (
              <div className="ml-6 mt-3">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Automatic backups are stored locally in your browser. For critical data, we recommend also performing regular manual backups and storing them securely.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Import/Export */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Data Import & Export</h3>
          
          <div className="space-y-4">
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Download size={18} className="mr-2" />
                Export All Data
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Download all your clinic data as a JSON file
              </p>
            </div>
            
            <div>
              <label
                htmlFor="import-data"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                <RefreshCw size={18} className="mr-2" />
                Import Data
              </label>
              <input
                id="import-data"
                type="file"
                accept=".json"
                className="hidden"
              />
              <p className="mt-1 text-sm text-gray-500">
                Import data from a previously exported file
              </p>
            </div>
          </div>
          
          <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Importing data will overwrite your current data. Make sure to back up your current data before importing.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Save Backup Settings
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackupSettings;
