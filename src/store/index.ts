import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import patientSlice from './slices/patientSlice';
import appointmentSlice from './slices/appointmentSlice';
import serviceSlice from './slices/serviceSlice';
import billingSlice from './slices/billingSlice';
import quoteSlice from './slices/quoteSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    patients: patientSlice,
    appointments: appointmentSlice,
    services: serviceSlice,
    billing: billingSlice,
    quotes: quoteSlice,
    settings: settingsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
