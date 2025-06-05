import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuote } from '../../models/QuoteModel';

interface QuoteState {
  quotes: IQuote[];
  loading: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  quotes: [],
  loading: false,
  error: null,
};

const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setQuotes: (state, action: PayloadAction<IQuote[]>) => {
      state.quotes = action.payload;
    },
    addQuote: (state, action: PayloadAction<IQuote>) => {
      state.quotes.push(action.payload);
    },
    updateQuote: (state, action: PayloadAction<IQuote>) => {
      const index = state.quotes.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.quotes[index] = action.payload;
      }
    },
    deleteQuote: (state, action: PayloadAction<string>) => {
      state.quotes = state.quotes.filter(q => q.id !== action.payload);
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
  setQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
  setLoading,
  setError,
} = quoteSlice.actions;

export default quoteSlice.reducer;
