import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { IAppointment } from '../../store/slices/appointmentSlice';
import { IPatient } from '../../store/slices/patientSlice';

interface AppointmentDetailsProps {
  appointment: IAppointment | null;
  patient: IPatient | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show') => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  patient,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
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

  if (!appointment) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment not found</h3>
        <p className="text-gray-500 mb-4">
          The appointment you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/appointments"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Appointments
        </Link>
      </div>
    );
  }

  // Helper to format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
      case 'confirmed':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'no-show':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">No Show</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/appointments"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Appointment Details</h1>
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
      
      {/* Appointment info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Appointment Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-800">
              {appointment.title}
            </h2>
            {getStatusBadge(appointment.status)}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date and Time */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-gray-900 font-medium">
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Patient Information */}
              <div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    {patient ? (
                      <div>
                        <p className="text-gray-900 font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {patient.id}
                        </p>
                        <Link 
                          to={`/patients/${patient.id}`}
                          className="text-primary text-sm hover:underline mt-1 inline-block"
                        >
                          View Patient Profile
                        </Link>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Patient information not available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  {appointment.notes || 'No notes for this appointment'}
                </p>
              </div>
            </div>
            
            {/* Services */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Services</h3>
              {appointment.serviceIds && appointment.serviceIds.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="list-disc list-inside space-y-1">
                    {appointment.serviceIds.map(serviceId => (
                      <li key={serviceId} className="text-gray-700">
                        Service ID: {serviceId} 
                        <Link 
                          to={`/services/${serviceId}`}
                          className="text-primary text-sm hover:underline ml-2"
                        >
                          View
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-500 italic">No services associated with this appointment</p>
                </div>
              )}
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
            
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-500 mb-2">Update appointment status:</p>
              
              <button
                onClick={() => onStatusChange('scheduled')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-blue-50 transition-colors ${
                  appointment.status === 'scheduled' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <Clock size={18} className="mr-2 text-blue-500" />
                  Scheduled
                </span>
                {appointment.status === 'scheduled' && <CheckCircle size={18} className="text-blue-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('confirmed')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-green-50 transition-colors ${
                  appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-500" />
                  Confirmed
                </span>
                {appointment.status === 'confirmed' && <CheckCircle size={18} className="text-green-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('completed')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors ${
                  appointment.status === 'completed' ? 'bg-gray-100 text-gray-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <CheckCircle size={18} className="mr-2 text-gray-500" />
                  Completed
                </span>
                {appointment.status === 'completed' && <CheckCircle size={18} className="text-gray-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('cancelled')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-red-50 transition-colors ${
                  appointment.status === 'cancelled' ? 'bg-red-50 text-red-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <XCircle size={18} className="mr-2 text-red-500" />
                  Cancelled
                </span>
                {appointment.status === 'cancelled' && <CheckCircle size={18} className="text-red-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('no-show')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-yellow-50 transition-colors ${
                  appointment.status === 'no-show' ? 'bg-yellow-50 text-yellow-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <AlertCircle size={18} className="mr-2 text-yellow-500" />
                  No Show
                </span>
                {appointment.status === 'no-show' && <CheckCircle size={18} className="text-yellow-500" />}
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
                to={`/appointments/new?patientId=${appointment.patientId}`}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">New Appointment for Patient</span>
                <Calendar size={18} />
              </Link>
              
              <Link
                to={`/quotes/new?patientId=${appointment.patientId}`}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                <span className="font-medium">Create Quote for Patient</span>
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
            <p>Created: {new Date(appointment.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated: {new Date(appointment.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
