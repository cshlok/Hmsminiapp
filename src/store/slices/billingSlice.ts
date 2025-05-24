import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveBills, loadBills } from '../../utils/storage';

export interface IBillItem {
  id: string;
  serviceId: string;
  quoteItemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface IBillPayment {
  id: string;
  amount: number;
  method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'other';
  reference?: string;
  notes?: string;
  date: string;
}

export interface IBill {
  id: string;
  patientId: string;
  quoteId?: string;
  billNumber: string;
  status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  items: IBillItem[];
  payments: IBillPayment[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BillingState {
  bills: IBill[];
  selectedBill: IBill | null;
  loading: boolean;
  error: string | null;
  filters: {
    searchQuery: string;
    patientId: string | null;
    status: string | null;
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}

// Initialize state with data from local storage
const initialState: BillingState = {
  bills: loadBills(),
  selectedBill: null,
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    patientId: null,
    status: null,
    dateRange: {
      startDate: null,
      endDate: null,
    },
  },
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setBills: (state, action: PayloadAction<IBill[]>) => {
      state.bills = action.payload;
      saveBills(action.payload); // Persist to storage
    },
    addBill: (state, action: PayloadAction<IBill>) => {
      state.bills.push(action.payload);
      saveBills(state.bills); // Persist to storage
    },
    updateBill: (state, action: PayloadAction<IBill>) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
        saveBills(state.bills); // Persist to storage
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
      saveBills(state.bills); // Persist to storage
    },
    addPayment: (state, action: PayloadAction<{ billId: string; payment: IBillPayment }>) => {
      const { billId, payment } = action.payload;
      const billIndex = state.bills.findIndex(b => b.id === billId);
      
      if (billIndex !== -1) {
        const bill = state.bills[billIndex];
        
        // Add payment to bill
        bill.payments.push(payment);
        
        // Update amount paid and due
        bill.amountPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
        bill.amountDue = bill.total - bill.amountPaid;
        
        // Update status based on payment
        if (bill.amountDue <= 0) {
          bill.status = 'paid';
        } else if (bill.amountPaid > 0) {
          bill.status = 'partially_paid';
        }
        
        // Update timestamp
        bill.updatedAt = new Date().toISOString();
        
        // Update bill in state
        state.bills[billIndex] = bill;
        
        // Update selected bill if it's the same one
        if (state.selectedBill && state.selectedBill.id === billId) {
          state.selectedBill = bill;
        }
        
        // Persist to storage
        saveBills(state.bills);
      }
    },
    setSelectedBill: (state, action: PayloadAction<IBill | null>) => {
      state.selectedBill = action.payload;
    },
    // Filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setFilterPatientId: (state, action: PayloadAction<string | null>) => {
      state.filters.patientId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
    setFilterDateRange: (state, action: PayloadAction<{startDate: string | null, endDate: string | null}>) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchQuery: '',
        patientId: null,
        status: null,
        dateRange: {
          startDate: null,
          endDate: null,
        },
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setBills,
  addBill,
  updateBill,
  deleteBill,
  addPayment,
  setSelectedBill,
  setSearchQuery,
  setFilterPatientId,
  setFilterStatus,
  setFilterDateRange,
  clearFilters,
} = billingSlice.actions;

export default billingSlice.reducer;
