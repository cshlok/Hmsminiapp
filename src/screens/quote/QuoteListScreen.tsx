import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { Text, Divider, FAB, useTheme, ActivityIndicator, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import QuoteCard from '../../components/quote/QuoteCard';
import { IQuote } from '../../models/QuoteModel';
import { IPatient } from '../../models/PatientModel';

interface QuoteListScreenProps {
  quotes: IQuote[];
  patients: IPatient[];
  loading: boolean;
  searchQuery: string;
  filterStatus: string | null;
  filterPatientId: string | null;
  onSearch: (query: string) => void;
  onFilterStatus: (status: string | null) => void;
  onFilterPatient: (patientId: string | null) => void;
  onQuotePress: (quote: IQuote) => void;
  onAddQuote: () => void;
  onEditQuote: (quote: IQuote) => void;
  onDeleteQuote: (quoteId: string) => void;
  onConvertQuote?: (quote: IQuote) => void;
}

const QuoteListScreen: React.FC<QuoteListScreenProps> = ({
  quotes,
  patients,
  loading,
  searchQuery,
  filterStatus,
  filterPatientId,
  onSearch,
  onFilterStatus,
  onFilterPatient,
  onQuotePress,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
  onConvertQuote,
}) => {
  const theme = useTheme();
  
  // Get patient name for a quote
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  // Get filtered quotes
  const getFilteredQuotes = () => {
    // Start with all quotes
    let filtered = [...quotes];
    
    // Apply status filter if set
    if (filterStatus) {
      filtered = filtered.filter(quote => quote.status === filterStatus);
    }
    
    // Apply patient filter if set
    if (filterPatientId) {
      filtered = filtered.filter(quote => quote.patientId === filterPatientId);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(quote => {
        const patientName = getPatientName(quote.patientId).toLowerCase();
        return patientName.includes(searchQuery.toLowerCase()) || 
               quote.id.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered;
  };
  
  // Get filtered quotes
  const filteredQuotes = getFilteredQuotes();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Searchbar
          placeholder="Search quotes..."
          onChangeText={onSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <Text variant="bodyMedium" style={styles.filterLabel}>Status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filterStatus === null}
              onPress={() => onFilterStatus(null)}
              style={styles.filterChip}
            >
              All
            </Chip>
            <Chip
              selected={filterStatus === 'draft'}
              onPress={() => onFilterStatus('draft')}
              style={styles.filterChip}
            >
              Draft
            </Chip>
            <Chip
              selected={filterStatus === 'final'}
              onPress={() => onFilterStatus('final')}
              style={styles.filterChip}
            >
              Final
            </Chip>
            <Chip
              selected={filterStatus === 'converted'}
              onPress={() => onFilterStatus('converted')}
              style={styles.filterChip}
            >
              Converted
            </Chip>
            <Chip
              selected={filterStatus === 'cancelled'}
              onPress={() => onFilterStatus('cancelled')}
              style={styles.filterChip}
            >
              Cancelled
            </Chip>
          </ScrollView>
        </View>
        
        <View style={styles.filterContainer}>
          <Text variant="bodyMedium" style={styles.filterLabel}>Patient:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filterPatientId === null}
              onPress={() => onFilterPatient(null)}
              style={styles.filterChip}
            >
              All Patients
            </Chip>
            {patients.map(patient => (
              <Chip
                key={patient.id}
                selected={filterPatientId === patient.id}
                onPress={() => onFilterPatient(patient.id)}
                style={styles.filterChip}
              >
                {patient.firstName} {patient.lastName}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredQuotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No quotes found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery || filterStatus || filterPatientId
              ? 'Try adjusting your search or filters'
              : 'Create a quote to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuoteCard
              quote={item}
              patientName={getPatientName(item.patientId)}
              onPress={onQuotePress}
              onEdit={onEditQuote}
              onDelete={onDeleteQuote}
              onConvert={onConvertQuote}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FAB
        icon="plus"
        label="New Quote"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={onAddQuote}
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
  searchBar: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    right: 16,
    bottom: 16,
  },
});

export default QuoteListScreen;
