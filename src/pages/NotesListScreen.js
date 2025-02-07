import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const NotesListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Usuário não autenticado');
        return;
      }

      const response = await fetch('http://x.x.x.x:8000/notes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Erro ao buscar notas:', response.status);
        return;
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza a lista sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  // Função para formatar a data
  const formatarData = (isoString) => {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Adicionar Nota" onPress={() => navigation.navigate('AddNoteScreen')} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : notes.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma nota encontrada.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EditNote', { noteId: item.id })}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
              <Text numberOfLines={2}>{item.content}</Text>
              <Text style={{ fontSize: 12, color: '#555' }}>Criado em: {formatarData(item.created_at)}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default NotesListScreen;
