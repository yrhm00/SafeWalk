import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../config';
import IncidentCard from '../../components/IncidentCard'; // On importe notre composant

export default function IncidentListScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchIncidents();
    }, [])
  );

  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${API_URL}/reports`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setIncidents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fonction pour filtrer la liste selon la recherche
  const filteredData = incidents.filter(item => {
    const type = item.type_label || "";
    const desc = item.description || "";
    return type.toLowerCase().includes(searchText.toLowerCase()) ||
      desc.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <Text style={styles.title}>Incidents</Text>
      </View>

      {/* Barre de Recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search incidents..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Liste Déroulante (FlatList est vu dans ton cours React.pdf p90) */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <IncidentCard
            item={item}
            onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fond légèrement gris pour ressortir les cartes blanches
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    // Ombre légère
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});