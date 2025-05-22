import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { 
  setPatients, 
  addPatient, 
  updatePatient, 
  deletePatient, 
  setLoading, 
  setError,
  setSelectedPatient
} from '../../store/slices/patientSlice';
import { initializeRealm, PatientRepository } from '../../storage/PatientRepository';
import { IPatient } from '../../models/PatientModel';
import PatientListScreen from './PatientListScreen';

const PatientListContainer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector((state: RootState) => state.patient);
  const [patientRepo, setPatientRepo] = useState<PatientRepository | null>(null);

  // Initialize Realm and load patients
  useEffect(() => {
    const setupRealm = async () => {
      try {
        dispatch(setLoading(true));
        const realm = await initializeRealm();
        const repository = new PatientRepository(realm);
        setPatientRepo(repository);
        
        // Load all patients
        const allPatients = repository.getAllPatients();
        dispatch(setPatients(Array.from(allPatients)));
      } catch (error) {
        console.error('Failed to initialize database:', error);
        dispatch(setError('Failed to load patients. Please restart the app.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    setupRealm();
  }, [dispatch]);

  // Handle patient selection
  const handlePatientPress = (patient: IPatient) => {
    dispatch(setSelectedPatient(patient));
    navigation.navigate('PatientDetails', { patient });
  };

  // Navigate to add patient screen
  const handleAddPatient = () => {
    navigation.navigate('AddEditPatient', { 
      onSave: handleSavePatient 
    });
  };

  // Navigate to edit patient screen
  const handleEditPatient = (patient: IPatient) => {
    navigation.navigate('AddEditPatient', { 
      patient,
      onSave: handleSavePatient 
    });
  };

  // Save new or updated patient
  const handleSavePatient = (patientData: IPatient) => {
    if (!patientRepo) return;
    
    try {
      dispatch(setLoading(true));
      
      // Check if this is a new patient or an update
      const existingPatient = patientRepo.getPatientById(patientData.id);
      
      if (existingPatient) {
        // Update existing patient
        const updatedPatient = patientRepo.updatePatient(patientData.id, patientData);
        dispatch(updatePatient(updatedPatient));
      } else {
        // Create new patient
        const newPatient = patientRepo.createPatient({
          ...patientData,
          id: uuidv4(), // Ensure unique ID
        });
        dispatch(addPatient(newPatient));
      }
    } catch (error) {
      console.error('Failed to save patient:', error);
      dispatch(setError('Failed to save patient. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete patient with confirmation
  const handleDeletePatient = (patientId: string) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (!patientRepo) return;
            
            try {
              dispatch(setLoading(true));
              const success = patientRepo.deletePatient(patientId);
              
              if (success) {
                dispatch(deletePatient(patientId));
              } else {
                dispatch(setError('Patient not found.'));
              }
            } catch (error) {
              console.error('Failed to delete patient:', error);
              dispatch(setError('Failed to delete patient. Please try again.'));
            } finally {
              dispatch(setLoading(false));
            }
          }
        },
      ]
    );
  };

  return (
    <PatientListScreen
      navigation={navigation}
      patients={patients}
      loading={loading}
      onPatientPress={handlePatientPress}
      onAddPatient={handleAddPatient}
      onEditPatient={handleEditPatient}
      onDeletePatient={handleDeletePatient}
    />
  );
};

export default PatientListContainer;
