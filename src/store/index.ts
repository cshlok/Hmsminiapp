import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import serviceReducer from './slices/serviceSlice';
import quoteReducer from './slices/quoteSlice';
import billingReducer from './slices/billingSlice';
import settingsReducer from './slices/settingsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointment: appointmentReducer,
    service: serviceReducer,
    quote: quoteReducer,
    billing: billingReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
