import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { 
  updateClinicInfo, 
  updateUserPreferences, 
  updateTaxSettings, 
  updateBackupSettings,
  performBackup,
  resetSettings,
  IClinicInfo,
  IUserPreferences,
  ITaxSettings,
  IBackupSettings
} from '../../store/slices/settingsSlice';
import SettingsLayout from './SettingsLayout';
import ClinicInfoSettings from './ClinicInfoSettings';
import UserPreferencesSettings from './UserPreferencesSettings';
import TaxSettings from './TaxSettings';
import BackupSettings from './BackupSettings';

const SettingsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    clinicInfo, 
    userPreferences, 
    taxSettings, 
    backupSettings, 
    loading, 
    error 
  } = useAppSelector(state => state.settings);
  
  // State to track which settings tab is active
  const [activeTab, setActiveTab] = useState<'clinic' | 'preferences' | 'tax' | 'backup'>('clinic');
  
  // Handle clinic info update
  const handleClinicInfoUpdate = (updatedInfo: Partial<IClinicInfo>) => {
    dispatch(updateClinicInfo(updatedInfo));
  };
  
  // Handle user preferences update
  const handleUserPreferencesUpdate = (updatedPreferences: Partial<IUserPreferences>) => {
    dispatch(updateUserPreferences(updatedPreferences));
  };
  
  // Handle tax settings update
  const handleTaxSettingsUpdate = (updatedTaxSettings: Partial<ITaxSettings>) => {
    dispatch(updateTaxSettings(updatedTaxSettings));
  };
  
  // Handle backup settings update
  const handleBackupSettingsUpdate = (updatedBackupSettings: Partial<IBackupSettings>) => {
    dispatch(updateBackupSettings(updatedBackupSettings));
  };
  
  // Handle manual backup
  const handleManualBackup = () => {
    dispatch(performBackup());
  };
  
  // Handle reset settings
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      dispatch(resetSettings());
    }
  };
  
  return (
    <SettingsLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onResetSettings={handleResetSettings}
      error={error}
    >
      {activeTab === 'clinic' && (
        <ClinicInfoSettings
          clinicInfo={clinicInfo}
          loading={loading}
          onUpdate={handleClinicInfoUpdate}
        />
      )}
      
      {activeTab === 'preferences' && (
        <UserPreferencesSettings
          userPreferences={userPreferences}
          loading={loading}
          onUpdate={handleUserPreferencesUpdate}
        />
      )}
      
      {activeTab === 'tax' && (
        <TaxSettings
          taxSettings={taxSettings}
          loading={loading}
          onUpdate={handleTaxSettingsUpdate}
        />
      )}
      
      {activeTab === 'backup' && (
        <BackupSettings
          backupSettings={backupSettings}
          loading={loading}
          onUpdate={handleBackupSettingsUpdate}
          onManualBackup={handleManualBackup}
        />
      )}
    </SettingsLayout>
  );
};

export default SettingsContainer;
