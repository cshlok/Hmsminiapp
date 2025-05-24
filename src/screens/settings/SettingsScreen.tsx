import React from 'react';
import { 
  Typography, 
  Card, 
  Switch, 
  TextField, 
  Button, 
  Divider, 
  useTheme, 
  ToggleButtonGroup, 
  ToggleButton,
  Box,
  Container
} from '@mui/material';
import styled from '@emotion/styled';
import { ISettings } from '../../models/SettingsModel';

interface SettingsScreenProps {
  settings: ISettings;
  loading: boolean;
  onUpdateSettings: (settings: Partial<ISettings>) => void;
  onTogglePin: (enabled: boolean) => void;
  onUpdatePin: () => void;
  onToggleBiometric: (enabled: boolean) => void;
  onExportData: (type: 'patients' | 'appointments' | 'services' | 'quotes' | 'bills' | 'all') => void;
  onViewExportJobs: () => void;
  onViewAuthLogs: () => void;
  onClearAuthLogs: () => void;
  onAbout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  loading,
  onUpdateSettings,
  onTogglePin,
  onUpdatePin,
  onToggleBiometric,
  onExportData,
  onViewExportJobs,
  onViewAuthLogs,
  onClearAuthLogs,
  onAbout,
}) => {
  const theme = useTheme();

  return (
    <ScrollContainer>
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">Clinic Information</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <StyledTextField
            label="Clinic Name"
            value={settings.clinicName}
            onChange={(e) => onUpdateSettings({ clinicName: e.target.value })}
            variant="outlined"
            fullWidth
          />
          
          <StyledTextField
            label="Address"
            value={settings.clinicAddress || ''}
            onChange={(e) => onUpdateSettings({ clinicAddress: e.target.value })}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
          />
          
          <StyledTextField
            label="Phone"
            value={settings.clinicPhone || ''}
            onChange={(e) => onUpdateSettings({ clinicPhone: e.target.value })}
            variant="outlined"
            fullWidth
            type="tel"
          />
          
          <StyledTextField
            label="Email"
            value={settings.clinicEmail || ''}
            onChange={(e) => onUpdateSettings({ clinicEmail: e.target.value })}
            variant="outlined"
            fullWidth
            type="email"
          />
          
          <StyledTextField
            label="Website"
            value={settings.clinicWebsite || ''}
            onChange={(e) => onUpdateSettings({ clinicWebsite: e.target.value })}
            variant="outlined"
            fullWidth
            type="url"
          />
        </CardContent>
      </StyledCard>
      
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">Default Settings</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <StyledTextField
            label="Default Tax Percentage (%)"
            value={String(settings.taxPercentage)}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onUpdateSettings({ taxPercentage: value });
            }}
            variant="outlined"
            fullWidth
            type="number"
            InputProps={{
              endAdornment: <Typography>%</Typography>
            }}
          />
          
          <Label>Default Discount Type</Label>
          <ToggleButtonGroup
            value={settings.defaultDiscountType}
            exclusive
            onChange={(_, value) => onUpdateSettings({ defaultDiscountType: value as 'percentage' | 'fixed' | 'none' })}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="none" sx={{ flex: 1 }}>None</ToggleButton>
            <ToggleButton value="percentage" sx={{ flex: 1 }}>Percentage</ToggleButton>
            <ToggleButton value="fixed" sx={{ flex: 1 }}>Fixed</ToggleButton>
          </ToggleButtonGroup>
          
          {settings.defaultDiscountType !== 'none' && (
            <StyledTextField
              label={settings.defaultDiscountType === 'percentage' ? 'Default Discount (%)' : 'Default Discount Amount'}
              value={String(settings.defaultDiscountValue)}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                onUpdateSettings({ defaultDiscountValue: value });
              }}
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{
                endAdornment: <Typography>{settings.defaultDiscountType === 'percentage' ? '%' : '$'}</Typography>
              }}
            />
          )}
          
          <StyledTextField
            label="Default Due Days"
            value={String(settings.defaultDueDays)}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 30;
              onUpdateSettings({ defaultDueDays: value });
            }}
            variant="outlined"
            fullWidth
            type="number"
            InputProps={{
              endAdornment: <Typography>days</Typography>
            }}
          />
          
          <StyledTextField
            label="Currency"
            value={settings.currency}
            onChange={(e) => onUpdateSettings({ currency: e.target.value })}
            variant="outlined"
            fullWidth
          />
        </CardContent>
      </StyledCard>
      
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">Appearance</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <Label>Theme</Label>
          <ToggleButtonGroup
            value={settings.theme}
            exclusive
            onChange={(_, value) => onUpdateSettings({ theme: value as 'light' | 'dark' | 'system' })}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="light" sx={{ flex: 1 }}>Light</ToggleButton>
            <ToggleButton value="dark" sx={{ flex: 1 }}>Dark</ToggleButton>
            <ToggleButton value="system" sx={{ flex: 1 }}>System</ToggleButton>
          </ToggleButtonGroup>
          
          <Label>Date Format</Label>
          <ToggleButtonGroup
            value={settings.dateFormat}
            exclusive
            onChange={(_, value) => onUpdateSettings({ dateFormat: value })}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="MM/DD/YYYY" sx={{ flex: 1 }}>MM/DD/YYYY</ToggleButton>
            <ToggleButton value="DD/MM/YYYY" sx={{ flex: 1 }}>DD/MM/YYYY</ToggleButton>
            <ToggleButton value="YYYY-MM-DD" sx={{ flex: 1 }}>YYYY-MM-DD</ToggleButton>
          </ToggleButtonGroup>
          
          <Label>Time Format</Label>
          <ToggleButtonGroup
            value={settings.timeFormat}
            exclusive
            onChange={(_, value) => onUpdateSettings({ timeFormat: value })}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="12h" sx={{ flex: 1 }}>12-hour</ToggleButton>
            <ToggleButton value="24h" sx={{ flex: 1 }}>24-hour</ToggleButton>
          </ToggleButtonGroup>
          
          <Label>Language</Label>
          <ToggleButtonGroup
            value={settings.language}
            exclusive
            onChange={(_, value) => onUpdateSettings({ language: value })}
            sx={{ mb: 2, width: '100%' }}
          >
            <ToggleButton value="en" sx={{ flex: 1 }}>English</ToggleButton>
            <ToggleButton value="es" sx={{ flex: 1 }}>Spanish</ToggleButton>
            <ToggleButton value="fr" sx={{ flex: 1 }}>French</ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </StyledCard>
      
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">Security</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <SettingRow>
            <Typography>PIN Authentication</Typography>
            <Switch
              checked={settings.pinEnabled}
              onChange={(_, checked) => onTogglePin(checked)}
            />
          </SettingRow>
          
          {settings.pinEnabled && (
            <StyledButton
              variant="outlined"
              onClick={onUpdatePin}
            >
              Change PIN
            </StyledButton>
          )}
          
          <SettingRow>
            <Typography>Biometric Authentication</Typography>
            <Switch
              checked={settings.biometricEnabled}
              onChange={(_, checked) => onToggleBiometric(checked)}
            />
          </SettingRow>
          
          <StyledButton
            variant="outlined"
            onClick={onViewAuthLogs}
          >
            View Authentication Logs
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            onClick={onClearAuthLogs}
          >
            Clear Authentication Logs
          </StyledButton>
        </CardContent>
      </StyledCard>
      
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">Data Export</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <Description>
            Export your data to Excel format for backup or analysis. Choose what data to export:
          </Description>
          
          <StyledButton
            variant="outlined"
            onClick={() => onExportData('patients')}
            disabled={loading}
          >
            Export Patients
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            onClick={() => onExportData('appointments')}
            disabled={loading}
          >
            Export Appointments
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            onClick={() => onExportData('services')}
            disabled={loading}
          >
            Export Services
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            onClick={() => onExportData('quotes')}
            disabled={loading}
          >
            Export Quotes
          </StyledButton>
          
          <StyledButton
            variant="outlined"
            onClick={() => onExportData('bills')}
            disabled={loading}
          >
            Export Bills
          </StyledButton>
          
          <StyledButton
            variant="contained"
            onClick={() => onExportData('all')}
            disabled={loading}
          >
            Export All Data
          </StyledButton>
          
          <StyledButton
            variant="text"
            onClick={onViewExportJobs}
          >
            View Export History
          </StyledButton>
        </CardContent>
      </StyledCard>
      
      <StyledCard>
        <CardContent>
          <SectionTitle variant="h6">About</SectionTitle>
          <Divider sx={{ my: 2 }} />
          
          <StyledButton
            variant="outlined"
            onClick={onAbout}
          >
            About This App
          </StyledButton>
        </CardContent>
      </StyledCard>
    </ScrollContainer>
  );
};

// Styled components
const ScrollContainer = styled(Container)`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
  max-width: 800px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const SectionTitle = styled(Typography)`
  font-weight: bold;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;

const Label = styled(Typography)`
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
`;

const SettingRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 12px;
  width: 100%;
`;

const Description = styled(Typography)`
  margin-bottom: 16px;
  color: #666;
`;

export default SettingsScreen;
