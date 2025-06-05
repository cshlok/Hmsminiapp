import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBill } from '../../models/BillingModel';

interface BillingState {
  bills: IBill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  bills: [],
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<IBill[]>) => {
      state.bills = action.payload;
    },
    addBill: (state, action: PayloadAction<IBill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<IBill>) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBills,
  addBill,
  updateBill,
  deleteBill,
  setLoading,
  setError,
} = billingSlice.actions;

export default billingSlice.reducer;
