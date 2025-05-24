import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  CreditCard
} from 'lucide-react';
import { IQuote, IQuoteItem } from '../../store/slices/quoteSlice';
import { IPatient } from '../../store/slices/patientSlice';
import { IService } from '../../store/slices/serviceSlice';

interface QuoteDetailsProps {
  quote: IQuote | null;
  patient: IPatient | null;
  getServiceDetails: (serviceId: string) => IService | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired') => void;
  onCreateBill: () => void;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  quote,
  patient,
  getServiceDetails,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateBill,
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

  if (!quote) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quote not found</h3>
        <p className="text-gray-500 mb-4">
          The quote you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/quotes"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Quotes
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

  // Helper to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case 'sent':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">Sent</span>;
      case 'accepted':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'rejected':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      case 'expired':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">Expired</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Helper to get service name
  const getServiceName = (serviceId: string) => {
    const service = getServiceDetails(serviceId);
    return service ? service.name : 'Unknown Service';
  };

  // Check if quote is in a state where it can be converted to a bill
  const canCreateBill = quote.status === 'accepted';

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/quotes"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Quote Details</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {quote.status === 'draft' && (
            <button
              onClick={() => onStatusChange('sent')}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Send size={18} className="mr-2" />
              Send Quote
            </button>
          )}
          
          {canCreateBill && (
            <button
              onClick={onCreateBill}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <CreditCard size={18} className="mr-2" />
              Create Bill
            </button>
          )}
          
          {quote.status === 'draft' && (
            <button
              onClick={onEdit}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} className="mr-2" />
              Edit
            </button>
          )}
          
          <button
            onClick={onDelete}
            className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Quote info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quote Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-purple-50 p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-purple-800">
              {quote.title}
            </h2>
            {getStatusBadge(quote.status)}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date and Validity */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(quote.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-yellow-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valid Until</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(quote.validUntil).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
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
            
            {/* Quote Items */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Quote Items</h3>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getServiceName(item.serviceId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatPrice(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.discount > 0 ? formatPrice(item.discount) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatPrice(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quote Summary */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(quote.subtotal)}</span>
                </div>
                
                {quote.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-red-600 font-medium">-{formatPrice(quote.discount)}</span>
                  </div>
                )}
                
                {quote.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax:</span>
                    <span className="text-gray-900 font-medium">{formatPrice(quote.tax)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-primary font-bold text-lg">{formatPrice(quote.total)}</span>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {quote.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    {quote.notes}
                  </p>
                </div>
              </div>
            )}
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
              <p className="text-sm text-gray-500 mb-2">Update quote status:</p>
              
              <button
                onClick={() => onStatusChange('draft')}
                disabled={quote.status === 'accepted' || quote.status === 'rejected'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors ${
                  quote.status === 'draft' ? 'bg-gray-50 text-gray-700 font-medium' : 'bg-white text-gray-700'
                } ${(quote.status === 'accepted' || quote.status === 'rejected') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  Draft
                </span>
                {quote.status === 'draft' && <CheckCircle size={18} className="text-gray-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('sent')}
                disabled={quote.status === 'accepted' || quote.status === 'rejected'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-blue-50 transition-colors ${
                  quote.status === 'sent' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-700'
                } ${(quote.status === 'accepted' || quote.status === 'rejected') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <Send size={18} className="mr-2 text-blue-500" />
                  Sent
                </span>
                {quote.status === 'sent' && <CheckCircle size={18} className="text-blue-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('accepted')}
                disabled={quote.status === 'rejected'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-green-50 transition-colors ${
                  quote.status === 'accepted' ? 'bg-green-50 text-green-700 font-medium' : 'bg-white text-gray-700'
                } ${quote.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-500" />
                  Accepted
                </span>
                {quote.status === 'accepted' && <CheckCircle size={18} className="text-green-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('rejected')}
                disabled={quote.status === 'accepted'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-red-50 transition-colors ${
                  quote.status === 'rejected' ? 'bg-red-50 text-red-700 font-medium' : 'bg-white text-gray-700'
                } ${quote.status === 'accepted' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <XCircle size={18} className="mr-2 text-red-500" />
                  Rejected
                </span>
                {quote.status === 'rejected' && <CheckCircle size={18} className="text-red-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('expired')}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-yellow-50 transition-colors ${
                  quote.status === 'expired' ? 'bg-yellow-50 text-yellow-700 font-medium' : 'bg-white text-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <Calendar size={18} className="mr-2 text-yellow-500" />
                  Expired
                </span>
                {quote.status === 'expired' && <CheckCircle size={18} className="text-yellow-500" />}
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
                to={`/appointments/new?patientId=${quote.patientId}`}
                className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">Schedule Appointment</span>
                <Calendar size={18} />
              </Link>
              
              {canCreateBill && (
                <button
                  onClick={onCreateBill}
                  className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium">Create Bill from Quote</span>
                  <CreditCard size={18} />
                </button>
              )}
              
              <Link
                to={`/quotes/new?patientId=${quote.patientId}`}
                className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors"
              >
                <span className="font-medium">Create New Quote for Patient</span>
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
            <p>Created: {new Date(quote.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated: {new Date(quote.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetails;
