import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Searchbar, Button, Text, FAB, Divider, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSearchQuery, setSortBy, setSortOrder } from '../../store/slices/patientSlice';
import PatientCard from '../../components/patient/PatientCard';
import { IPatient } from '../../models/PatientModel';

interface PatientListScreenProps {
  navigation: {navigate: (screen: string, params?: any) => void};
  patients: IPatient[];
  loading: boolean;
  onPatientPress: (patient: IPatient) => void;
  onAddPatient: () => void;
  onEditPatient: (patient: IPatient) => void;
  onDeletePatient: (patientId: string) => void;
}

const PatientListScreen: React.FC<PatientListScreenProps> = ({
  navigation,
  patients,
  loading,
  onPatientPress,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { searchQuery, sortBy, sortOrder } = useSelector((state: RootState) => state.patient);
  const [filteredPatients, setFilteredPatients] = useState<IPatient[]>([]);

  // Filter and sort patients based on search query and sort options
  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'lastVisit') {
        // Handle cases where lastVisit might be undefined
        if (!a.lastVisit) return sortOrder === 'asc' ? -1 : 1;
        if (!b.lastVisit) return sortOrder === 'asc' ? 1 : -1;
        
        return sortOrder === 'asc' 
          ? a.lastVisit.getTime() - b.lastVisit.getTime()
          : b.lastVisit.getTime() - a.lastVisit.getTime();
      }
      return 0;
    });
    
    setFilteredPatients(result);
  }, [patients, searchQuery, sortBy, sortOrder]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const toggleSortBy = (newSortBy: 'name' | 'lastVisit') => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same sort option
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new sort by and default to ascending order
      dispatch(setSortBy(newSortBy));
      dispatch(setSortOrder('asc'));
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search patients..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.sortContainer}>
        <Text variant="bodyMedium" style={styles.sortLabel}>Sort by:</Text>
        <Chip
          selected={sortBy === 'name'}
          onPress={() => toggleSortBy('name')}
          style={styles.chip}
          icon={sortBy === 'name' ? (sortOrder === 'asc' ? 'arrow-up' : 'arrow-down') : undefined}
        >
          Name
        </Chip>
        <Chip
          selected={sortBy === 'lastVisit'}
          onPress={() => toggleSortBy('lastVisit')}
          style={styles.chip}
          icon={sortBy === 'lastVisit' ? (sortOrder === 'asc' ? 'arrow-up' : 'arrow-down') : undefined}
        >
          Last Visit
        </Chip>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredPatients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No patients found</Text>
          {searchQuery ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          ) : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              Add your first patient to get started
            </Text>
          )}
          <Button 
            mode="contained" 
            onPress={onAddPatient}
            style={styles.addButton}
          >
            Add New Patient
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={onPatientPress}
              onEdit={onEditPatient}
              onDelete={onDeletePatient}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {filteredPatients.length > 0 && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={onAddPatient}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sortLabel: {
    marginRight: 8,
  },
  chip: {
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
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PatientListScreen;
