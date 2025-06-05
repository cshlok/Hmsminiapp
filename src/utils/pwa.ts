// PWA utilities for service worker, notifications, and installation

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.init();
  }

  public static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  private init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.checkIfInstalled();
  }

  // Service Worker Registration
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', this.swRegistration);
        
        // Update service worker when available
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available
                  this.showUpdateAvailable();
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Install Prompt Management
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPromotion();
    });

    window.addEventListener('appinstalled', () => {
      console.log('App was installed');
      this.isInstalled = true;
      this.hideInstallPromotion();
      this.deferredPrompt = null;
    });
  }

  // Check if app is already installed
  private checkIfInstalled(): void {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // iOS detection
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
    }
  }

  // Public Methods
  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during install prompt:', error);
      return false;
    }
  }

  public canInstall(): boolean {
    return !this.isInstalled && this.deferredPrompt !== null;
  }

  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  // Notification Management
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  public async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const permission = await this.requestNotificationPermission();
    
    if (permission === 'granted' && this.swRegistration) {
      await this.swRegistration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });
    }
  }

  // Background Sync
  public async requestBackgroundSync(tag: string): Promise<void> {
    if (this.swRegistration && 'sync' in this.swRegistration) {
      try {
        // Type assertion for sync property
        const syncManager = (this.swRegistration as any).sync;
        if (syncManager && typeof syncManager.register === 'function') {
          await syncManager.register(tag);
          console.log('Background sync registered:', tag);
        }
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Update Management
  public async updateApp(): Promise<void> {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  private showInstallPromotion(): void {
    // Dispatch custom event for install promotion
    const event = new CustomEvent('pwa-install-available');
    window.dispatchEvent(event);
  }

  private hideInstallPromotion(): void {
    // Dispatch custom event to hide install promotion
    const event = new CustomEvent('pwa-install-hidden');
    window.dispatchEvent(event);
  }

  private showUpdateAvailable(): void {
    // Dispatch custom event for update available
    const event = new CustomEvent('pwa-update-available');
    window.dispatchEvent(event);
  }
}

// Utility functions
export const pwaManager = PWAManager.getInstance();

export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const isStandalone = (): boolean => {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isMobile = (): boolean => {
  return isIOS() || isAndroid();
};

// WebAuthn utilities for biometric authentication
export class BiometricAuth {
  public static isSupported(): boolean {
    return 'credentials' in navigator && 'create' in navigator.credentials;
  }

  public static async register(username: string): Promise<Credential | null> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported');
    }

    const publicKeyCredentialCreationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge: new Uint8Array(32).map(() => Math.random() * 256),
        rp: {
          name: "Clinic Management System",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(username),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          {
            alg: -7,
            type: "public-key"
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      }
    };

    try {
      const credential = await navigator.credentials.create(publicKeyCredentialCreationOptions);
      return credential;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw error;
    }
  }

  public static async authenticate(): Promise<Credential | null> {
    if (!this.isSupported()) {
      throw new Error('WebAuthn is not supported');
    }

    const publicKeyCredentialRequestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge: new Uint8Array(32).map(() => Math.random() * 256),
        allowCredentials: [],
        timeout: 60000,
        userVerification: "required"
      }
    };

    try {
      const credential = await navigator.credentials.get(publicKeyCredentialRequestOptions);
      return credential;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }
}
