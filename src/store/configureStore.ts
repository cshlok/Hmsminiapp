import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import serviceReducer from './slices/serviceSlice';
import quoteReducer from './slices/quoteSlice';
import billingReducer from './slices/billingSlice';
import settingsReducer from './slices/settingsSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    service: serviceReducer,
    quote: quoteReducer,
    billing: billingReducer,
    settings: settingsReducer
  }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
