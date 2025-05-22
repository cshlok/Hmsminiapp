import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, IconButton, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { IPatient } from '../../models/PatientModel';

interface PatientCardProps {
  patient: IPatient;
  onPress: (patient: IPatient) => void;
  onEdit: (patient: IPatient) => void;
  onDelete: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  
  // Format the last visit date or show 'No visits yet'
  const formattedLastVisit = patient.lastVisit 
    ? format(patient.lastVisit, 'MMM dd, yyyy')
    : 'No visits yet';

  // Get initials for the avatar
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
      onPress={() => onPress(patient)}
    >
      <Card.Content style={styles.cardContent}>
        <Avatar.Text 
          size={50} 
          label={getInitials(patient.name)} 
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        />
        <View style={styles.patientInfo}>
          <Text variant="titleMedium" style={styles.name}>{patient.name}</Text>
          <Text variant="bodyMedium">{patient.age} years • {patient.gender}</Text>
          <Text variant="bodySmall">Last Visit: {formattedLastVisit}</Text>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => onEdit(patient)}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onDelete(patient.id)}
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
  avatar: {
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default PatientCard;
