import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { 
  setBills,
  setSelectedBill,
  setLoading,
  setError,
  addBill,
  updateBill,
  deleteBill,
  addPayment,
  deletePayment,
  setFilterStatus,
  setFilterPatientId,
  setSearchQuery,
  setDateRange,
  clearFilters
} from '../../store/slices/billingSlice';
import { BillingRepository } from '../../storage/BillingRepository';
import { IBill, IPayment } from '../../models/BillingModel';
import BillListScreen from './BillListScreen';

const BillListContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    bills, 
    loading, 
    error, 
    searchQuery, 
    filterStatus, 
    filterPatientId,
    dateRange
  } = useSelector((state: RootState) => state.billing);
  const { patients } = useSelector((state: RootState) => state.patient);
  const [billingRepo, setBillingRepo] = useState<BillingRepository | null>(null);

  // Initialize repository and load bills
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new BillingRepository(null);
        setBillingRepo(repository);
        
        // Load all bills
        // In a real implementation, this would fetch from Realm
        // For now, we'll just set empty array
        dispatch(setBills([]));
      } catch (error) {
        console.error('Failed to initialize billing repository:', error);
        dispatch(setError('Failed to load bills. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRepository();
  }, [dispatch]);

  // Handle bill selection
  const handleBillPress = (bill: IBill) => {
    dispatch(setSelectedBill(bill));
    navigation.navigate('BillDetails', { 
      bill,
      patientName: getPatientName(bill.patientId)
    });
  };

  // Get patient name for a bill
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  // Navigate to add bill screen
  const handleAddBill = () => {
    if (patients.length === 0) {
      Alert.alert(
        'No Patients',
        'You need to add at least one patient before creating a bill.',
        [
          { text: 'OK' }
        ]
      );
      return;
    }
    
    navigation.navigate('AddEditBill', { 
      patients,
      onSave: handleSaveBill
    });
  };

  // Navigate to edit bill screen
  const handleEditBill = (bill: IBill) => {
    if (bill.status === 'cancelled') {
      Alert.alert(
        'Cannot Edit',
        'This bill cannot be edited because it has been cancelled.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('AddEditBill', { 
      bill,
      patients,
      onSave: handleSaveBill
    });
  };

  // Save new or updated bill
  const handleSaveBill = (billData: IBill) => {
    if (!billingRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new bill or an update
      const existingBill = bills.find(b => b.id === billData.id);
      
      if (existingBill) {
        // Update existing bill
        // In a real implementation, this would update in Realm
        dispatch(updateBill(billData));
      } else {
        // Create new bill
        // In a real implementation, this would create in Realm
        const newBill = {
          ...billData,
          id: uuidv4(), // Ensure unique ID
        };
        dispatch(addBill(newBill));
      }
    } catch (error) {
      console.error('Failed to save bill:', error);
      dispatch(setError('Failed to save bill. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete bill with confirmation
  const handleDeleteBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    
    if (bill && bill.status === 'cancelled') {
      Alert.alert(
        'Cannot Delete',
        'This bill cannot be deleted because it has been cancelled.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (!billingRepo) return;
            
            try {
              dispatch(setLoading(true));
              // In a real implementation, this would delete from Realm
              dispatch(deleteBill(billId));
            } catch (error) {
              console.error('Failed to delete bill:', error);
              dispatch(setError('Failed to delete bill. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          }
        },
      ]
    );
  };

  // Navigate to add payment screen
  const handleAddPayment = (bill: IBill) => {
    if (bill.status === 'paid' || bill.status === 'cancelled') {
      Alert.alert(
        'Cannot Add Payment',
        'This bill cannot receive payments because it is already paid or cancelled.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('BillDetails', { 
      bill,
      patientName: getPatientName(bill.patientId)
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  // Handle filter by status
  const handleFilterStatus = (status: string | null) => {
    dispatch(setFilterStatus(status));
  };

  // Handle filter by patient
  const handleFilterPatient = (patientId: string | null) => {
    dispatch(setFilterPatientId(patientId));
  };

  // Handle filter by date range
  const handleFilterDateRange = (range: { startDate: Date | null, endDate: Date | null }) => {
    dispatch(setDateRange(range));
  };

  return (
    <BillListScreen
      bills={bills}
      patients={patients}
      loading={loading}
      searchQuery={searchQuery}
      filterStatus={filterStatus}
      filterPatientId={filterPatientId}
      dateRange={dateRange}
      onSearch={handleSearch}
      onFilterStatus={handleFilterStatus}
      onFilterPatient={handleFilterPatient}
      onFilterDateRange={handleFilterDateRange}
      onBillPress={handleBillPress}
      onAddBill={handleAddBill}
      onEditBill={handleEditBill}
      onDeleteBill={handleDeleteBill}
      onAddPayment={handleAddPayment}
    />
  );
};

export default BillListContainer;
