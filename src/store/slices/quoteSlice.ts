import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveQuotes, loadQuotes } from '../../utils/storage';

export interface IQuoteItem {
  id: string;
  serviceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface IQuote {
  id: string;
  patientId: string;
  title: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  items: IQuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuoteState {
  quotes: IQuote[];
  selectedQuote: IQuote | null;
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
const initialState: QuoteState = {
  quotes: loadQuotes(),
  selectedQuote: null,
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

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setQuotes: (state, action: PayloadAction<IQuote[]>) => {
      state.quotes = action.payload;
      saveQuotes(action.payload); // Persist to storage
    },
    addQuote: (state, action: PayloadAction<IQuote>) => {
      state.quotes.push(action.payload);
      saveQuotes(state.quotes); // Persist to storage
    },
    updateQuote: (state, action: PayloadAction<IQuote>) => {
      const index = state.quotes.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quotes[index] = action.payload;
        saveQuotes(state.quotes); // Persist to storage
      }
    },
    deleteQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(q => q.id !== action.payload);
      saveQuotes(state.quotes); // Persist to storage
    },
    setSelectedQuote: (state, action: PayloadAction<IQuote | null>) => {
      state.selectedQuote = action.payload;
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
  setQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
  setSelectedQuote,
  setSearchQuery,
  setFilterPatientId,
  setFilterStatus,
  setFilterDateRange,
  clearFilters,
} = quoteSlice.actions;

export default quoteSlice.reducer;
