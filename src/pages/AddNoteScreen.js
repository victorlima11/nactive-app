import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddNoteScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleAddNote = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setMessage('Usuário não autenticado');
        return;
      }

      const response = await fetch('http://x.x.x.x:8000/notes/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Nota adicionada com sucesso!');
        navigation.goBack();
      } else {
        setMessage(data.detail || 'Erro ao adicionar nota');
      }
    } catch (error) {
      setMessage('Erro na conexão');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Adicionar Nota" onPress={handleAddNote} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  message: {
    marginTop: 10,
    color: 'red',
  },
});

export default AddNoteScreen;
