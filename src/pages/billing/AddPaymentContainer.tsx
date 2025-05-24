import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addPayment, IPayment } from '../../store/slices/billingSlice';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, CreditCard, Save } from 'lucide-react';

const AddPaymentContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { bills } = useAppSelector(state => state.billing);
  const bill = bills.find(b => b.id === id);
  
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<Partial<IPayment>>({
    amount: bill?.amountDue || 0,
    method: 'cash',
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  // Check if payment can be added
  if (bill.status === 'paid' || bill.status === 'cancelled') {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cannot add payment</h3>
        <p className="text-gray-500 mb-4">
          Payments cannot be added to bills that are already paid or cancelled.
        </p>
        <Link
          to={`/billing/${id}`}
          className="inline-flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Bill Details
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
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setPayment({
      ...payment,
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
    if (!payment.amount || payment.amount <= 0) {
      newErrors.amount = 'Payment amount must be greater than 0';
    } else if (payment.amount > bill.amountDue) {
      newErrors.amount = `Payment amount cannot exceed the amount due (${formatPrice(bill.amountDue)})`;
    }
    
    if (!payment.method) {
      newErrors.method = 'Payment method is required';
    }
    
    if (!payment.date) {
      newErrors.date = 'Payment date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Create new payment with ID
      const newPayment: IPayment = {
        id: uuidv4(),
        amount: payment.amount as number,
        method: payment.method as 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'insurance' | 'other',
        reference: payment.reference,
        notes: payment.notes,
        date: payment.date as string,
      };
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Add payment to Redux store
          dispatch(addPayment({ billId: bill.id, payment: newPayment }));
          
          // Navigate back to bill details
          navigate(`/billing/${bill.id}`);
        } catch (error) {
          console.error('Failed to add payment:', error);
          // Error handling would be implemented here
        } finally {
          setLoading(false);
        }
      }, 1000);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link
          to={`/billing/${id}`}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Add Payment</h1>
      </div>
      
      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Bill Information</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bill Number</p>
                <p className="font-medium">{bill.billNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">{formatPrice(bill.total)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="font-medium text-red-600">{formatPrice(bill.amountDue)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  max={bill.amountDue}
                  value={payment.amount || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum payment amount: {formatPrice(bill.amountDue)}
              </p>
            </div>
            
            {/* Payment Method */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CreditCard size={16} className="text-gray-400" />
                </div>
                <select
                  id="method"
                  name="method"
                  value={payment.method || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.method ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="insurance">Insurance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.method && (
                <p className="mt-1 text-sm text-red-500">{errors.method}</p>
              )}
            </div>
            
            {/* Payment Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={payment.date || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            
            {/* Reference Number */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={payment.reference || ''}
                onChange={handleChange}
                placeholder="e.g., Transaction ID, Check Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
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
                value={payment.notes || ''}
                onChange={handleChange}
                placeholder="Additional information about this payment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Link
              to={`/billing/${id}`}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </Link>
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
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={18} className="mr-2" />
                  Record Payment
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentContainer;
