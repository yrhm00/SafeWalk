import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { listReports } from '../api/reportApi';

const INCIDENTS = [
  {
    id: 1,
    title: 'Theft',
    description: 'Vélo volé dans le parking du campus près de la bibliothèque. Vélo rouge avec des pédales rouges.',
    status: 'Pending',
    statusColor: '#faad14',
    type: 'Crime',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'Harassment',
    description: "Agression verbale signalée à l'entrée principale. La sécurité a été informée.",
    status: 'Resolved',
    statusColor: '#52c41a',
    type: 'Harassment',
    time: '5 hours ago',
  },
  {
    id: 3,
    title: 'Suspicious Activity',
    description: 'Personne inconnue se balade dans le bâtiment après les heures de travail.',
    status: 'Investigating',
    statusColor: '#1890ff',
    type: 'Suspicious',
    time: '1 day ago',
  },
  {
    id: 4,
    title: 'Vehicle Break-in',
    description: 'Fenêtre de voiture cassée dans le parking B. Objets volés à l’intérieur du véhicule.',
    status: 'Pending',
    statusColor: '#faad14',
    type: 'Crime',
    time: '2 days ago',
  },
  {
    id: 5,
    title: 'Poor Lighting',
    description: 'Lampe cassée entre le bâtiment A et B.',
    status: 'Resolved',
    statusColor: '#52c41a',
    type: 'Safety',
    time: '3 days ago',
  },
];

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState(INCIDENTS);

  useEffect(() => {
    (async () => {
      try {
        const data = await listReports({ page: 1, size: 20 });
        const items = data.items || data || [];
        setIncidents(items);
      } catch (e) {
        console.warn('Erreur chargement incidents', e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Incidents</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Incidents</Text>
          <View style={styles.notificationDot} />
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Search incidents...</Text>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterButton}>
            <Text style={styles.filterText}>Status</Text>
          </View>
          <View style={styles.filterButton}>
            <Text style={styles.filterText}>Type</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {incidents.map(incident => (
            <View key={incident.id} style={styles.incidentItem}>
              <View style={styles.incidentHeader}>
                <View style={styles.incidentIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.incidentTitle}>{incident.title}</Text>
                  <Text style={styles.incidentType}>{incident.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: incident.statusColor + '22' }]}>
                  <Text style={[styles.statusText, { color: incident.statusColor }]}>{incident.status}</Text>
                </View>
              </View>

              <Text style={styles.incidentDescription}>{incident.description}</Text>

              <View style={styles.incidentFooter}>
                <Text style={styles.timeText}>{incident.time}</Text>
                <TouchableOpacity>
                  <Text style={styles.detailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#101214',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1890ff',
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  incidentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4d4f22',
    marginRight: 8,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  incidentType: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  incidentDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  incidentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  detailsText: {
    fontSize: 13,
    color: '#1890ff',
    fontWeight: '600',
  },
});
