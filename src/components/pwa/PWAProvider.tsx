import React, { createContext, useContext, useEffect, useState } from 'react';
import { pwaManager } from '../../utils/pwa';
import { OfflineIndicator } from './OfflineIndicator';
import { UpdateNotification } from './UpdateNotification';
import { InstallBanner } from './InstallPrompt';

interface PWAContextType {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  promptInstall: () => Promise<boolean>;
  updateApp: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Initialize PWA manager
    const updatePWAState = () => {
      setIsInstalled(pwaManager.isAppInstalled());
      setCanInstall(pwaManager.canInstall());
    };

    // Set up event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallAvailable = () => {
      setCanInstall(true);
      updatePWAState();
    };
    const handleInstallHidden = () => {
      setCanInstall(false);
      setIsInstalled(true);
      updatePWAState();
    };
    const handleUpdateAvailable = () => setHasUpdate(true);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-hidden', handleInstallHidden);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    // Initial state update
    updatePWAState();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-hidden', handleInstallHidden);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    const result = await pwaManager.promptInstall();
    if (result) {
      setCanInstall(false);
      setIsInstalled(true);
    }
    return result;
  };

  const updateApp = async (): Promise<void> => {
    await pwaManager.updateApp();
    setHasUpdate(false);
  };

  const contextValue: PWAContextType = {
    isInstalled,
    canInstall,
    isOnline,
    hasUpdate,
    promptInstall,
    updateApp
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      {/* PWA UI Components */}
      <OfflineIndicator />
      <UpdateNotification />
      <InstallBanner />
    </PWAContext.Provider>
  );
};
