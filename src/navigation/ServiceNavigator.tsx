import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServiceListContainer from '../screens/service/ServiceListContainer';
import ServiceDetailsContainer from '../screens/service/ServiceDetailsContainer';
import AddEditServiceScreen from '../screens/service/AddEditServiceScreen';
import AddEditCategoryScreen from '../screens/service/AddEditCategoryScreen';

const Stack = createNativeStackNavigator();

const ServiceNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ServiceList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ServiceList" component={ServiceListContainer} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsContainer} />
      <Stack.Screen name="AddEditService" component={AddEditServiceScreen} />
      <Stack.Screen name="AddEditCategory" component={AddEditCategoryScreen} />
    </Stack.Navigator>
  );
};

export default ServiceNavigator;
