import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { IService, IServiceCategory } from '../../store/slices/serviceSlice';

interface ServiceDetailsProps {
  service: IService | null;
  category: IServiceCategory | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  category,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Service not found</h3>
        <p className="text-gray-500 mb-4">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Services
        </Link>
      </div>
    );
  }

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Helper to format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` 
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/services"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Service Details</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit size={18} className="mr-2" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Service info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Service Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary">
              {service.name}
            </h2>
            {service.isActive ? (
              <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                Inactive
              </span>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price and Duration */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-green-500">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-gray-900 font-medium">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-gray-900 font-medium">
                      {formatDuration(service.duration)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Category Information */}
              <div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-indigo-500">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    {category ? (
                      <div>
                        <p className="text-gray-900 font-medium">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-sm text-gray-500">
                            {category.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Category information not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  {service.description || 'No description provided for this service'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions and Status */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">Status Management</h2>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                {service.isActive 
                  ? 'This service is currently active and available for appointments and quotes.' 
                  : 'This service is currently inactive and not available for new appointments or quotes.'}
              </p>
              
              <button
                onClick={onToggleStatus}
                className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                  service.isActive 
                    ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {service.isActive ? (
                  <>
                    <XCircle size={18} className="mr-2" />
                    Mark as Inactive
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Mark as Active
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="p-4 space-y-3">
              <Link
                to={`/appointments/new?serviceId=${service.id}`}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">Schedule Appointment with this Service</span>
                <Clock size={18} />
              </Link>
              
              <Link
                to={`/quotes/new?serviceId=${service.id}`}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                <span className="font-medium">Create Quote with this Service</span>
                <FileText size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Record Information */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <p>Created: {new Date(service.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated: {new Date(service.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
