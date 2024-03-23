import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import RestaurantDetailScreen from './RestaurantDetailScreen';

import SearchScreen from './SearchScreen'; 
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
    

      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="RestaurantDetailScreen" component={RestaurantDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
