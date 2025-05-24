import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientRoutes from './pages/patients/PatientRoutes';
import AppointmentRoutes from './pages/appointments/AppointmentRoutes';
import ServiceRoutes from './pages/services/ServiceRoutes';
import QuoteRoutes from './pages/quotes/QuoteRoutes';
import BillingRoutes from './pages/billing/BillingRoutes';
import SettingsRoutes from './pages/settings/SettingsRoutes';
import NotFound from './pages/NotFound';
import Login, { ProtectedRoute } from './auth/Login';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="patients/*" element={<PatientRoutes />} />
            <Route path="appointments/*" element={<AppointmentRoutes />} />
            <Route path="services/*" element={<ServiceRoutes />} />
            <Route path="quotes/*" element={<QuoteRoutes />} />
            <Route path="billing/*" element={<BillingRoutes />} />
            <Route path="settings/*" element={<SettingsRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Redirect to login if not authenticated */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
