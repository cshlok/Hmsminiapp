import React, { useState } from 'react';
import { IClinicInfo } from '../../store/slices/settingsSlice';
import { Save, Upload } from 'lucide-react';

interface ClinicInfoSettingsProps {
  clinicInfo: IClinicInfo;
  loading: boolean;
  onUpdate: (updatedInfo: Partial<IClinicInfo>) => void;
}

const ClinicInfoSettings: React.FC<ClinicInfoSettingsProps> = ({
  clinicInfo,
  loading,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<IClinicInfo>(clinicInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
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
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Clinic name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Website validation (optional field)
    if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Website URL is invalid';
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
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll just use a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Clinic Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden mb-4 flex items-center justify-center">
            {formData.logo ? (
              <img src={formData.logo} alt="Clinic Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center p-4">
                <Upload size={24} className="mx-auto mb-2" />
                <span className="text-sm">No logo</span>
              </div>
            )}
          </div>
          
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {formData.logo ? 'Change Logo' : 'Upload Logo'}
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinic Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Clinic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-500">{errors.website}</p>
            )}
          </div>
          
          {/* Tax ID */}
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / Business Number
            </label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
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
                Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicInfoSettings;
