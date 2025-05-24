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
  FileText,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { IBill } from '../../store/slices/billingSlice';
import { IPatient } from '../../store/slices/patientSlice';
import { IService } from '../../store/slices/serviceSlice';

interface BillListProps {
  bills: IBill[];
  patients: IPatient[];
  services: IService[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterPatientId: string | null;
  filterStatus: string | null;
  filterDateRange: { start: string | null; end: string | null };
  onSearch: (query: string) => void;
  onFilterPatient: (patientId: string | null) => void;
  onFilterStatus: (status: string | null) => void;
  onFilterDateRange: (start: string | null, end: string | null) => void;
  onClearFilters: () => void;
}

const BillList: React.FC<BillListProps> = ({
  bills,
  patients,
  services,
  loading,
  error,
  searchQuery,
  filterPatientId,
  filterStatus,
  filterDateRange,
  onSearch,
  onFilterPatient,
  onFilterStatus,
  onFilterDateRange,
  onClearFilters,
}) => {
  // Helper to get patient name by ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
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
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Pending</span>;
      case 'paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
      case 'partially_paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Partially Paid</span>;
      case 'overdue':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  // Helper to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText size={16} className="text-gray-500" />;
      case 'pending':
        return <Clock size={16} className="text-blue-500" />;
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'partially_paid':
        return <DollarSign size={16} className="text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-gray-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };
  
  // Helper to check if bill is overdue
  const isOverdue = (bill: IBill) => {
    if (bill.status === 'paid' || bill.status === 'cancelled') return false;
    
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    return dueDate < today && bill.amountDue > 0;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Billing</h1>
        <Link
          to="/billing/new"
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create New Bill
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
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          {/* Patient Filter */}
          <div>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
              value={filterPatientId || ''}
              onChange={(e) => onFilterPatient(e.target.value || null)}
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
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
              value={filterStatus || ''}
              onChange={(e) => onFilterStatus(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
              value={filterDateRange.start || ''}
              onChange={(e) => onFilterDateRange(e.target.value || null, filterDateRange.end)}
              placeholder="Start Date"
            />
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:ring-primary/50 focus:border-primary"
              value={filterDateRange.end || ''}
              onChange={(e) => onFilterDateRange(filterDateRange.start, e.target.value || null)}
              placeholder="End Date"
            />
          </div>
          
          {/* Clear Filters */}
          {(searchQuery || filterPatientId || filterStatus || filterDateRange.start || filterDateRange.end) && (
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
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <CreditCard size={32} className="text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterPatientId || filterStatus || filterDateRange.start || filterDateRange.end
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first bill'}
          </p>
          {!searchQuery && !filterPatientId && !filterStatus && !filterDateRange.start && !filterDateRange.end && (
            <Link
              to="/billing/new"
              className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Create New Bill
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
                    Bill
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill.id} className={`hover:bg-gray-50 ${isOverdue(bill) && bill.status !== 'overdue' ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard size={18} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bill.billNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(bill.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getPatientName(bill.patientId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <DollarSign size={16} className="mr-1 text-green-600" />
                          {formatPrice(bill.total)}
                        </div>
                        {bill.amountPaid > 0 && (
                          <div className="text-xs text-gray-500">
                            Paid: {formatPrice(bill.amountPaid)}
                          </div>
                        )}
                        {bill.amountDue > 0 && bill.status !== 'cancelled' && (
                          <div className={`text-xs ${isOverdue(bill) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                            Due: {formatPrice(bill.amountDue)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(bill.status)}
                        <span className="ml-1.5">
                          {getStatusBadge(bill.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={16} className="mr-1 text-blue-600" />
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </div>
                      {isOverdue(bill) && bill.status !== 'overdue' && (
                        <div className="text-xs text-red-500 font-medium mt-1">
                          Overdue
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/billing/${bill.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        {(bill.status === 'draft' || bill.status === 'pending') && (
                          <Link
                            to={`/billing/${bill.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                        )}
                        {bill.status !== 'paid' && bill.status !== 'cancelled' && (
                          <Link
                            to={`/billing/${bill.id}/payment`}
                            className="text-green-600 hover:text-green-900"
                            title="Add Payment"
                          >
                            <DollarSign size={18} />
                          </Link>
                        )}
                        {bill.status === 'draft' && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this bill?')) {
                                // Delete action will be implemented later
                                console.log('Delete bill:', bill.id);
                              }
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
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

export default BillList;
