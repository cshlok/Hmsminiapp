import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  FileText, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Clipboard, 
  AlertTriangle, 
  Pill
} from 'lucide-react';
import { IPatient } from '../../store/slices/patientSlice';

interface PatientDetailsProps {
  patient: IPatient | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onNewAppointment: () => void;
  onViewAppointments: () => void;
  onNewQuote: () => void;
  onViewQuotes: () => void;
  onViewBills: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  loading,
  error,
  onEdit,
  onDelete,
  onNewAppointment,
  onViewAppointments,
  onNewQuote,
  onViewQuotes,
  onViewBills,
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

  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Patient not found</h3>
        <p className="text-gray-500 mb-4">
          The patient you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/patients"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Patients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/patients"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Patient Details</h1>
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
      
      {/* Patient info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-primary/10 p-4 border-b">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary text-xl font-medium">
                  {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-sm text-gray-600">
                  Patient ID: {patient.id}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center">
                    {patient.gender === 'male' ? '♂' : patient.gender === 'female' ? '♀' : '⚧'}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900">{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{patient.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{patient.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{patient.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-800">Medical Information</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <Clipboard size={18} className="text-blue-600 mr-2" />
                  <h3 className="text-md font-medium">Medical History</h3>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <AlertTriangle size={18} className="text-amber-600 mr-2" />
                  <h3 className="text-md font-medium">Allergies</h3>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {patient.allergies || 'No allergies recorded'}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Pill size={18} className="text-green-600 mr-2" />
                  <h3 className="text-md font-medium">Medications</h3>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {patient.medications || 'No medications recorded'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Emergency Contact & Actions */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-red-50 p-4 border-b">
              <h2 className="text-lg font-semibold text-red-800">Emergency Contact</h2>
            </div>
            
            <div className="p-4">
              {patient.emergencyContact ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-900 font-medium">{patient.emergencyContact.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{patient.emergencyContact.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="text-gray-900">{patient.emergencyContact.relationship}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No emergency contact information</p>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={onNewAppointment}
                className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <span className="font-medium">New Appointment</span>
                <Calendar size={18} />
              </button>
              
              <button
                onClick={onViewAppointments}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">View Appointments</span>
                <Calendar size={18} />
              </button>
              
              <button
                onClick={onNewQuote}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                <span className="font-medium">New Quote</span>
                <FileText size={18} />
              </button>
              
              <button
                onClick={onViewQuotes}
                className="w-full flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
              >
                <span className="font-medium">View Quotes</span>
                <FileText size={18} />
              </button>
              
              <button
                onClick={onViewBills}
                className="w-full flex items-center justify-between p-3 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100 transition-colors"
              >
                <span className="font-medium">View Bills</span>
                <CreditCard size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Record Information */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <p>Created: {new Date(patient.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated: {new Date(patient.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
