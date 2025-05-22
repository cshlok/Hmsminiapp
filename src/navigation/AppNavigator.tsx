import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './navigation/MainNavigator';
import PatientListContainer from './screens/patient/PatientListContainer';
import PatientDetailsContainer from './screens/patient/PatientDetailsContainer';
import AddEditPatientScreen from './screens/patient/AddEditPatientScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="PatientList" component={PatientListContainer} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsContainer} />
        <Stack.Screen name="AddEditPatient" component={AddEditPatientScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
