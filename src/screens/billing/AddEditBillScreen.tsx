import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IBill } from '../../store/slices/billingSlice'; // Use slice definition
import { IPatient } from '../../store/slices/patientSlice'; // Use slice definition
import { IServiceSlice as IService } from '../../utils/modelConverters'; // Use slice definition via converter
import BillForm from '../../components/billing/BillForm';

// Define ParamList for navigation
type RootStackParamList = {
  AddEditBill: { bill?: IBill, onSave?: (bill: IBill) => void };
  // Add other screen definitions here if needed
};

// Define Props for the screen
interface AddEditBillScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'AddEditBill'>;
  route: RouteProp<RootStackParamList, 'AddEditBill'>;
  // onSave prop seems redundant if passed via route.params, consider refactoring later
  // onSave: (bill: IBill) => void; 
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
