import { useSelector, useDispatch } from 'react-redux';
import { fetchReports, selectAllReports } from '../../store/reportsSlice';

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
// API_URL n'est plus nécessaire ici si on passe par le slice
import IncidentCard from '../../components/IncidentCard';

export default function IncidentListScreen({ navigation }) {
  const dispatch = useDispatch();
  const incidents = useSelector(selectAllReports); // On réutilise le même selector que MapScreen !

  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // Rafraîchir les données quand on arrive sur cet écran
      dispatch(fetchReports());
    }, [dispatch])
  );

  // Plus de fetchIncidents local !


  // Fonction pour filtrer la liste selon la recherche
  const filteredData = incidents.filter(item => {
    const type = item.type_label || "";
    const desc = item.description || "";
    return type.toLowerCase().includes(searchText.toLowerCase()) ||
      desc.toLowerCase().includes(searchText.toLowerCase());
  });

  const EmptyListState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={80} color="#4CAF50" />
      <Text style={styles.emptyText}>Aucun incident signalé.</Text>
      <Text style={styles.emptySubText}>Tout est calme !</Text>
    </View>
  );

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
        contentContainerStyle={[styles.listContent, filteredData.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListState}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});