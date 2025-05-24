import { store } from './index';
import patientReducer from './slices/patientSlice';

// Update the store to include the patient reducer
store.replaceReducer({
  ...store.getState(),
  patient: patientReducer,
});

// Export the updated store
export { store };
