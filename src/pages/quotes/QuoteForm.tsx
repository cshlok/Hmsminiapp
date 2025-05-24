import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  Calendar,
  User,
  FileText,
  DollarSign,
  X
} from 'lucide-react';
import { IQuote, IQuoteItem } from '../../store/slices/quoteSlice';
import { IPatient } from '../../store/slices/patientSlice';
import { IService } from '../../store/slices/serviceSlice';
import { v4 as uuidv4 } from 'uuid';

interface QuoteFormProps {
  quote: Partial<IQuote>;
  patients: IPatient[];
  services: IService[];
  loading: boolean;
  onSubmit: (quote: Partial<IQuote>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  quote,
  patients,
  services,
  loading,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  // Form state
  const [formData, setFormData] = useState<Partial<IQuote>>(quote);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<IQuoteItem[]>(quote.items || []);
  const [newItem, setNewItem] = useState<Partial<IQuoteItem>>({
    serviceId: services.length > 0 ? services[0].id : '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    total: 0,
  });
  
  // Update form data when quote prop changes (for edit mode)
  useEffect(() => {
    setFormData(quote);
    setItems(quote.items || []);
  }, [quote]);
  
  // Update new item unit price when service changes
  useEffect(() => {
    if (newItem.serviceId) {
      const service = services.find(s => s.id === newItem.serviceId);
      if (service) {
        setNewItem(prev => ({
          ...prev,
          unitPrice: service.price,
          total: calculateItemTotal(service.price, prev.quantity || 1, prev.discount || 0)
        }));
      }
    }
  }, [newItem.serviceId, services]);
  
  // Calculate item total
  const calculateItemTotal = (unitPrice: number, quantity: number, discount: number) => {
    return (unitPrice * quantity) - discount;
  };
  
  // Calculate quote totals
  const calculateQuoteTotals = (quoteItems: IQuoteItem[]) => {
    const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
    const discount = formData.discount || 0;
    const tax = formData.tax || 0;
    const total = subtotal - discount + tax;
    
    return { subtotal, discount, tax, total };
  };
  
  // Handle input change for main form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let parsedValue: string | number | boolean = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
      
      // Recalculate totals if discount or tax changes
      if (name === 'discount' || name === 'tax') {
        const updatedFormData = {
          ...formData,
          [name]: parsedValue,
        };
        
        const { subtotal, discount, tax, total } = calculateQuoteTotals(items);
        updatedFormData.subtotal = subtotal;
        updatedFormData.discount = name === 'discount' ? parsedValue as number : discount;
        updatedFormData.tax = name === 'tax' ? parsedValue as number : tax;
        updatedFormData.total = subtotal - updatedFormData.discount + updatedFormData.tax;
        
        setFormData(updatedFormData);
        return;
      }
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
  
  // Handle input change for new item
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    // Update new item
    const updatedItem = { ...newItem, [name]: parsedValue };
    
    // Recalculate total if quantity, unitPrice, or discount changes
    if (name === 'quantity' || name === 'unitPrice' || name === 'discount') {
      updatedItem.total = calculateItemTotal(
        updatedItem.unitPrice as number,
        updatedItem.quantity as number,
        updatedItem.discount as number
      );
    }
    
    setNewItem(updatedItem);
  };
  
  // Add item to quote
  const handleAddItem = () => {
    if (!newItem.serviceId) {
      alert('Please select a service');
      return;
    }
    
    // Create new item with ID
    const itemToAdd: IQuoteItem = {
      id: uuidv4(),
      serviceId: newItem.serviceId as string,
      quantity: newItem.quantity as number,
      unitPrice: newItem.unitPrice as number,
      discount: newItem.discount as number,
      total: newItem.total as number,
    };
    
    // Add to items array
    const updatedItems = [...items, itemToAdd];
    setItems(updatedItems);
    
    // Recalculate quote totals
    const { subtotal, discount, tax, total } = calculateQuoteTotals(updatedItems);
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total: subtotal - (prev.discount || 0) + (prev.tax || 0),
    }));
    
    // Reset new item form
    setNewItem({
      serviceId: services.length > 0 ? services[0].id : '',
      quantity: 1,
      unitPrice: services.length > 0 ? services[0].price : 0,
      discount: 0,
      total: services.length > 0 ? services[0].price : 0,
    });
  };
  
  // Remove item from quote
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Recalculate quote totals
    const { subtotal, discount, tax, total } = calculateQuoteTotals(updatedItems);
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total: subtotal - (prev.discount || 0) + (prev.tax || 0),
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.title?.trim()) {
      newErrors.title = 'Quote title is required';
    }
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }
    
    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare final data with items
      const finalData: Partial<IQuote> = {
        ...formData,
        items,
      };
      
      onSubmit(finalData);
    }
  };
  
  // Helper to get service name
  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };
  
  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link
          to="/quotes"
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Quote' : 'Create New Quote'}
        </h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Quote Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quote Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Quote Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="e.g., Dental Care Package, Health Checkup"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            {/* Patient */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.patientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>
              )}
            </div>
            
            {/* Valid Until */}
            <div>
              <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-1">
                Valid Until <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={formData.validUntil || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.validUntil ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.validUntil && (
                <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>
              )}
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
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Additional information or terms for this quote"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Quote Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Quote Items</h2>
          
          {/* Add New Item */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-md font-medium mb-3">Add Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Service <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={newItem.serviceId || ''}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatPrice(service.price)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={newItem.quantity || 1}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  min="0"
                  step="0.01"
                  value={newItem.discount || 0}
                  onChange={handleItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Plus size={18} className="mr-2" />
                  Add Item
                </button>
              </div>
            </div>
          </div>
          
          {/* Items List */}
          {items.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <FileText size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No items added to this quote yet</p>
              {errors.items && (
                <p className="mt-2 text-sm text-red-500">{errors.items}</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Quote Summary */}
          {items.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(formData.subtotal || 0)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Additional Discount:</span>
                  <div className="w-24">
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      step="0.01"
                      value={formData.discount || 0}
                      onChange={handleChange}
                      className="w-full px-2 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tax:</span>
                  <div className="w-24">
                    <input
                      type="number"
                      name="tax"
                      min="0"
                      step="0.01"
                      value={formData.tax || 0}
                      onChange={handleChange}
                      className="w-full px-2 py-1 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-900 font-bold">Total:</span>
                  <span className="text-primary font-bold text-lg">{formatPrice(formData.total || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
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
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                {isEditing ? 'Update Quote' : 'Save Quote'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteForm;
