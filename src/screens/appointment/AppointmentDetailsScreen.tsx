import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Card, useTheme, Chip } from 'react-native-paper';
import { IAppointment } from '../../store/slices/appointmentSlice'; // Use slice definition
import { IPatient } from '../../store/slices/patientSlice'; // Use slice definition
import { format, differenceInYears } from 'date-fns';

interface AppointmentDetailsScreenProps {
  appointment: IAppointment;
  patient: IPatient | null;
}

const AppointmentDetailsScreen: React.FC<AppointmentDetailsScreenProps> = ({ 
  appointment, 
  patient 
}) => {
  const theme = useTheme();

  // Format the appointment date
  const formattedDate = format(new Date(appointment.date), 'EEEE, MMMM dd, yyyy');
  
  // Calculate age
  const calculateAge = (dob: string): number | null => {
    try {
      return differenceInYears(new Date(), new Date(dob));
    } catch (e) {
      return null;
    }
  };
  const patientAge = patient?.dateOfBirth ? calculateAge(patient.dateOfBirth) : null;

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success; // Assuming theme has success color
      case 'cancelled':
        return theme.colors.error;
      case 'no-show':
        return theme.colors.warning; // Assuming theme has warning color
      default:
        return theme.colors.primary;
    }
  };
  
  // Get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no-show':
        return 'No Show';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.title}>{appointment.title || 'Appointment Details'}</Text>
          
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) }]}
          >
            {getStatusLabel(appointment.status)}
          </Chip>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>Date</Text>
            <Text variant="bodyLarge">{formattedDate}</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Text variant="labelMedium" style={styles.label}>Start Time</Text>
              <Text variant="bodyLarge">{appointment.startTime}</Text>
            </View>
            
            <View style={styles.timeItem}>
              <Text variant="labelMedium" style={styles.label}>End Time</Text>
              <Text variant="bodyLarge">{appointment.endTime}</Text>
            </View>
            
            {/* Duration is not directly in slice IAppointment, maybe calculate? */}
            {/* <View style={styles.timeItem}>
              <Text variant="labelMedium" style={styles.label}>Duration</Text>
              <Text variant="bodyLarge">{appointment.duration} minutes</Text>
            </View> */}
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Patient Information</Text>
          <Divider style={styles.divider} />
          
          {patient ? (
            <>
              <View style={styles.detailItem}>
                <Text variant="labelMedium" style={styles.label}>Name</Text>
                <Text variant="bodyLarge">{`${patient.firstName} ${patient.lastName}`}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="labelMedium" style={styles.label}>Age & Gender</Text>
                <Text variant="bodyLarge">
                  {patientAge !== null ? `${patientAge} years` : 'N/A'} • {patient.gender}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text variant="labelMedium" style={styles.label}>Phone</Text>
                <Text variant="bodyLarge">{patient.phone}</Text>
              </View>
              
              {patient.email && (
                <View style={styles.detailItem}>
                  <Text variant="labelMedium" style={styles.label}>Email</Text>
                  <Text variant="bodyLarge">{patient.email}</Text>
                </View>
              )}
            </>
          ) : (
            <Text variant="bodyMedium">Patient information not available</Text>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Notes</Text>
          <Divider style={styles.divider} />
          
          <Text variant="bodyLarge">
            {appointment.notes || 'No notes for this appointment'}
          </Text>
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
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  timeItem: {
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
  label: {
    color: '#666',
    marginBottom: 4,
  },
});

export default AppointmentDetailsScreen;
