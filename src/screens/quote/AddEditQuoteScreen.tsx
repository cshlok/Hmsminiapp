import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import QuoteForm from '../../components/quote/QuoteForm';
import { IQuote } from '../../models/QuoteModel';
import { IPatient } from '../../models/PatientModel';
import { IService } from '../../models/ServiceModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface AddEditQuoteScreenProps {
  navigation: {goBack: () => void};
  route: {params?: {quote?: IQuote, onSave?: (quote: IQuote) => void}};
  onSave: (quote: IQuote) => void;
  isLoading?: boolean;
}

const AddEditQuoteScreen: React.FC<AddEditQuoteScreenProps> = ({
  navigation,
  route,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { quote, onSave } = route.params || {};
  const isEditing = !!quote;
  
  const patients = useSelector((state: RootState) => state.patient.patients);
  const services = useSelector((state: RootState) => state.service.services);
  
  const handleSubmit = (values: IQuote) => {
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
        <Appbar.Content title={isEditing ? 'Edit Quote' : 'Create New Quote'} />
      </Appbar.Header>
      
      <QuoteForm
        initialValues={quote}
        patients={patients}
        services={services}
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

export default AddEditQuoteScreen;
