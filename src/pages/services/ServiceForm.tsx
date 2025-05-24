import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IService, IServiceCategory } from '../../store/slices/serviceSlice';

interface ServiceFormProps {
  service: Partial<IService>;
  categories: IServiceCategory[];
  loading: boolean;
  onSubmit: (service: Partial<IService>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  categories,
  loading,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  // Form state
  const [formData, setFormData] = React.useState<Partial<IService>>(service);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Update form data when service prop changes (for edit mode)
  React.useEffect(() => {
    setFormData(service);
  }, [service]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let parsedValue: string | number | boolean = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue,
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
    if (!formData.name?.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a valid number greater than or equal to 0';
    }
    
    if (formData.duration === undefined || formData.duration <= 0) {
      newErrors.duration = 'Duration must be a valid number greater than 0';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
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
          to="/services"
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-4 pb-2 border-b">Service Information</h2>
          </div>
          
          {/* Service Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="e.g., General Consultation, Dental Cleaning"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Provide a detailed description of the service"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
            )}
            <div className="mt-2">
              <Link
                to="/services/categories"
                className="text-sm text-primary hover:underline"
              >
                Manage categories
              </Link>
            </div>
          </div>
          
          {/* Active Status */}
          <div>
            <div className="flex items-center h-full mt-6">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive ?? true}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active (available for appointments and quotes)
              </label>
            </div>
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price ?? ''}
              onChange={handleChange}
              placeholder="0.00"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          
          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              step="1"
              value={formData.duration ?? ''}
              onChange={handleChange}
              placeholder="30"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
            )}
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
              <span>{isEditing ? 'Update Service' : 'Save Service'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
