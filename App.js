import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas criadas
import LoginScreen from './src/pages/LoginScreen';
import RegisterScreen from './src/pages/RegisterScreen';
import NoteListScreen from './src/pages/NotesListScreen';
import AddNoteScreen from './src/pages/AddNoteScreen';
import ReadNoteScreen from './src/pages/ReadNoteScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' , headerShown: false}} 
        />

        {/* Tela de Registro */}
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Registro' }} 
        />

        {/* Tela de Listagem de Notas */}
        <Stack.Screen 
          name="Notes" 
          component={NoteListScreen} 
          options={{ title: 'Minhas Notas' }} 
        />

        {/* Tela para Adicionar Nota */}
        <Stack.Screen 
          name="AddNote" 
          component={AddNoteScreen} 
          options={{ title: 'Adicionar Nota' }} 
        />

        {/* Tela para Editar Nota */}
        <Stack.Screen 
          name="EditNote" 
          component={ReadNoteScreen} 
          options={{ title: 'Editar Nota' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
