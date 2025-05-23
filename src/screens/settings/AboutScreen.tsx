import React from 'react';
import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { Text, Card, Divider, Button, List, Avatar, useTheme } from 'react-native-paper';

const AboutScreen = () => {
  const theme = useTheme();

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon size={80} icon="medical-bag" style={{ backgroundColor: theme.colors.primary }} />
          <Text variant="headlineMedium" style={styles.title}>Clinic Management App</Text>
          <Text variant="bodyLarge" style={styles.version}>Version 1.0.0</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>About This App</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.paragraph}>
            The Clinic Management App is designed for small clinics and solo practitioners to efficiently manage patients, 
            appointments, services, quotes, and billing in one integrated solution.
          </Text>
          
          <Text style={styles.paragraph}>
            This app works completely offline, storing all your data securely on your device. 
            No internet connection is required, ensuring your practice can run smoothly anywhere, anytime.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Features</Text>
          <Divider style={styles.divider} />
          
          <List.Item
            title="Patient Management"
            description="Add, edit, and manage patient profiles with medical history"
            left={props => <List.Icon {...props} icon="account-multiple" />}
          />
          
          <List.Item
            title="Appointment Scheduling"
            description="Book and manage appointments with calendar view"
            left={props => <List.Icon {...props} icon="calendar" />}
          />
          
          <List.Item
            title="Service Management"
            description="Create and organize services with custom pricing"
            left={props => <List.Icon {...props} icon="medical-bag" />}
          />
          
          <List.Item
            title="Quote Generator"
            description="Create professional quotes with automatic calculations"
            left={props => <List.Icon {...props} icon="file-document-outline" />}
          />
          
          <List.Item
            title="Billing System"
            description="Generate invoices and track payments"
            left={props => <List.Icon {...props} icon="cash-register" />}
          />
          
          <List.Item
            title="Data Export"
            description="Export your data to Excel format for backup or analysis"
            left={props => <List.Icon {...props} icon="export" />}
          />
          
          <List.Item
            title="Security"
            description="Protect your data with PIN or biometric authentication"
            left={props => <List.Icon {...props} icon="shield-lock" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Privacy & Security</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Your data never leaves your device unless you explicitly export it. 
            We do not collect, store, or transmit any of your clinic or patient data.
          </Text>
          
          <Text style={styles.paragraph}>
            For additional security, you can enable PIN or biometric authentication 
            to prevent unauthorized access to the app.
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => handleOpenWebsite('https://example.com/privacy-policy')}
            style={styles.button}
          >
            Privacy Policy
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Support</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.paragraph}>
            If you need assistance or have any questions about the app, 
            please contact our support team.
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => handleOpenWebsite('mailto:support@example.com')}
            style={styles.button}
          >
            Contact Support
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => handleOpenWebsite('https://example.com/help')}
            style={styles.button}
          >
            Help Center
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Clinic Management App</Text>
        <Text style={styles.footerText}>All Rights Reserved</Text>
      </View>
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
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  version: {
    marginTop: 8,
    color: '#666',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
  },
  button: {
    marginBottom: 12,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    marginBottom: 4,
  },
});

export default AboutScreen;
