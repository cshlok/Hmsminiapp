import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, IconButton, useTheme, Badge } from 'react-native-paper';
import { format } from 'date-fns';
import { IAppointment } from '../../models/AppointmentModel';
import { IPatient } from '../../models/PatientModel';

interface AppointmentCardProps {
  appointment: IAppointment;
  patient: IPatient | null;
  onPress: (appointment: IAppointment) => void;
  onEdit: (appointment: IAppointment) => void;
  onDelete: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  patient,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  
  // Format the appointment date and time
  const formattedDate = format(appointment.date, 'EEEE, MMMM dd, yyyy');
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      case 'no-show':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };
  
  // Get status label
  const getStatusLabel = (status: string) => {
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
  
  // Get patient initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      style={styles.card}
      onPress={() => onPress(appointment)}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.timeContainer}>
          <Text variant="titleMedium" style={styles.time}>{appointment.startTime}</Text>
          <Text variant="bodySmall">to {appointment.endTime}</Text>
          <Badge 
            style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}
          >
            {getStatusLabel(appointment.status)}
          </Badge>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.patientContainer}>
          {patient ? (
            <>
              <Avatar.Text 
                size={40} 
                label={getInitials(patient.name)} 
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
              <View style={styles.patientInfo}>
                <Text variant="titleMedium">{patient.name}</Text>
                <Text variant="bodySmall">{patient.age} years • {patient.gender}</Text>
                {appointment.notes && (
                  <Text variant="bodySmall" numberOfLines={1} style={styles.notes}>
                    Notes: {appointment.notes}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <Text variant="bodyMedium">Patient information not available</Text>
          )}
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(appointment)}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(appointment.id)}
            iconColor={theme.colors.error}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  time: {
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  patientContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 10,
  },
  patientInfo: {
    flex: 1,
  },
  notes: {
    marginTop: 4,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  statusBadge: {
    marginTop: 5,
  },
});

export default AppointmentCard;
