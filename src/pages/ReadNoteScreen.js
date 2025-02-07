import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://x.x.x.x:8000';

const ReadNoteScreen = ({ route, navigation }) => {
  const { noteId } = route.params; // Obtém o ID da nota passada pela navegação
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Usuário não autenticado');
          return;
        }

        const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar nota:', response.status);
          return;
        }

        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error('Erro ao buscar nota:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nota não encontrada</Text>
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <Button
        title="Editar Nota"
        onPress={() => navigation.navigate('EditNote', { note })}
      />

      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        color="gray"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ReadNoteScreen;
