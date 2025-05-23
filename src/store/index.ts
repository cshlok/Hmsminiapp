import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import serviceReducer from './slices/serviceSlice';
import quoteReducer from './slices/quoteSlice';

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['patient', 'appointment', 'service', 'quote'], // Persist all module states
};

const rootReducer = combineReducers({
  patient: patientReducer,
  appointment: appointmentReducer,
  service: serviceReducer,
  quote: quoteReducer,
  // Add other reducers here as the app grows
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
