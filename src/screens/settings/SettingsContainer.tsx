import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  setSettings,
  updateSettings,
  setLoading,
  setError,
  addExportJob,
  updateExportJob,
  setAuthenticated,
} from '../../store/slices/settingsSlice';
import { SettingsRepository } from '../../storage/SettingsRepository';
import SettingsScreen from './SettingsScreen';
import { v4 as uuidv4 } from 'uuid';

const SettingsContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state: RootState) => state.settings);
  const [settingsRepo, setSettingsRepo] = useState<SettingsRepository | null>(null);

  // Initialize repository and load settings
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new SettingsRepository(null);
        setSettingsRepo(repository);
        
        // Initialize settings if not exists
        // In a real implementation, this would fetch from Realm
        const initialSettings = repository.initializeSettings();
        dispatch(setSettings(initialSettings));
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
      dispatch(updateSettings(updatedSettings));
      
      // Show success message
      Alert.alert('Settings Updated', 'Your settings have been successfully updated.');
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
            dispatch(updateSettings({ pinEnabled: true, pinCode: pin }));
            
            // Show success message
            Alert.alert('PIN Enabled', 'Your PIN has been successfully set up.');
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
        dispatch(updateSettings({ pinEnabled: false }));
        
        // Show success message
        Alert.alert('PIN Disabled', 'PIN authentication has been disabled.');
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
          dispatch(updateSettings({ pinCode: pin }));
          
          // Show success message
          Alert.alert('PIN Updated', 'Your PIN has been successfully updated.');
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
          dispatch(updateSettings({ biometricEnabled: true }));
          
          // Show success message
          Alert.alert('Biometric Enabled', 'Biometric authentication has been enabled.');
        } else {
          Alert.alert('Not Supported', 'Your device does not support biometric authentication.');
        }
      } else {
        // In a real implementation, this would update in Realm
        dispatch(updateSettings({ biometricEnabled: false }));
        
        // Show success message
        Alert.alert('Biometric Disabled', 'Biometric authentication has been disabled.');
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
      dispatch(addExportJob(exportJob));
      
      // Simulate export process
      setTimeout(() => {
        try {
          // Update export job status
          dispatch(updateExportJob({
            id: exportJob.id,
            status: 'completed',
            filePath: `/storage/emulated/0/Download/clinic_${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`,
          }));
          
          // Show success message
          Alert.alert(
            'Export Complete',
            `Your ${type} data has been exported successfully. The file is saved in your Downloads folder.`,
            [
              { text: 'OK' },
              { 
                text: 'Share',
                onPress: async () => {
                  try {
                    await Share.share({
                      message: `Clinic Management App - ${type} data export`,
                      title: `${type} Export`,
                    });
                  } catch (error) {
                    console.error('Error sharing export:', error);
                  }
                }
              }
            ]
          );
        } catch (error) {
          console.error('Failed to complete export:', error);
          
          // Update export job status
          dispatch(updateExportJob({
            id: exportJob.id,
            status: 'failed',
            error: 'Failed to complete export. Please try again.',
          }));
          
          // Show error message
          Alert.alert('Export Failed', 'Failed to complete export. Please try again.');
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
    
    Alert.alert(
      'Clear Authentication Logs',
      'Are you sure you want to clear all authentication logs? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            try {
              dispatch(setLoading(true));
              
              // In a real implementation, this would clear in Realm
              // dispatch(clearAuthLogs());
              
              // Show success message
              Alert.alert('Logs Cleared', 'Authentication logs have been cleared successfully.');
            } catch (error) {
              console.error('Failed to clear auth logs:', error);
              dispatch(setError('Failed to clear authentication logs. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          }
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
    return <View style={styles.container} />;
  }

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SettingsContainer;
