import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsContainer from '../screens/settings/SettingsContainer';
import ExportJobsScreen from '../screens/settings/ExportJobsScreen';
import AuthLogsScreen from '../screens/settings/AuthLogsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import SetupPinScreen from '../screens/settings/SetupPinScreen';

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Settings" component={SettingsContainer} />
      <Stack.Screen name="ExportJobs" component={ExportJobsScreen} />
      <Stack.Screen name="AuthLogs" component={AuthLogsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="SetupPin" component={SetupPinScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
