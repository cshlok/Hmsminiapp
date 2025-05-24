import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IPatient } from '../../store/slices/patientSlice';

interface PatientFormProps {
  patient: Partial<IPatient>;
  loading: boolean;
  onSubmit: (patient: Partial<IPatient>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  loading,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<IPatient>>(patient);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested emergency contact fields
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...formData.emergencyContact,
          [field]: value,
        },
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
    
    // Required fields
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link
          to="/patients"
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-4 pb-2 border-b">Personal Information</h2>
          </div>
          
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
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
              value={formData.email || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
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
              value={formData.phone || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>
          
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender || 'male'}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
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
              value={formData.address || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>
          
          {/* Medical Information Section */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-medium mb-4 pb-2 border-b">Medical Information</h2>
          </div>
          
          {/* Medical History */}
          <div className="md:col-span-2">
            <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">
              Medical History
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows={3}
              value={formData.medicalHistory || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Allergies */}
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </label>
            <textarea
              id="allergies"
              name="allergies"
              rows={2}
              value={formData.allergies || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Medications */}
          <div>
            <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
              Medications
            </label>
            <textarea
              id="medications"
              name="medications"
              rows={2}
              value={formData.medications || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Emergency Contact Section */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-medium mb-4 pb-2 border-b">Emergency Contact</h2>
          </div>
          
          {/* Emergency Contact Name */}
          <div>
            <label htmlFor="emergency.name" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="emergency.name"
              name="emergency.name"
              value={formData.emergencyContact?.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Emergency Contact Phone */}
          <div>
            <label htmlFor="emergency.phone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="emergency.phone"
              name="emergency.phone"
              value={formData.emergencyContact?.phone || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Emergency Contact Relationship */}
          <div className="md:col-span-2">
            <label htmlFor="emergency.relationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <input
              type="text"
              id="emergency.relationship"
              name="emergency.relationship"
              value={formData.emergencyContact?.relationship || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={loading}
          >
            Cancel
          </button>
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
                {isEditing ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Patient' : 'Save Patient'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
