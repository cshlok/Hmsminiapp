import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Switch, TextInput, Button, Divider, useTheme, SegmentedButtons } from 'react-native-paper';
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
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Clinic Information</Text>
          <Divider style={styles.divider} />
          
          <TextInput
            label="Clinic Name"
            value={settings.clinicName}
            onChangeText={(text) => onUpdateSettings({ clinicName: text })}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Address"
            value={settings.clinicAddress || ''}
            onChangeText={(text) => onUpdateSettings({ clinicAddress: text })}
            style={styles.input}
            mode="outlined"
            multiline
          />
          
          <TextInput
            label="Phone"
            value={settings.clinicPhone || ''}
            onChangeText={(text) => onUpdateSettings({ clinicPhone: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Email"
            value={settings.clinicEmail || ''}
            onChangeText={(text) => onUpdateSettings({ clinicEmail: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          
          <TextInput
            label="Website"
            value={settings.clinicWebsite || ''}
            onChangeText={(text) => onUpdateSettings({ clinicWebsite: text })}
            style={styles.input}
            mode="outlined"
            keyboardType="url"
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Default Settings</Text>
          <Divider style={styles.divider} />
          
          <TextInput
            label="Default Tax Percentage (%)"
            value={String(settings.taxPercentage)}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onUpdateSettings({ taxPercentage: value });
            }}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            right={<TextInput.Affix text="%" />}
          />
          
          <Text style={styles.label}>Default Discount Type</Text>
          <SegmentedButtons
            value={settings.defaultDiscountType}
            onValueChange={(value) => onUpdateSettings({ defaultDiscountType: value as 'percentage' | 'fixed' | 'none' })}
            buttons={[
              { value: 'none', label: 'None' },
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed' },
            ]}
            style={styles.segmentedButtons}
          />
          
          {settings.defaultDiscountType !== 'none' && (
            <TextInput
              label={settings.defaultDiscountType === 'percentage' ? 'Default Discount (%)' : 'Default Discount Amount'}
              value={String(settings.defaultDiscountValue)}
              onChangeText={(text) => {
                const value = parseFloat(text) || 0;
                onUpdateSettings({ defaultDiscountValue: value });
              }}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              right={settings.defaultDiscountType === 'percentage' ? <TextInput.Affix text="%" /> : <TextInput.Affix text="$" />}
            />
          )}
          
          <TextInput
            label="Default Due Days"
            value={String(settings.defaultDueDays)}
            onChangeText={(text) => {
              const value = parseInt(text) || 30;
              onUpdateSettings({ defaultDueDays: value });
            }}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            right={<TextInput.Affix text="days" />}
          />
          
          <TextInput
            label="Currency"
            value={settings.currency}
            onChangeText={(text) => onUpdateSettings({ currency: text })}
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Appearance</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.label}>Theme</Text>
          <SegmentedButtons
            value={settings.theme}
            onValueChange={(value) => onUpdateSettings({ theme: value as 'light' | 'dark' | 'system' })}
            buttons={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.label}>Date Format</Text>
          <SegmentedButtons
            value={settings.dateFormat}
            onValueChange={(value) => onUpdateSettings({ dateFormat: value })}
            buttons={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.label}>Time Format</Text>
          <SegmentedButtons
            value={settings.timeFormat}
            onValueChange={(value) => onUpdateSettings({ timeFormat: value })}
            buttons={[
              { value: '12h', label: '12-hour' },
              { value: '24h', label: '24-hour' },
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.label}>Language</Text>
          <SegmentedButtons
            value={settings.language}
            onValueChange={(value) => onUpdateSettings({ language: value })}
            buttons={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Security</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Text>PIN Authentication</Text>
            <Switch
              value={settings.pinEnabled}
              onValueChange={onTogglePin}
            />
          </View>
          
          {settings.pinEnabled && (
            <Button
              mode="outlined"
              onPress={onUpdatePin}
              style={styles.button}
            >
              Change PIN
            </Button>
          )}
          
          <View style={styles.settingRow}>
            <Text>Biometric Authentication</Text>
            <Switch
              value={settings.biometricEnabled}
              onValueChange={onToggleBiometric}
            />
          </View>
          
          <Button
            mode="outlined"
            onPress={onViewAuthLogs}
            style={styles.button}
          >
            View Authentication Logs
          </Button>
          
          <Button
            mode="outlined"
            onPress={onClearAuthLogs}
            style={styles.button}
          >
            Clear Authentication Logs
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Data Export</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.description}>
            Export your data to Excel format for backup or analysis. Choose what data to export:
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => onExportData('patients')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Patients
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => onExportData('appointments')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Appointments
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => onExportData('services')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Services
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => onExportData('quotes')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Quotes
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => onExportData('bills')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export Bills
          </Button>
          
          <Button
            mode="contained"
            onPress={() => onExportData('all')}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Export All Data
          </Button>
          
          <Button
            mode="text"
            onPress={onViewExportJobs}
            style={styles.button}
          >
            View Export History
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>About</Text>
          <Divider style={styles.divider} />
          
          <Button
            mode="outlined"
            onPress={onAbout}
            style={styles.button}
          >
            About This App
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
});

export default SettingsScreen;
