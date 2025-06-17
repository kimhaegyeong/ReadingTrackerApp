import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import BookList from '@/features/books/screens/BookList';
import AddBook from '@/features/books/screens/AddBook';
import BookDetails from '@/features/books/screens/BookDetails';
import EditBook from '@/features/books/screens/EditBook';

// Create the native stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main application navigator
 * Handles the navigation stack for the entire app
 */
export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="BooksList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A6FA5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitle: '',
        headerTitleAlign: 'center',
        // @ts-ignore - headerBackAccessibilityLabel is valid but not in the type definition
        headerBackAccessibilityLabel: 'Back',
      }}
    >
      <Stack.Screen
        name="BooksList"
        component={BookList}
        options={{
          title: 'My Books',
        }}
      />
      <Stack.Screen
        name="AddBook"
        component={AddBook}
        options={{
          title: 'Add New Book',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="BookDetails"
        component={BookDetails}
        options={{
          title: 'Book Details',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditBook"
        component={EditBook}
        options={{
          title: 'Edit Book',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
