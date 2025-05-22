import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PatientNavigator from './PatientNavigator';
import AppointmentNavigator from './AppointmentNavigator';
import ServiceNavigator from './ServiceNavigator';

const Tab = createBottomTabNavigator();

// Placeholder components for future modules
const QuotesPlaceholder = () => null;
const BillingPlaceholder = () => null;

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Patients"
        component={PatientNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServiceNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="medical-bag" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-document-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingPlaceholder}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-register" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
