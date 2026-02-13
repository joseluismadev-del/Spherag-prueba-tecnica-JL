import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AtlasListScreen from '../screens/AtlasListScreen';
import AtlasDetailScreen from '../screens/AtlasDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AtlasList"
        component={AtlasListScreen}
        options={({route}) => ({
          title: route.params?.fincaName ?? 'Atlas',
          headerStyle: {backgroundColor: '#4caf50'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: '600'},
        })}
      />
      <Stack.Screen
        name="AtlasDetail"
        component={AtlasDetailScreen}
        options={({route}) => ({
          title: route.params?.atlasName ?? 'Detalle Atlas',
          headerStyle: {backgroundColor: '#4caf50'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: '600'},
        })}
      />
    </Stack.Navigator>
  );
}
