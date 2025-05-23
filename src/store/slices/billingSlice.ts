import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBill, IPayment } from '../models/BillingModel';

interface BillingState {
  bills: IBill[];
  selectedBill: IBill | null;
  loading: boolean;
  error: string | null;
  filterStatus: string | null;
  filterPatientId: string | null;
  searchQuery: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

const initialState: BillingState = {
  bills: [],
  selectedBill: null,
  loading: false,
  error: null,
  filterStatus: null,
  filterPatientId: null,
  searchQuery: '',
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<IBill[]>) => {
      state.bills = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedBill: (state, action: PayloadAction<IBill | null>) => {
      state.selectedBill = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addBill: (state, action: PayloadAction<IBill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<IBill>) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
      if (state.selectedBill?.id === action.payload.id) {
        state.selectedBill = action.payload;
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
      if (state.selectedBill?.id === action.payload) {
        state.selectedBill = null;
      }
    },
    addPayment: (state, action: PayloadAction<{ billId: string, payment: IPayment }>) => {
      const { billId, payment } = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      
      if (bill) {
        // Add payment to bill
        bill.payments.push(payment);
        
        // Update bill amount paid and balance
        bill.amountPaid += payment.amount;
        bill.balance = bill.total - bill.amountPaid;
        
        // Update bill status
        if (bill.balance <= 0) {
          bill.status = 'paid';
        } else if (bill.amountPaid > 0) {
          bill.status = 'partially_paid';
        }
        
        bill.updatedAt = new Date();
        
        // Update selected bill if it's the same
        if (state.selectedBill?.id === billId) {
          state.selectedBill = { ...bill };
        }
      }
    },
    deletePayment: (state, action: PayloadAction<{ billId: string, paymentId: string, amount: number }>) => {
      const { billId, paymentId, amount } = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      
      if (bill) {
        // Remove payment from bill
        bill.payments = bill.payments.filter(p => p.id !== paymentId);
        
        // Update bill amount paid and balance
        bill.amountPaid -= amount;
        bill.balance = bill.total - bill.amountPaid;
        
        // Update bill status
        if (bill.amountPaid <= 0) {
          bill.status = 'unpaid';
        } else if (bill.amountPaid < bill.total) {
          bill.status = 'partially_paid';
        }
        
        bill.updatedAt = new Date();
        
        // Update selected bill if it's the same
        if (state.selectedBill?.id === billId) {
          state.selectedBill = { ...bill };
        }
      }
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
    setFilterPatientId: (state, action: PayloadAction<string | null>) => {
      state.filterPatientId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: Date | null, endDate: Date | null }>) => {
      state.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filterStatus = null;
      state.filterPatientId = null;
      state.searchQuery = '';
      state.dateRange = {
        startDate: null,
        endDate: null,
      };
    },
  },
});

export const {
  setBills,
  setSelectedBill,
  setLoading,
  setError,
  addBill,
  updateBill,
  deleteBill,
  addPayment,
  deletePayment,
  setFilterStatus,
  setFilterPatientId,
  setSearchQuery,
  setDateRange,
  clearFilters,
} = billingSlice.actions;

export default billingSlice.reducer;
