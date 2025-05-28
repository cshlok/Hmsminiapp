import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import { IBill } from '../../models/BillingModel';
import { IPatient } from '../../models/PatientModel';
import { IService } from '../../models/ServiceModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BillForm from '../../components/billing/BillForm';

interface AddEditBillScreenProps {
  navigation: {goBack: () => void};
  route: {params?: {bill?: IBill, onSave?: (bill: IBill) => void}};
  onSave: (bill: IBill) => void;
  isLoading?: boolean;
}

const AddEditBillScreen: React.FC<AddEditBillScreenProps> = ({
  navigation,
  route,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { bill, onSave } = route.params || {};
  const isEditing = !!bill;
  
  const patients = useSelector((state: RootState) => state.patient.patients);
  const services = useSelector((state: RootState) => state.service.services);
  const quotes = useSelector((state: RootState) => state.quote.quotes);
  
  const handleSubmit = (values: IBill) => {
    if (onSave) {
      onSave(values);
    }
    navigation.goBack();
  };
  
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditing ? 'Edit Invoice' : 'Create New Invoice'} />
      </Appbar.Header>
      
      <BillForm
        initialValues={bill}
        patients={patients}
        services={services}
        quotes={quotes}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AddEditBillScreen;
