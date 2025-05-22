import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Card, useTheme } from 'react-native-paper';
import { IPatient } from '../../models/PatientModel';
import { format } from 'date-fns';

interface PatientDetailsScreenProps {
  patient: IPatient;
}

const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({ patient }) => {
  const theme = useTheme();

  // Format the last visit date or show 'No visits yet'
  const formattedLastVisit = patient.lastVisit 
    ? format(patient.lastVisit, 'MMMM dd, yyyy')
    : 'No visits yet';

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.name}>{patient.name}</Text>
          
          <View style={styles.basicInfoContainer}>
            <View style={styles.infoItem}>
              <Text variant="labelMedium" style={styles.label}>Age</Text>
              <Text variant="bodyLarge">{patient.age} years</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text variant="labelMedium" style={styles.label}>Gender</Text>
              <Text variant="bodyLarge">{patient.gender}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text variant="labelMedium" style={styles.label}>Last Visit</Text>
              <Text variant="bodyLarge">{formattedLastVisit}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Phone</Text>
            <Text variant="bodyLarge">{patient.contact}</Text>
          </View>
          
          {patient.email && (
            <View style={styles.detailItem}>
              <Text variant="labelMedium" style={styles.label}>Email</Text>
              <Text variant="bodyLarge">{patient.email}</Text>
            </View>
          )}
          
          {patient.address && (
            <View style={styles.detailItem}>
              <Text variant="labelMedium" style={styles.label}>Address</Text>
              <Text variant="bodyLarge">{patient.address}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Medical Information</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Medical History</Text>
            <Text variant="bodyLarge">
              {patient.medicalHistory || 'No medical history recorded'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Allergies</Text>
            <Text variant="bodyLarge">
              {patient.allergies || 'No allergies recorded'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Medications</Text>
            <Text variant="bodyLarge">
              {patient.medications || 'No medications recorded'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  basicInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoItem: {
    minWidth: '30%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 4,
  },
});

export default PatientDetailsScreen;
