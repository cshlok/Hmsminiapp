import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addBill, IBill, IBillItem } from '../../store/slices/billingSlice';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Calendar, User, FileText, DollarSign, X } from 'lucide-react';

const AddBillContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get patients, services, and quotes from store for selection
  const { patients } = useAppSelector(state => state.patient);
  const { services } = useAppSelector(state => state.service);
  const { quotes } = useAppSelector(state => state.quote);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Generate a new bill number
  const generateBillNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL-${year}-${randomNum}`;
  };
  
  // Calculate a default due date (30 days from now)
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  // Initial empty bill data
  const [formData, setFormData] = useState<Partial<IBill>>({
    patientId: patients.length > 0 ? patients[0].id : '',
    quoteId: '',
    billNumber: generateBillNumber(),
    status: 'draft',
    items: [],
    payments: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    amountPaid: 0,
    amountDue: 0,
    dueDate: getDefaultDueDate(),
    notes: '',
  });
  
  // State for bill items
  const [items, setItems] = useState<IBillItem[]>([]);
  
  // State for new item form
  const [newItem, setNewItem] = useState<Partial<IBillItem>>({
    serviceId: services.length > 0 ? services[0].id : '',
    description: '',
    quantity: 1,
    unitPrice: services.length > 0 ? services[0].price : 0,
    discount: 0,
    total: services.length > 0 ? services[0].price : 0,
  });
  
  // Update new item unit price when service changes
  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const quantity = newItem.quantity || 1;
      const discount = newItem.discount || 0;
      const total = (service.price * quantity) - discount;
      
      setNewItem({
        ...newItem,
        serviceId,
        description: service.name,
        unitPrice: service.price,
        total
      });
    }
  };
  
  // Handle quote selection
  const handleQuoteChange = (quoteId: string) => {
    if (!quoteId) {
      setFormData({
        ...formData,
        quoteId: '',
      });
      return;
    }
    
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      // Convert quote items to bill items
      const billItems: IBillItem[] = quote.items.map(quoteItem => {
        const service = services.find(s => s.id === quoteItem.serviceId);
        return {
          id: uuidv4(),
          serviceId: quoteItem.serviceId,
          quoteItemId: quoteItem.id,
          description: service?.name || 'Unknown Service',
          quantity: quoteItem.quantity,
          unitPrice: quoteItem.unitPrice,
          discount: quoteItem.discount,
          total: quoteItem.total
        };
      });
      
      setItems(billItems);
      
      // Update form data with quote information
      setFormData({
        ...formData,
        quoteId,
        patientId: quote.patientId,
        subtotal: quote.subtotal,
        discount: quote.discount,
        tax: quote.tax,
        total: quote.total,
        amountDue: quote.total,
        items: billItems,
      });
    }
  };
  
  // Handle input change for main form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
      
      // Recalculate totals if discount or tax changes
      if (name === 'discount' || name === 'tax') {
        const updatedFormData = {
          ...formData,
          [name]: parsedValue,
        };
        
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        updatedFormData.subtotal = subtotal;
        updatedFormData.discount = name === 'discount' ? parsedValue as number : (formData.discount || 0);
        updatedFormData.tax = name === 'tax' ? parsedValue as number : (formData.tax || 0);
        updatedFormData.total = subtotal - updatedFormData.discount + updatedFormData.tax;
        updatedFormData.amountDue = updatedFormData.total;
        
        setFormData(updatedFormData);
        return;
      }
    }
    
    // Special handling for patientId
    if (name === 'patientId') {
      // If selecting a patient, check if there's a quote and if it belongs to this patient
      if (formData.quoteId) {
        const quote = quotes.find(q => q.id === formData.quoteId);
        if (quote && quote.patientId !== value) {
          // If quote belongs to a different patient, clear the quote selection
          setFormData({
            ...formData,
            patientId: value as string,
            quoteId: '',
          });
          return;
        }
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
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const quantity = name === 'quantity' ? parsedValue as number : (newItem.quantity || 1);
      const unitPrice = name === 'unitPrice' ? parsedValue as number : (newItem.unitPrice || 0);
      const discount = name === 'discount' ? parsedValue as number : (newItem.discount || 0);
      
      updatedItem.total = (unitPrice * quantity) - discount;
    }
    
    setNewItem(updatedItem);
  };
  
  // Add item to bill
  const handleAddItem = () => {
    if (!newItem.serviceId) {
      alert('Please select a service');
      return;
    }
    
    // Create new item with ID
    const itemToAdd: IBillItem = {
      id: uuidv4(),
      serviceId: newItem.serviceId as string,
      description: newItem.description || getServiceName(newItem.serviceId as string),
      quantity: newItem.quantity as number,
      unitPrice: newItem.unitPrice as number,
      discount: newItem.discount as number,
      total: newItem.total as number,
    };
    
    // Add to items array
    const updatedItems = [...items, itemToAdd];
    setItems(updatedItems);
    
    // Recalculate bill totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const discount = formData.discount || 0;
    const tax = formData.tax || 0;
    const total = subtotal - discount + tax;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
      amountDue: total,
    }));
    
    // Reset new item form
    setNewItem({
      serviceId: services.length > 0 ? services[0].id : '',
      description: '',
      quantity: 1,
      unitPrice: services.length > 0 ? services[0].price : 0,
      discount: 0,
      total: services.length > 0 ? services[0].price : 0,
    });
  };
  
  // Remove item from bill
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    // Recalculate bill totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const discount = formData.discount || 0;
    const tax = formData.tax || 0;
    const total = subtotal - discount + tax;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
      amountDue: total,
    }));
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
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.billNumber?.trim()) {
      newErrors.billNumber = 'Bill number is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
      setLoading(true);
      
      // Create a new bill object with ID and timestamps
      const newBill: IBill = {
        ...formData as IBill,
        id: uuidv4(),
        items,
        payments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        try {
          // Add bill to Redux store
          dispatch(addBill(newBill));
          
          // Navigate to the bill details page
          navigate(`/billing/${newBill.id}`);
        } catch (error) {
          console.error('Failed to add bill:', error);
          // Error handling would be implemented here
        } finally {
          setLoading(false);
        }
      }, 1000);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/billing');
  };
  
  // Get available quotes for the selected patient
  const getAvailableQuotes = () => {
    if (!formData.patientId) return [];
    return quotes.filter(q => q.patientId === formData.patientId && q.status !== 'cancelled');
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link
          to="/billing"
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Create New Bill</h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Bill Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            {/* Quote (optional) */}
            <div>
              <label htmlFor="quoteId" className="block text-sm font-medium text-gray-700 mb-1">
                Based on Quote (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <select
                  id="quoteId"
                  name="quoteId"
                  value={formData.quoteId || ''}
                  onChange={(e) => handleQuoteChange(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  disabled={!formData.patientId}
                >
                  <option value="">None</option>
                  {getAvailableQuotes().map((quote) => (
                    <option key={quote.id} value={quote.id}>
                      {quote.title}
                    </option>
                  ))}
                </select>
              </div>
              {!formData.patientId && (
                <p className="mt-1 text-xs text-gray-500">
                  Select a patient first to see available quotes
                </p>
              )}
            </div>
            
            {/* Bill Number */}
            <div>
              <label htmlFor="billNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Bill Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="billNumber"
                name="billNumber"
                value={formData.billNumber || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                  errors.billNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.billNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.billNumber}</p>
              )}
            </div>
            
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate || ''}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'draft'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
              </select>
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
                placeholder="Additional information or terms for this bill"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
        
        {/* Bill Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Bill Items</h2>
          
          {/* Add New Item */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-md font-medium mb-3">Add Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Service <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={newItem.serviceId || ''}
                  onChange={(e) => handleServiceChange(e.target.value)}
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
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newItem.description || ''}
                  onChange={handleItemChange}
                  placeholder="Service description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
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
              <p className="text-gray-500">No items added to this bill yet</p>
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
          
          {/* Bill Summary */}
          {items.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(formData.subtotal || 0)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
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
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Due:</span>
                  <span className="text-gray-900 font-medium">{formatPrice(formData.amountDue || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
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
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save size={18} className="mr-2" />
                Save Bill
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBillContainer;
