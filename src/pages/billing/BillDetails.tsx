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
  CreditCard,
  AlertTriangle,
  Printer,
  FileText as FileIcon,
  Plus
} from 'lucide-react';
import { IBill, IBillItem, IPayment } from '../../store/slices/billingSlice';
import { IPatient } from '../../store/slices/patientSlice';
import { IService } from '../../store/slices/serviceSlice';
import { IQuote } from '../../store/slices/quoteSlice';

interface BillDetailsProps {
  bill: IBill | null;
  patient: IPatient | null;
  quote: IQuote | null;
  getServiceDetails: (serviceId: string) => IService | null;
  loading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled') => void;
  onAddPayment: () => void;
  onPrintBill: () => void;
}

const BillDetails: React.FC<BillDetailsProps> = ({
  bill,
  patient,
  quote,
  getServiceDetails,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
  onAddPayment,
  onPrintBill,
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

  if (!bill) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bill not found</h3>
        <p className="text-gray-500 mb-4">
          The bill you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/billing"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Billing
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
      case 'pending':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">Pending</span>;
      case 'paid':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'partially_paid':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">Partially Paid</span>;
      case 'overdue':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
      case 'cancelled':
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // Helper to get service name
  const getServiceName = (serviceId: string) => {
    const service = getServiceDetails(serviceId);
    return service ? service.name : 'Unknown Service';
  };

  // Helper to get payment method display name
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'insurance':
        return 'Insurance';
      case 'other':
        return 'Other';
      default:
        return method;
    }
  };

  // Check if bill is overdue
  const isOverdue = () => {
    if (bill.status === 'paid' || bill.status === 'cancelled') return false;
    
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    return dueDate < today && bill.amountDue > 0;
  };

  // Check if bill can be edited
  const canEdit = bill.status === 'draft' || bill.status === 'pending';

  // Check if bill can be deleted
  const canDelete = bill.status === 'draft';

  // Check if payment can be added
  const canAddPayment = bill.status !== 'paid' && bill.status !== 'cancelled';

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link
            to="/billing"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Bill Details</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {canAddPayment && (
            <button
              onClick={onAddPayment}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <DollarSign size={18} className="mr-2" />
              Add Payment
            </button>
          )}
          
          <button
            onClick={onPrintBill}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Printer size={18} className="mr-2" />
            Print Bill
          </button>
          
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} className="mr-2" />
              Edit
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>
      
      {/* Bill info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bill Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-800">
              {bill.billNumber}
            </h2>
            <div className="flex items-center">
              {isOverdue() && bill.status !== 'overdue' && (
                <span className="px-3 py-1 mr-2 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                  <AlertTriangle size={16} className="mr-1" />
                  Overdue
                </span>
              )}
              {getStatusBadge(bill.status)}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date and Due Date */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 text-blue-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(bill.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-10 ${isOverdue() ? 'text-red-500' : 'text-yellow-500'}`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(bill.dueDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                      {isOverdue() && bill.status !== 'overdue' && (
                        <span className="ml-2 text-sm text-red-600 font-medium">
                          (Overdue)
                        </span>
                      )}
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
            
            {/* Quote Reference */}
            {quote && (
              <div className="mt-6 p-4 bg-purple-50 rounded-md">
                <div className="flex items-center">
                  <FileIcon size={20} className="text-purple-600 mr-2" />
                  <h3 className="text-md font-medium text-purple-800">Generated from Quote</h3>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Quote Title:</span> {quote.title}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Quote Status:</span> {quote.status}
                    </p>
                  </div>
                  <Link
                    to={`/quotes/${quote.id}`}
                    className="text-purple-700 text-sm hover:underline"
                  >
                    View Quote
                  </Link>
                </div>
              </div>
            )}
            
            {/* Bill Items */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Bill Items</h3>
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
                    {bill.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.description || getServiceName(item.serviceId)}
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
            
            {/* Bill Summary */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(bill.subtotal)}</span>
                </div>
                
                {bill.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-red-600 font-medium">-{formatPrice(bill.discount)}</span>
                  </div>
                )}
                
                {bill.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax:</span>
                    <span className="text-gray-900 font-medium">{formatPrice(bill.tax)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-primary font-bold text-lg">{formatPrice(bill.total)}</span>
                </div>
                
                {bill.amountPaid > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="text-green-600 font-medium">{formatPrice(bill.amountPaid)}</span>
                  </div>
                )}
                
                {bill.amountDue > 0 && bill.status !== 'cancelled' && (
                  <div className="flex justify-between text-sm">
                    <span className={`${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      Amount Due:
                    </span>
                    <span className={`font-medium ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatPrice(bill.amountDue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notes */}
            {bill.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    {bill.notes}
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
              <p className="text-sm text-gray-500 mb-2">Update bill status:</p>
              
              <button
                onClick={() => onStatusChange('draft')}
                disabled={bill.status === 'paid' || bill.status === 'cancelled'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors ${
                  bill.status === 'draft' ? 'bg-gray-50 text-gray-700 font-medium' : 'bg-white text-gray-700'
                } ${(bill.status === 'paid' || bill.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <FileText size={18} className="mr-2 text-gray-500" />
                  Draft
                </span>
                {bill.status === 'draft' && <CheckCircle size={18} className="text-gray-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('pending')}
                disabled={bill.status === 'paid' || bill.status === 'cancelled'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-blue-50 transition-colors ${
                  bill.status === 'pending' ? 'bg-blue-50 text-blue-700 font-medium' : 'bg-white text-gray-700'
                } ${(bill.status === 'paid' || bill.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <Clock size={18} className="mr-2 text-blue-500" />
                  Pending
                </span>
                {bill.status === 'pending' && <CheckCircle size={18} className="text-blue-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('paid')}
                disabled={bill.status === 'cancelled'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-green-50 transition-colors ${
                  bill.status === 'paid' ? 'bg-green-50 text-green-700 font-medium' : 'bg-white text-gray-700'
                } ${bill.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-500" />
                  Paid
                </span>
                {bill.status === 'paid' && <CheckCircle size={18} className="text-green-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('partially_paid')}
                disabled={bill.status === 'paid' || bill.status === 'cancelled'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-yellow-50 transition-colors ${
                  bill.status === 'partially_paid' ? 'bg-yellow-50 text-yellow-700 font-medium' : 'bg-white text-gray-700'
                } ${(bill.status === 'paid' || bill.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <DollarSign size={18} className="mr-2 text-yellow-500" />
                  Partially Paid
                </span>
                {bill.status === 'partially_paid' && <CheckCircle size={18} className="text-yellow-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('overdue')}
                disabled={bill.status === 'paid' || bill.status === 'cancelled'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-red-50 transition-colors ${
                  bill.status === 'overdue' ? 'bg-red-50 text-red-700 font-medium' : 'bg-white text-gray-700'
                } ${(bill.status === 'paid' || bill.status === 'cancelled') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-red-500" />
                  Overdue
                </span>
                {bill.status === 'overdue' && <CheckCircle size={18} className="text-red-500" />}
              </button>
              
              <button
                onClick={() => onStatusChange('cancelled')}
                disabled={bill.status === 'paid'}
                className={`w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors ${
                  bill.status === 'cancelled' ? 'bg-gray-50 text-gray-700 font-medium' : 'bg-white text-gray-700'
                } ${bill.status === 'paid' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center">
                  <XCircle size={18} className="mr-2 text-gray-500" />
                  Cancelled
                </span>
                {bill.status === 'cancelled' && <CheckCircle size={18} className="text-gray-500" />}
              </button>
            </div>
          </div>
          
          {/* Payment History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Payment History</h2>
              {canAddPayment && (
                <button
                  onClick={onAddPayment}
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Payment
                </button>
              )}
            </div>
            
            <div className="p-4">
              {bill.payments.length === 0 ? (
                <div className="text-center py-6">
                  <DollarSign size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No payments recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bill.payments.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <DollarSign size={18} className="text-green-500 mr-2" />
                          <span className="font-medium">{formatPrice(payment.amount)}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><span className="font-medium">Method:</span> {getPaymentMethodName(payment.method)}</p>
                        {payment.reference && (
                          <p><span className="font-medium">Reference:</span> {payment.reference}</p>
                        )}
                        {payment.notes && (
                          <p><span className="font-medium">Notes:</span> {payment.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Record Information */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm text-gray-500">
          <div>
            <p>Created: {new Date(bill.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p>Last Updated: {new Date(bill.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
