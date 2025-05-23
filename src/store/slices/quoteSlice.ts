import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuote, IQuoteItem } from '../models/QuoteModel';

interface QuoteState {
  quotes: IQuote[];
  selectedQuote: IQuote | null;
  loading: boolean;
  error: string | null;
  filterStatus: string | null;
  filterPatientId: string | null;
  searchQuery: string;
}

const initialState: QuoteState = {
  quotes: [],
  selectedQuote: null,
  loading: false,
  error: null,
  filterStatus: null,
  filterPatientId: null,
  searchQuery: '',
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setQuotes: (state, action: PayloadAction<IQuote[]>) => {
      state.quotes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedQuote: (state, action: PayloadAction<IQuote | null>) => {
      state.selectedQuote = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addQuote: (state, action: PayloadAction<IQuote>) => {
      state.quotes.push(action.payload);
    },
    updateQuote: (state, action: PayloadAction<IQuote>) => {
      const index = state.quotes.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quotes[index] = action.payload;
      }
      if (state.selectedQuote?.id === action.payload.id) {
        state.selectedQuote = action.payload;
      }
    },
    deleteQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(q => q.id !== action.payload);
      if (state.selectedQuote?.id === action.payload) {
        state.selectedQuote = null;
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
    clearFilters: (state) => {
      state.filterStatus = null;
      state.filterPatientId = null;
      state.searchQuery = '';
    },
  },
});

export const {
  setQuotes,
  setSelectedQuote,
  setLoading,
  setError,
  addQuote,
  updateQuote,
  deleteQuote,
  setFilterStatus,
  setFilterPatientId,
  setSearchQuery,
  clearFilters,
} = quoteSlice.actions;

export default quoteSlice.reducer;
