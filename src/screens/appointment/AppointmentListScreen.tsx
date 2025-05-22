import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { Text, Divider, FAB, useTheme, ActivityIndicator, Chip, Searchbar } from 'react-native-paper';
import { format } from 'date-fns';
import AppointmentCalendar from '../../components/appointment/AppointmentCalendar';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import { IAppointment } from '../../models/AppointmentModel';
import { IPatient } from '../../models/PatientModel';

interface AppointmentListScreenProps {
  appointments: IAppointment[];
  patients: IPatient[];
  loading: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onAppointmentPress: (appointment: IAppointment) => void;
  onAddAppointment: () => void;
  onEditAppointment: (appointment: IAppointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onFilterStatus: (status: string | null) => void;
  filterStatus: string | null;
}

const AppointmentListScreen: React.FC<AppointmentListScreenProps> = ({
  appointments,
  patients,
  loading,
  selectedDate,
  onDateSelect,
  onAppointmentPress,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onFilterStatus,
  filterStatus,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter appointments for the selected date
  const getFilteredAppointments = () => {
    // Start with appointments for the selected date
    let filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    // Apply status filter if set
    if (filterStatus) {
      filtered = filtered.filter(appointment => appointment.status === filterStatus);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        if (patient) {
          return patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }
    
    // Sort by start time
    return filtered.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };
  
  // Get patient data for an appointment
  const getPatientForAppointment = (patientId: string) => {
    return patients.find(patient => patient.id === patientId) || null;
  };
  
  // Format the selected date for display
  const formattedSelectedDate = format(selectedDate, 'EEEE, MMMM dd, yyyy');
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Get filtered appointments
  const filteredAppointments = getFilteredAppointments();

  return (
    <View style={styles.container}>
      <AppointmentCalendar
        appointments={appointments}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
      />
      
      <View style={styles.headerContainer}>
        <Text variant="titleLarge" style={styles.dateHeader}>
          {formattedSelectedDate}
        </Text>
        
        <Searchbar
          placeholder="Search patients..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <Text variant="bodyMedium" style={styles.filterLabel}>Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filterStatus === null}
              onPress={() => onFilterStatus(null)}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={filterStatus === 'scheduled'}
              onPress={() => onFilterStatus('scheduled')}
              style={styles.filterChip}
            >
              Scheduled
            </Chip>
            <Chip
              selected={filterStatus === 'completed'}
              onPress={() => onFilterStatus('completed')}
              style={styles.filterChip}
            >
              Completed
            </Chip>
            <Chip
              selected={filterStatus === 'cancelled'}
              onPress={() => onFilterStatus('cancelled')}
              style={styles.filterChip}
            >
              Cancelled
            </Chip>
            <Chip
              selected={filterStatus === 'no-show'}
              onPress={() => onFilterStatus('no-show')}
              style={styles.filterChip}
            >
              No Show
            </Chip>
          </ScrollView>
        </View>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No appointments found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery || filterStatus
              ? 'Try adjusting your search or filters'
              : 'Add an appointment to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              patient={getPatientForAppointment(item.patientId)}
              onPress={onAppointmentPress}
              onEdit={onEditAppointment}
              onDelete={onDeleteAppointment}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={onAddAppointment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
  },
  dateHeader: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    marginRight: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AppointmentListScreen;
