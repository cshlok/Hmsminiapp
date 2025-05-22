import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

// Define the app theme with the color scheme specified in the architecture document
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A6FE3', // Cool Blue
    accent: '#2CCCE4', // Teal
    secondary: '#8C42AB', // Purple
    background: '#F8F9FA', // Light Gray
    text: '#212529', // Dark Gray
    success: '#28A745', // Green
    warning: '#FFC107', // Amber
    error: '#DC3545', // Red
  },
};

// Main App component
const App = () => {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
