import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuoteListContainer from '../screens/quote/QuoteListContainer';
import QuoteDetailsContainer from '../screens/quote/QuoteDetailsContainer';
import AddEditQuoteScreen from '../screens/quote/AddEditQuoteScreen';

const Stack = createNativeStackNavigator();

const QuoteNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="QuoteList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="QuoteList" component={QuoteListContainer} />
      <Stack.Screen name="QuoteDetails" component={QuoteDetailsContainer} />
      <Stack.Screen name="AddEditQuote" component={AddEditQuoteScreen} />
    </Stack.Navigator>
  );
};

export default QuoteNavigator;
