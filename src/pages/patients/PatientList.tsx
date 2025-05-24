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
  FileText 
} from 'lucide-react';
import { IPatient } from '../../store/slices/patientSlice';

interface PatientListProps {
  patients: IPatient[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterGender: string | null;
  onSearch: (query: string) => void;
  onFilterGender: (gender: string | null) => void;
  onClearFilters: () => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  loading,
  error,
  searchQuery,
  filterGender,
  onSearch,
  onFilterGender,
  onClearFilters,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link
          to="/patients/new"
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add New Patient
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-primary/50 focus:border-primary"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                  filterGender === null
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => onFilterGender(null)}
              >
                All
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  filterGender === 'male'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => onFilterGender('male')}
              >
                Male
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                  filterGender === 'female'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => onFilterGender('female')}
              >
                Female
              </button>
            </div>
            
            {(searchQuery || filterGender) && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={onClearFilters}
              >
                <X size={16} className="mr-1" />
                Clear Filters
              </button>
            )}
          </div>
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
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Users size={32} className="text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterGender
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first patient'}
          </p>
          {!searchQuery && !filterGender && (
            <Link
              to="/patients/new"
              className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Add New Patient
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.email}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.gender === 'male' 
                          ? 'bg-blue-100 text-blue-800' 
                          : patient.gender === 'female'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/patients/${patient.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          to={`/appointments?patientId=${patient.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="Appointments"
                        >
                          <Calendar size={18} />
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this patient?')) {
                              // Delete action will be implemented later
                              console.log('Delete patient:', patient.id);
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

// Add missing Users icon
const Users = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default PatientList;
