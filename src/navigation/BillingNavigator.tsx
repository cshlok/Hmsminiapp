import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BillListContainer from '../screens/billing/BillListContainer';
import BillDetailsContainer from '../screens/billing/BillDetailsContainer';
import AddEditBillScreen from '../screens/billing/AddEditBillScreen';

const Stack = createNativeStackNavigator();

const BillingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="BillList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BillList" component={BillListContainer} />
      <Stack.Screen name="BillDetails" component={BillDetailsContainer} />
      <Stack.Screen name="AddEditBill" component={AddEditBillScreen} />
    </Stack.Navigator>
  );
};

export default BillingNavigator;
