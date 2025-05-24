import React, { useState } from 'react';
import { IUserPreferences } from '../../store/slices/settingsSlice';
import { Save, Moon, Sun, Monitor } from 'lucide-react';

interface UserPreferencesSettingsProps {
  userPreferences: IUserPreferences;
  loading: boolean;
  onUpdate: (updatedPreferences: Partial<IUserPreferences>) => void;
}

const UserPreferencesSettings: React.FC<UserPreferencesSettingsProps> = ({
  userPreferences,
  loading,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<IUserPreferences>(userPreferences);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle nested notifications object
      if (name.startsWith('notifications.')) {
        const notificationKey = name.split('.')[1];
        setFormData({
          ...formData,
          notifications: {
            ...formData.notifications,
            [notificationKey]: checked,
          },
        });
      }
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
  
  // Handle theme selection
  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setFormData({
      ...formData,
      theme,
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">User Preferences</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`cursor-pointer p-4 rounded-lg border ${
                formData.theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThemeSelect('light')}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow">
                  <Sun size={24} className="text-yellow-500" />
                </div>
                <span className="font-medium">Light</span>
              </div>
            </div>
            
            <div
              className={`cursor-pointer p-4 rounded-lg border ${
                formData.theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThemeSelect('dark')}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow">
                  <Moon size={24} className="text-gray-100" />
                </div>
                <span className="font-medium">Dark</span>
              </div>
            </div>
            
            <div
              className={`cursor-pointer p-4 rounded-lg border ${
                formData.theme === 'system'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleThemeSelect('system')}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-800 rounded-full flex items-center justify-center mb-3 shadow">
                  <Monitor size={24} className="text-blue-500" />
                </div>
                <span className="font-medium">System</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Language and Format Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Language & Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            {/* Date Format */}
            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                id="dateFormat"
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Example: {formData.dateFormat === 'MM/DD/YYYY' ? '05/23/2025' : formData.dateFormat === 'DD/MM/YYYY' ? '23/05/2025' : '2025-05-23'}
              </p>
            </div>
            
            {/* Time Format */}
            <div>
              <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                Time Format
              </label>
              <select
                id="timeFormat"
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Example: {formData.timeFormat === '12h' ? '3:30 PM' : '15:30'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications.email"
                name="notifications.email"
                checked={formData.notifications.email}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications.email" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications.browser"
                name="notifications.browser"
                checked={formData.notifications.browser}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications.browser" className="ml-2 block text-sm text-gray-700">
                Browser Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications.appointmentReminders"
                name="notifications.appointmentReminders"
                checked={formData.notifications.appointmentReminders}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications.appointmentReminders" className="ml-2 block text-sm text-gray-700">
                Appointment Reminders
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications.billReminders"
                name="notifications.billReminders"
                checked={formData.notifications.billReminders}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications.billReminders" className="ml-2 block text-sm text-gray-700">
                Bill Payment Reminders
              </label>
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
                Save Preferences
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferencesSettings;
