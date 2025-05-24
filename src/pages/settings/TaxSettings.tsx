import React, { useState } from 'react';
import { ITaxSettings } from '../../store/slices/settingsSlice';
import { Save, Percent } from 'lucide-react';

interface TaxSettingsProps {
  taxSettings: ITaxSettings;
  loading: boolean;
  onUpdate: (updatedTaxSettings: Partial<ITaxSettings>) => void;
}

const TaxSettings: React.FC<TaxSettingsProps> = ({
  taxSettings,
  loading,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<ITaxSettings>(taxSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Only validate if tax is enabled
    if (formData.enabled) {
      if (formData.rate < 0) {
        newErrors.rate = 'Tax rate cannot be negative';
      }
      
      if (!formData.label.trim()) {
        newErrors.label = 'Tax label is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tax Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enable Tax */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={formData.enabled}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="enabled" className="ml-2 block text-sm font-medium text-gray-700">
            Enable Tax Calculation
          </label>
        </div>
        
        {/* Tax Settings (only shown if enabled) */}
        {formData.enabled && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tax Rate */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Percent size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="rate"
                    name="rate"
                    min="0"
                    step="0.01"
                    value={formData.rate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                      errors.rate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.rate && (
                  <p className="mt-1 text-sm text-red-500">{errors.rate}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Example: For 10% tax, enter 10
                </p>
              </div>
              
              {/* Tax Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g., GST, VAT, Sales Tax"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.label ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.label && (
                  <p className="mt-1 text-sm text-red-500">{errors.label}</p>
                )}
              </div>
            </div>
            
            {/* Apply to All Services */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="applyToAllServices"
                name="applyToAllServices"
                checked={formData.applyToAllServices}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="applyToAllServices" className="ml-2 block text-sm text-gray-700">
                Apply tax to all services by default
              </label>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Tax settings will be applied to all new bills and quotes. Existing documents will not be affected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                Save Tax Settings
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxSettings;
