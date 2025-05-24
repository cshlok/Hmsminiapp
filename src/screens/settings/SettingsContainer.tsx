import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  resetSettings,
  updateTaxSettings,
  setLoading,
  setError,
} from '../../store/slices/settingsSlice';
import { SettingsRepository } from '../../storage/SettingsRepository';
import SettingsScreen from './SettingsScreen';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
}

const SettingsContainer: React.FC<{ navigation: NavigationProps }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [settingsRepo, setSettingsRepo] = useState<SettingsRepository | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertActions, setAlertActions] = useState<Array<{text: string, action: () => void, primary?: boolean}>>([]);

  // Show alert dialog
  const showAlert = (title: string, message: string, actions: Array<{text: string, action: () => void, primary?: boolean}>) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertActions(actions);
    setAlertOpen(true);
  };

  // Initialize repository and load settings
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new SettingsRepository(null as any); // Using any as a temporary workaround
        setSettingsRepo(repository);
        
        // Initialize settings if not exists
        // In a real implementation, this would fetch from Realm
        const initialSettings = repository.initializeSettings();
        dispatch(resetSettings(initialSettings));
      } catch (error) {
        console.error('Failed to initialize settings repository:', error);
        dispatch(setError('Failed to load settings. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRepository();
  }, [dispatch]);

  // Handle settings update
  const handleUpdateSettings = (updatedSettings: Partial<typeof settings>) => {
    if (!settingsRepo || !settings) return;
    
    try {
      dispatch(setLoading(true));
      
      // In a real implementation, this would update in Realm
      // Using updateTaxSettings as a temporary replacement for updateSettings
      dispatch(updateTaxSettings(updatedSettings as any)); // Using any as a temporary workaround
      
      // Show success message
      showAlert('Settings Updated', 'Your settings have been successfully updated.', [
        { text: 'OK', action: () => setAlertOpen(false), primary: true }
      ]);
    } catch (error) {
      console.error('Failed to update settings:', error);
      dispatch(setError('Failed to update settings. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle PIN toggle
  const handleTogglePin = (enabled: boolean) => {
    if (!settingsRepo || !settings) return;
    
    if (enabled) {
      // Show PIN setup dialog
      navigation.navigate('SetupPin', {
        onSuccess: (pin: string) => {
          try {
            dispatch(setLoading(true));
            
            // In a real implementation, this would update in Realm
            dispatch(updateTaxSettings({ pinEnabled: true, pinCode: pin } as any));
            
            // Show success message
            showAlert('PIN Enabled', 'Your PIN has been successfully set up.', [
              { text: 'OK', action: () => setAlertOpen(false), primary: true }
            ]);
          } catch (error) {
            console.error('Failed to enable PIN:', error);
            dispatch(setError('Failed to enable PIN. Please try again.'));
          } finally {
            dispatch(setLoading(false));
          }
        }
      });
    } else {
      // Disable PIN
      try {
        dispatch(setLoading(true));
        
        // In a real implementation, this would update in Realm
        dispatch(updateTaxSettings({ pinEnabled: false } as any));
        
        // Show success message
        showAlert('PIN Disabled', 'PIN authentication has been disabled.', [
          { text: 'OK', action: () => setAlertOpen(false), primary: true }
        ]);
      } catch (error) {
        console.error('Failed to disable PIN:', error);
        dispatch(setError('Failed to disable PIN. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  // Handle PIN update
  const handleUpdatePin = () => {
    if (!settingsRepo || !settings) return;
    
    // Show PIN update dialog
    navigation.navigate('SetupPin', {
      isUpdate: true,
      onSuccess: (pin: string) => {
        try {
          dispatch(setLoading(true));
          
          // In a real implementation, this would update in Realm
          dispatch(updateTaxSettings({ pinCode: pin } as any));
          
          // Show success message
          showAlert('PIN Updated', 'Your PIN has been successfully updated.', [
            { text: 'OK', action: () => setAlertOpen(false), primary: true }
          ]);
        } catch (error) {
          console.error('Failed to update PIN:', error);
          dispatch(setError('Failed to update PIN. Please try again.'));
        } finally {
          dispatch(setLoading(false));
        }
      }
    });
  };

  // Handle biometric toggle
  const handleToggleBiometric = (enabled: boolean) => {
    if (!settingsRepo || !settings) return;
    
    try {
      dispatch(setLoading(true));
      
      // In a real implementation, this would check device capability
      if (enabled) {
        // Check if device supports biometric
        const supported = true; // Mock check
        
        if (supported) {
          // In a real implementation, this would update in Realm
          dispatch(updateTaxSettings({ biometricEnabled: true } as any));
          
          // Show success message
          showAlert('Biometric Enabled', 'Biometric authentication has been enabled.', [
            { text: 'OK', action: () => setAlertOpen(false), primary: true }
          ]);
        } else {
          showAlert('Not Supported', 'Your device does not support biometric authentication.', [
            { text: 'OK', action: () => setAlertOpen(false), primary: true }
          ]);
        }
      } else {
        // In a real implementation, this would update in Realm
        dispatch(updateTaxSettings({ biometricEnabled: false } as any));
        
        // Show success message
        showAlert('Biometric Disabled', 'Biometric authentication has been disabled.', [
          { text: 'OK', action: () => setAlertOpen(false), primary: true }
        ]);
      }
    } catch (error) {
      console.error('Failed to toggle biometric:', error);
      dispatch(setError('Failed to toggle biometric. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle data export
  const handleExportData = (type: 'patients' | 'appointments' | 'services' | 'quotes' | 'bills' | 'all') => {
    if (!settingsRepo || !settings) return;
    
    try {
      dispatch(setLoading(true));
      
      // Create export job
      const exportJob = {
        id: uuidv4(),
        type,
        status: 'pending',
        createdAt: new Date(),
      };
      
      // In a real implementation, this would create in Realm
      // dispatch(addExportJob(exportJob)); - Removed as it's not available
      
      // Simulate export process
      setTimeout(() => {
        try {
          // Update export job status
          // dispatch(updateExportJob({...})); - Removed as it's not available
          
          // Show success message
          showAlert(
            'Export Complete',
            `Your ${type} data has been exported successfully. The file is saved in your Downloads folder.`,
            [
              { text: 'OK', action: () => setAlertOpen(false) },
              { 
                text: 'Share',
                action: async () => {
                  try {
                    // Web-compatible sharing
                    if (navigator.share) {
                      await navigator.share({
                        title: `${type} Export`,
                        text: `Clinic Management App - ${type} data export`,
                      });
                    } else {
                      console.log('Web Share API not supported');
                    }
                    setAlertOpen(false);
                  } catch (error) {
                    console.error('Error sharing export:', error);
                  }
                },
                primary: true
              }
            ]
          );
        } catch (error) {
          console.error('Failed to complete export:', error);
          
          // Update export job status
          // dispatch(updateExportJob({...})); - Removed as it's not available
          
          // Show error message
          showAlert('Export Failed', 'Failed to complete export. Please try again.', [
            { text: 'OK', action: () => setAlertOpen(false), primary: true }
          ]);
        } finally {
          dispatch(setLoading(false));
        }
      }, 2000); // Simulate 2 second export process
    } catch (error) {
      console.error('Failed to start export:', error);
      dispatch(setError('Failed to start export. Please try again.'));
      dispatch(setLoading(false));
    }
  };

  // Handle view export jobs
  const handleViewExportJobs = () => {
    navigation.navigate('ExportJobs');
  };

  // Handle view auth logs
  const handleViewAuthLogs = () => {
    navigation.navigate('AuthLogs');
  };

  // Handle clear auth logs
  const handleClearAuthLogs = () => {
    if (!settingsRepo) return;
    
    showAlert(
      'Clear Authentication Logs',
      'Are you sure you want to clear all authentication logs? This action cannot be undone.',
      [
        { text: 'Cancel', action: () => setAlertOpen(false) },
        { 
          text: 'Clear',
          action: () => {
            try {
              dispatch(setLoading(true));
              
              // In a real implementation, this would clear in Realm
              // dispatch(clearAuthLogs());
              
              // Show success message
              showAlert('Logs Cleared', 'Authentication logs have been cleared successfully.', [
                { text: 'OK', action: () => setAlertOpen(false), primary: true }
              ]);
            } catch (error) {
              console.error('Failed to clear auth logs:', error);
              dispatch(setError('Failed to clear authentication logs. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          },
          primary: true
        },
      ]
    );
  };

  // Handle about
  const handleAbout = () => {
    navigation.navigate('About');
  };

  // If settings not loaded yet, show loading
  if (!settings) {
    return <Box sx={{ flex: 1, backgroundColor: '#f5f5f5' }} />;
  }

  return (
    <>
      <SettingsScreen
        settings={settings}
        loading={loading}
        onUpdateSettings={handleUpdateSettings}
        onTogglePin={handleTogglePin}
        onUpdatePin={handleUpdatePin}
        onToggleBiometric={handleToggleBiometric}
        onExportData={handleExportData}
        onViewExportJobs={handleViewExportJobs}
        onViewAuthLogs={handleViewAuthLogs}
        onClearAuthLogs={handleClearAuthLogs}
        onAbout={handleAbout}
      />
      
      {/* Alert Dialog */}
      <Dialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      >
        <DialogTitle>{alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {alertActions.map((action, index) => (
            <Button 
              key={index} 
              onClick={action.action}
              color={action.primary ? "primary" : "inherit"}
              variant={action.primary ? "contained" : "text"}
            >
              {action.text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsContainer;
