import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogIn, Eye, EyeOff } from 'lucide-react';

// Simple authentication service
const AUTH_KEY = 'clinic_auth_token';
const PIN_KEY = 'clinic_auth_pin';
const DEFAULT_PIN = '1234'; // Default PIN for demo purposes

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (pin: string): boolean => {
  const storedPin = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  if (pin === storedPin) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const changePin = (currentPin: string, newPin: string): boolean => {
  const storedPin = localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  if (currentPin === storedPin) {
    localStorage.setItem(PIN_KEY, newPin);
    return true;
  }
  return false;
};

// Login component
const Login: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';
  
  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!pin.trim()) {
      setError('Please enter your PIN');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = login(pin);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Clinic Management System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your PIN to access the system
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="pin" className="sr-only">PIN</label>
              <input
                id="pin"
                name="pin"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Enter PIN"
                maxLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={loading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-primary-light group-hover:text-primary-light" />
              </span>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            <p>Default PIN: 1234</p>
            <p className="mt-1">You can change this in Settings after login</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Security Settings component for changing PIN
export const SecuritySettings: React.FC = () => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!currentPin.trim()) {
      setError('Please enter your current PIN');
      return;
    }
    
    if (!newPin.trim()) {
      setError('Please enter a new PIN');
      return;
    }
    
    if (newPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    
    if (newPin !== confirmPin) {
      setError('New PIN and confirmation do not match');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const success = changePin(currentPin, newPin);
      
      if (success) {
        setSuccess('PIN changed successfully');
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
      } else {
        setError('Current PIN is incorrect');
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Change PIN</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPin" className="block text-sm font-medium text-gray-700 mb-1">
                Current PIN
              </label>
              <input
                type="password"
                id="currentPin"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                maxLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 mb-1">
                New PIN
              </label>
              <input
                type="password"
                id="newPin"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                maxLength={6}
              />
              <p className="mt-1 text-sm text-gray-500">
                PIN must be at least 4 digits
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New PIN
              </label>
              <input
                type="password"
                id="confirmPin"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                maxLength={6}
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 text-red-500 text-sm">{error}</div>
          )}
          
          {success && (
            <div className="mt-4 text-green-500 text-sm">{success}</div>
          )}
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update PIN'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page with the current location
      navigate('/login', { state: { from: location } });
    }
  }, [location, navigate]);
  
  // If authenticated, render children
  return isAuthenticated() ? <>{children}</> : null;
};

// Logout component
export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-600 hover:text-red-800"
    >
      <LogIn className="h-5 w-5 mr-2" />
      <span>Logout</span>
    </button>
  );
};

export default Login;
