import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IAppointment } from '../../store/slices/appointmentSlice';
import { IPatient } from '../../store/slices/patientSlice';

interface AppointmentFormProps {
  appointment: Partial<IAppointment>;
  patients: IPatient[];
  loading: boolean;
  onSubmit: (appointment: Partial<IAppointment>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  patients,
  loading,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<IAppointment>>(appointment);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prevErrors: Record<string, string>) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  
  // Handle service selection
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setFormData({
      ...formData,
      serviceIds: selectedValues,
    });
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    // Validate time range
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
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
          to="/appointments"
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Appointment' : 'New Appointment'}
        </h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-4 pb-2 border-b">Appointment Information</h2>
          </div>
          
          {/* Patient */}
          <div className="md:col-span-2">
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.patientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>
            )}
          </div>
          
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="e.g., Regular Checkup, Dental Cleaning"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || 'scheduled'}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>
          
          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
            )}
          </div>
          
          {/* End Time */}
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
            )}
          </div>
          
          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Add any additional information about this appointment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Services */}
          <div className="md:col-span-2">
            <label htmlFor="serviceIds" className="block text-sm font-medium text-gray-700 mb-1">
              Services
            </label>
            <select
              id="serviceIds"
              name="serviceIds"
              multiple
              value={formData.serviceIds || []}
              onChange={handleServiceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              size={4}
            >
              <option value="1">General Consultation</option>
              <option value="2">Physical Examination</option>
              <option value="3">Dental Cleaning</option>
              <option value="4">Vaccination</option>
              <option value="5">X-Ray</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple services</p>
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
              <span>{isEditing ? 'Update Appointment' : 'Save Appointment'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
