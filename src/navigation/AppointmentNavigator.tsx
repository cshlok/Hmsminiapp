import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentListContainer from '../screens/appointment/AppointmentListContainer';
import AppointmentDetailsContainer from '../screens/appointment/AppointmentDetailsContainer';
import AddEditAppointmentScreen from '../screens/appointment/AddEditAppointmentScreen';

const Stack = createNativeStackNavigator();

const AppointmentNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AppointmentList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AppointmentList" component={AppointmentListContainer} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsContainer} />
      <Stack.Screen name="AddEditAppointment" component={AddEditAppointmentScreen} />
    </Stack.Navigator>
  );
};

export default AppointmentNavigator;
