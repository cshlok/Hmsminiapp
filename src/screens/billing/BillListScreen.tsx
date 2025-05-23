import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView } from 'react-native';
import { Text, Divider, FAB, useTheme, ActivityIndicator, Chip, Searchbar, SegmentedButtons, Button } from 'react-native-paper';
import BillCard from '../../components/billing/BillCard';
import { IBill } from '../../models/BillingModel';
import { IPatient } from '../../models/PatientModel';
import { format, subDays, subMonths } from 'date-fns';

interface BillListScreenProps {
  bills: IBill[];
  patients: IPatient[];
  loading: boolean;
  searchQuery: string;
  filterStatus: string | null;
  filterPatientId: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onSearch: (query: string) => void;
  onFilterStatus: (status: string | null) => void;
  onFilterPatient: (patientId: string | null) => void;
  onFilterDateRange: (range: { startDate: Date | null, endDate: Date | null }) => void;
  onBillPress: (bill: IBill) => void;
  onAddBill: () => void;
  onEditBill: (bill: IBill) => void;
  onDeleteBill: (billId: string) => void;
  onAddPayment: (bill: IBill) => void;
}

const BillListScreen: React.FC<BillListScreenProps> = ({
  bills,
  patients,
  loading,
  searchQuery,
  filterStatus,
  filterPatientId,
  dateRange,
  onSearch,
  onFilterStatus,
  onFilterPatient,
  onFilterDateRange,
  onBillPress,
  onAddBill,
  onEditBill,
  onDeleteBill,
  onAddPayment,
}) => {
  const theme = useTheme();
  
  // Get patient name for a bill
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  // Get filtered bills
  const getFilteredBills = () => {
    // Start with all bills
    let filtered = [...bills];
    
    // Apply status filter if set
    if (filterStatus) {
      filtered = filtered.filter(bill => bill.status === filterStatus);
    }
    
    // Apply patient filter if set
    if (filterPatientId) {
      filtered = filtered.filter(bill => bill.patientId === filterPatientId);
    }
    
    // Apply date range filter if set
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= dateRange.startDate && billDate <= dateRange.endDate;
      });
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(bill => {
        const patientName = getPatientName(bill.patientId).toLowerCase();
        return patientName.includes(searchQuery.toLowerCase()) || 
               bill.id.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    return filtered;
  };
  
  // Handle date range selection
  const handleDateRangeSelect = (range: string) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    let startDate: Date | null = null;
    
    switch (range) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start of today
        break;
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'quarter':
        startDate = subMonths(today, 3);
        break;
      case 'year':
        startDate = subMonths(today, 12);
        break;
      case 'all':
      default:
        startDate = null;
        break;
    }
    
    onFilterDateRange({
      startDate,
      endDate: range === 'all' ? null : today,
    });
  };
  
  // Get filtered bills
  const filteredBills = getFilteredBills();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Searchbar
          placeholder="Search bills..."
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
              selected={filterStatus === 'unpaid'}
              onPress={() => onFilterStatus('unpaid')}
              style={styles.filterChip}
            >
              Unpaid
            </Chip>
            <Chip
              selected={filterStatus === 'partially_paid'}
              onPress={() => onFilterStatus('partially_paid')}
              style={styles.filterChip}
            >
              Partially Paid
            </Chip>
            <Chip
              selected={filterStatus === 'paid'}
              onPress={() => onFilterStatus('paid')}
              style={styles.filterChip}
            >
              Paid
            </Chip>
            <Chip
              selected={filterStatus === 'overdue'}
              onPress={() => onFilterStatus('overdue')}
              style={styles.filterChip}
            >
              Overdue
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
        
        <View style={styles.filterContainer}>
          <Text variant="bodyMedium" style={styles.filterLabel}>Date Range:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={!dateRange.startDate && !dateRange.endDate}
              onPress={() => handleDateRangeSelect('all')}
              style={styles.filterChip}
            >
              All Time
            </Chip>
            <Chip
              selected={dateRange.startDate?.toDateString() === new Date().toDateString()}
              onPress={() => handleDateRangeSelect('today')}
              style={styles.filterChip}
            >
              Today
            </Chip>
            <Chip
              selected={dateRange.startDate && dateRange.endDate && 
                       ((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 7}
              onPress={() => handleDateRangeSelect('week')}
              style={styles.filterChip}
            >
              Last 7 Days
            </Chip>
            <Chip
              selected={dateRange.startDate && dateRange.endDate && 
                       ((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 30}
              onPress={() => handleDateRangeSelect('month')}
              style={styles.filterChip}
            >
              Last 30 Days
            </Chip>
            <Chip
              selected={dateRange.startDate && dateRange.endDate && 
                       ((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 90}
              onPress={() => handleDateRangeSelect('quarter')}
              style={styles.filterChip}
            >
              Last 3 Months
            </Chip>
            <Chip
              selected={dateRange.startDate && dateRange.endDate && 
                       ((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) <= 365}
              onPress={() => handleDateRangeSelect('year')}
              style={styles.filterChip}
            >
              Last Year
            </Chip>
          </ScrollView>
        </View>
        
        {(searchQuery || filterStatus || filterPatientId || (dateRange.startDate && dateRange.endDate)) && (
          <Button 
            mode="text" 
            icon="filter-remove" 
            onPress={() => {
              onSearch('');
              onFilterStatus(null);
              onFilterPatient(null);
              onFilterDateRange({ startDate: null, endDate: null });
            }}
            style={styles.clearFiltersButton}
          >
            Clear All Filters
          </Button>
        )}
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredBills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">No bills found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {searchQuery || filterStatus || filterPatientId || (dateRange.startDate && dateRange.endDate)
              ? 'Try adjusting your search or filters'
              : 'Create a bill to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BillCard
              bill={item}
              patientName={getPatientName(item.patientId)}
              onPress={onBillPress}
              onEdit={onEditBill}
              onDelete={onDeleteBill}
              onAddPayment={onAddPayment}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <FAB
        icon="plus"
        label="New Bill"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={onAddBill}
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
  clearFiltersButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
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

export default BillListScreen;
