import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import QuoteDetailsScreen from './QuoteDetailsScreen';
import { IQuote } from '../../models/QuoteModel';

const QuoteDetailsContainer = ({ navigation, route }) => {
  const { quote } = route.params;
  const { patients } = useSelector((state: RootState) => state.patient);
  const { selectedQuote } = useSelector((state: RootState) => state.quote);
  
  // Use the quote from route params or from Redux state
  const quoteData = quote || selectedQuote;
  
  // Get patient name for this quote
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  // Handle edit quote
  const handleEditQuote = (quote: IQuote) => {
    navigation.navigate('AddEditQuote', { 
      quote,
      patients,
      onSave: (updatedQuote: IQuote) => {
        // This will be handled by the QuoteListContainer
        navigation.goBack();
      }
    });
  };
  
  // Handle delete quote
  const handleDeleteQuote = (quoteId: string) => {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // This will be handled by the QuoteListContainer
            navigation.goBack();
          }
        },
      ]
    );
  };
  
  // Handle convert to bill
  const handleConvertToBill = (quote: IQuote) => {
    Alert.alert(
      'Convert to Bill',
      'Are you sure you want to convert this quote to a bill?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Convert', 
          onPress: () => {
            // This will be handled by the QuoteListContainer
            navigation.goBack();
          }
        },
      ]
    );
  };
  
  // Handle share PDF
  const handleSharePdf = async (quote: IQuote) => {
    try {
      // In a real implementation, this would generate a PDF and share it
      // For now, just show a message
      Alert.alert(
        'PDF Generation',
        'In a real implementation, this would generate a PDF of the quote and share it.',
        [{ text: 'OK' }]
      );
      
      // Example of how sharing would work
      await Share.share({
        message: `Quote #${quote.id.substring(0, 8)} for ${getPatientName(quote.patientId)} - Total: $${quote.total.toFixed(2)}`,
        title: 'Quote Details',
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
      Alert.alert('Error', 'Failed to share quote. Please try again.');
    }
  };
  
  // If no quote data is available, go back to the list
  useEffect(() => {
    if (!quoteData) {
      navigation.goBack();
    }
  }, [quoteData, navigation]);
  
  if (!quoteData) {
    return <View style={styles.container} />;
  }
  
  return (
    <QuoteDetailsScreen 
      quote={quoteData}
      patientName={getPatientName(quoteData.patientId)}
      onEdit={handleEditQuote}
      onDelete={handleDeleteQuote}
      onConvertToBill={handleConvertToBill}
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

export default QuoteDetailsContainer;
