import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { 
  setQuotes,
  setSelectedQuote,
  setLoading,
  setError,
  addQuote,
  updateQuote,
  deleteQuote,
  setFilterStatus,
  setFilterPatientId,
  setSearchQuery,
  clearFilters
} from '../../store/slices/quoteSlice';
import { QuoteRepository } from '../../storage/QuoteRepository';
import { IQuote } from '../../models/QuoteModel';
import QuoteListScreen from './QuoteListScreen';

const QuoteListContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { 
    quotes, 
    loading, 
    error, 
    searchQuery, 
    filterStatus, 
    filterPatientId 
  } = useSelector((state: RootState) => state.quote);
  const { patients } = useSelector((state: RootState) => state.patient);
  const [quoteRepo, setQuoteRepo] = useState<QuoteRepository | null>(null);

  // Initialize repository and load quotes
  useEffect(() => {
    const setupRepository = async () => {
      try {
        dispatch(setLoading(true));
        // Note: In a real implementation, we would initialize Realm here
        // For now, we'll create a mock repository
        const repository = new QuoteRepository(null);
        setQuoteRepo(repository);
        
        // Load all quotes
        // In a real implementation, this would fetch from Realm
        // For now, we'll just set empty array
        dispatch(setQuotes([]));
      } catch (error) {
        console.error('Failed to initialize quote repository:', error);
        dispatch(setError('Failed to load quotes. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRepository();
  }, [dispatch]);

  // Handle quote selection
  const handleQuotePress = (quote: IQuote) => {
    dispatch(setSelectedQuote(quote));
    navigation.navigate('QuoteDetails', { 
      quote,
      patientName: getPatientName(quote.patientId)
    });
  };

  // Get patient name for a quote
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  // Navigate to add quote screen
  const handleAddQuote = () => {
    if (patients.length === 0) {
      Alert.alert(
        'No Patients',
        'You need to add at least one patient before creating a quote.',
        [
          { text: 'OK' }
        ]
      );
      return;
    }
    
    navigation.navigate('AddEditQuote', { 
      patients,
      onSave: handleSaveQuote
    });
  };

  // Navigate to edit quote screen
  const handleEditQuote = (quote: IQuote) => {
    if (quote.status === 'converted' || quote.status === 'cancelled') {
      Alert.alert(
        'Cannot Edit',
        'This quote cannot be edited because it has been converted or cancelled.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate('AddEditQuote', { 
      quote,
      patients,
      onSave: handleSaveQuote
    });
  };

  // Save new or updated quote
  const handleSaveQuote = (quoteData: IQuote) => {
    if (!quoteRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new quote or an update
      const existingQuote = quotes.find(q => q.id === quoteData.id);
      
      if (existingQuote) {
        // Update existing quote
        // In a real implementation, this would update in Realm
        dispatch(updateQuote(quoteData));
      } else {
        // Create new quote
        // In a real implementation, this would create in Realm
        const newQuote = {
          ...quoteData,
          id: uuidv4(), // Ensure unique ID
        };
        dispatch(addQuote(newQuote));
      }
    } catch (error) {
      console.error('Failed to save quote:', error);
      dispatch(setError('Failed to save quote. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete quote with confirmation
  const handleDeleteQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    
    if (quote && (quote.status === 'converted' || quote.status === 'cancelled')) {
      Alert.alert(
        'Cannot Delete',
        'This quote cannot be deleted because it has been converted or cancelled.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to delete this quote? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (!quoteRepo) return;
            
            try {
              dispatch(setLoading(true));
              // In a real implementation, this would delete from Realm
              dispatch(deleteQuote(quoteId));
            } catch (error) {
              console.error('Failed to delete quote:', error);
              dispatch(setError('Failed to delete quote. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          }
        },
      ]
    );
  };

  // Convert quote to bill
  const handleConvertQuote = (quote: IQuote) => {
    if (quote.status !== 'final') {
      Alert.alert(
        'Cannot Convert',
        'Only finalized quotes can be converted to bills.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // In a real implementation, this would create a bill and update the quote
    // For now, just update the quote status
    try {
      dispatch(setLoading(true));
      const updatedQuote = {
        ...quote,
        status: 'converted',
        updatedAt: new Date()
      };
      dispatch(updateQuote(updatedQuote));
      
      Alert.alert(
        'Quote Converted',
        'The quote has been successfully converted to a bill.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to convert quote:', error);
      dispatch(setError('Failed to convert quote. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
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

  return (
    <QuoteListScreen
      quotes={quotes}
      patients={patients}
      loading={loading}
      searchQuery={searchQuery}
      filterStatus={filterStatus}
      filterPatientId={filterPatientId}
      onSearch={handleSearch}
      onFilterStatus={handleFilterStatus}
      onFilterPatient={handleFilterPatient}
      onQuotePress={handleQuotePress}
      onAddQuote={handleAddQuote}
      onEditQuote={handleEditQuote}
      onDeleteQuote={handleDeleteQuote}
      onConvertQuote={handleConvertQuote}
    />
  );
};

export default QuoteListContainer;
