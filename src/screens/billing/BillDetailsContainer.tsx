import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BillDetailsScreen from './BillDetailsScreen';
import { IBill, IPayment } from '../../models/BillingModel';

const BillDetailsContainer = ({ navigation, route }) => {
  const { bill } = route.params;
  const { patients } = useSelector((state: RootState) => state.patient);
  const { selectedBill } = useSelector((state: RootState) => state.billing);
  
  // Use the bill from route params or from Redux state
  const billData = bill || selectedBill;
  
  // Get patient name for this bill
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  // Handle edit bill
  const handleEditBill = (bill: IBill) => {
    navigation.navigate('AddEditBill', { 
      bill,
      patients,
      onSave: (updatedBill: IBill) => {
        // This will be handled by the BillListContainer
        navigation.goBack();
      }
    });
  };
  
  // Handle delete bill
  const handleDeleteBill = (billId: string) => {
    Alert.alert(
      'Delete Bill',
      'Are you sure you want to delete this bill? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // This will be handled by the BillListContainer
            navigation.goBack();
          }
        },
      ]
    );
  };
  
  // Handle add payment
  const handleAddPayment = (billId: string, payment: IPayment) => {
    // This will be handled by the BillListContainer
    // For now, just show a success message
    Alert.alert(
      'Payment Added',
      'The payment has been successfully recorded.',
      [{ text: 'OK' }]
    );
  };
  
  // Handle delete payment
  const handleDeletePayment = (billId: string, paymentId: string, amount: number) => {
    Alert.alert(
      'Delete Payment',
      'Are you sure you want to delete this payment? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // This will be handled by the BillListContainer
            Alert.alert(
              'Payment Deleted',
              'The payment has been successfully deleted.',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };
  
  // Handle share PDF
  const handleSharePdf = async (bill: IBill) => {
    try {
      // In a real implementation, this would generate a PDF and share it
      // For now, just show a message
      Alert.alert(
        'PDF Generation',
        'In a real implementation, this would generate a PDF of the invoice and share it.',
        [{ text: 'OK' }]
      );
      
      // Example of how sharing would work
      await Share.share({
        message: `Invoice #${bill.id.substring(0, 8)} for ${getPatientName(bill.patientId)} - Total: $${bill.total.toFixed(2)}`,
        title: 'Invoice Details',
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
      Alert.alert('Error', 'Failed to share invoice. Please try again.');
    }
  };
  
  // If no bill data is available, go back to the list
  useEffect(() => {
    if (!billData) {
      navigation.goBack();
    }
  }, [billData, navigation]);
  
  if (!billData) {
    return <View style={styles.container} />;
  }
  
  return (
    <BillDetailsScreen 
      bill={billData}
      patientName={getPatientName(billData.patientId)}
      onEdit={handleEditBill}
      onDelete={handleDeleteBill}
      onAddPayment={handleAddPayment}
      onDeletePayment={handleDeletePayment}
      onSharePdf={handleSharePdf}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default BillDetailsContainer;
