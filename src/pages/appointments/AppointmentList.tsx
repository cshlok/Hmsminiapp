import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  X, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { IAppointment } from '../../store/slices/appointmentSlice';
import { IPatient } from '../../store/slices/patientSlice';

interface AppointmentListProps {
  appointments: IAppointment[];
  patients: IPatient[];
  loading: boolean;
  error: string | null;
  filterDate: string | null;
  filterPatientId: string | null;
  filterStatus: string | null;
  onFilterDate: (date: string | null) => void;
  onFilterPatient: (patientId: string | null) => void;
  onFilterStatus: (status: string | null) => void;
  onClearFilters: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  patients,
  loading,
  error,
  filterDate,
  filterPatientId,
  filterStatus,
  onFilterDate,
  onFilterPatient,
  onFilterStatus,
  onClearFilters,
}) => {
  // Helper to get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
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
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Scheduled</span>;
      case 'confirmed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>;
      case 'no-show':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">No Show</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  // Helper to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock size={16} className="text-blue-500" />;
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-gray-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'no-show':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/appointments/calendar"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Calendar size={18} className="mr-2" />
            Calendar View
          </Link>
          <Link
            to="/appointments/new"
            className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Appointment
          </Link>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Filter */}
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={filterDate || ''}
              onChange={(e) => onFilterDate(e.target.value || null)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          
          {/* Patient Filter */}
          <div>
            <label htmlFor="patientFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              id="patientFilter"
              value={filterPatientId || ''}
              onChange={(e) => onFilterPatient(e.target.value || null)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus || ''}
              onChange={(e) => onFilterStatus(e.target.value || null)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          
          {/* Clear Filters */}
          {(filterDate || filterPatientId || filterStatus) && (
            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={onClearFilters}
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Calendar size={32} className="text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-4">
            {filterDate || filterPatientId || filterStatus
              ? 'Try adjusting your filters'
              : 'Get started by scheduling your first appointment'}
          </p>
          {!filterDate && !filterPatientId && !filterStatus && (
            <Link
              to="/appointments/new"
              className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              New Appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar size={18} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPatientName(appointment.patientId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {appointment.patientId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.title}</div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {appointment.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1.5">
                          {getStatusBadge(appointment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/appointments/${appointment.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this appointment?')) {
                              // Delete action will be implemented later
                              console.log('Delete appointment:', appointment.id);
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
