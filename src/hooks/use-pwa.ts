import { useState, useEffect, useCallback } from 'react';
import { pwaManager, isPWASupported, isStandalone, BiometricAuth } from '../utils/pwa';

// Hook for PWA installation
export const useInstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isStandalone());

  useEffect(() => {
    const handleInstallAvailable = () => {
      setCanInstall(true);
    };

    const handleInstallHidden = () => {
      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-hidden', handleInstallHidden);

    // Check initial state
    setCanInstall(pwaManager.canInstall());
    setIsInstalled(pwaManager.isAppInstalled());

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-hidden', handleInstallHidden);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const result = await pwaManager.promptInstall();
    if (result) {
      setCanInstall(false);
      setIsInstalled(true);
    }
    return result;
  }, []);

  return {
    canInstall,
    isInstalled,
    promptInstall,
    isPWASupported: isPWASupported()
  };
};

// Hook for app updates
export const useAppUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const updateApp = useCallback(async () => {
    await pwaManager.updateApp();
    setUpdateAvailable(false);
  }, []);

  return {
    updateAvailable,
    updateApp
  };
};

// Hook for online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook for push notifications
export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState('Notification' in window);

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    const newPermission = await pwaManager.requestNotificationPermission();
    setPermission(newPermission);
    return newPermission;
  }, []);

  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      await pwaManager.showNotification(title, options);
    } else {
      console.warn('Notification permission not granted');
    }
  }, [permission]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification
  };
};

// Hook for biometric authentication
export const useBiometricAuth = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setIsSupported(BiometricAuth.isSupported());
    
    // Check if user has registered biometric credentials
    const hasRegisteredCredentials = localStorage.getItem('biometric-registered') === 'true';
    setIsRegistered(hasRegisteredCredentials);
  }, []);

  const registerBiometric = useCallback(async (username: string) => {
    try {
      const credential = await BiometricAuth.register(username);
      if (credential) {
        localStorage.setItem('biometric-registered', 'true');
        setIsRegistered(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw error;
    }
  }, []);

  const authenticateWithBiometric = useCallback(async () => {
    try {
      const credential = await BiometricAuth.authenticate();
      return !!credential;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }, []);

  return {
    isSupported,
    isRegistered,
    registerBiometric,
    authenticateWithBiometric
  };
};

// Hook for background sync
export const useBackgroundSync = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype);
  }, []);

  const requestSync = useCallback(async (tag: string) => {
    if (isSupported) {
      await pwaManager.requestBackgroundSync(tag);
    }
  }, [isSupported]);

  return {
    isSupported,
    requestSync
  };
};

// Hook for device capabilities
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isStandalone: isStandalone(),
    isOnline: navigator.onLine,
    hasNotificationSupport: 'Notification' in window,
    hasServiceWorkerSupport: 'serviceWorker' in navigator,
    hasPushSupport: 'PushManager' in window,
    hasBackgroundSyncSupport: 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype,
    hasBiometricSupport: BiometricAuth.isSupported(),
    hasVibrationSupport: 'vibrate' in navigator,
    hasGeolocationSupport: 'geolocation' in navigator,
    hasShareSupport: 'share' in navigator,
    deviceType: /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'iOS' : 
                /Android/.test(navigator.userAgent) ? 'Android' : 'Desktop'
  });

  useEffect(() => {
    const handleOnline = () => setCapabilities(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setCapabilities(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return capabilities;
};

// Hook for data persistence
export const useOfflineData = <T>(key: string, defaultValue: T) => {
  const [data, setData] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredData = useCallback((value: T | ((prev: T) => T)) => {
    setData(prevData => {
      const newData = typeof value === 'function' ? (value as (prev: T) => T)(prevData) : value;
      try {
        localStorage.setItem(key, JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to store data:', error);
      }
      return newData;
    });
  }, [key]);

  const clearStoredData = useCallback(() => {
    localStorage.removeItem(key);
    setData(defaultValue);
  }, [key, defaultValue]);

  return [data, setStoredData, clearStoredData] as const;
};
