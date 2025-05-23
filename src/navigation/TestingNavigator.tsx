import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestingDashboard from '../screens/testing/TestingDashboard';
import OptimizationDashboard from '../screens/testing/OptimizationDashboard';
import FinalReportScreen from '../screens/testing/FinalReportScreen';

const Stack = createNativeStackNavigator();

const TestingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TestingDashboard"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="TestingDashboard" 
        component={TestingDashboard}
        options={{ title: 'Testing Dashboard' }}
      />
      <Stack.Screen 
        name="OptimizationDashboard" 
        component={OptimizationDashboard}
        options={{ title: 'Optimization Dashboard' }}
      />
      <Stack.Screen 
        name="FinalReport" 
        component={FinalReportScreen}
        options={{ title: 'Final Report' }}
      />
    </Stack.Navigator>
  );
};

export default TestingNavigator;
