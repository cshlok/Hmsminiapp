import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientListScreen from '../screens/patient/PatientListScreen';
import PatientDetailsScreen from '../screens/patient/PatientDetailsScreen';
import AddEditPatientScreen from '../screens/patient/AddEditPatientScreen';

const Stack = createNativeStackNavigator();

const PatientNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="PatientList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PatientList" component={PatientListScreen} />
      <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
      <Stack.Screen name="AddEditPatient" component={AddEditPatientScreen} />
    </Stack.Navigator>
  );
};

export default PatientNavigator;
