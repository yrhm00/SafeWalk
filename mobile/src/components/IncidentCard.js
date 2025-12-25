import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Ce composant reçoit les données d'un incident via "props"
export default function IncidentCard({ item, onPress }) {

  // On choisit la couleur de la bordure selon le type d'incident
  const getBorderColor = (type) => {
    switch (type) {
      case 'Suspicious activity': return '#FF3B30';
      case 'Theft': return '#FF3B30';
      case 'Harassment': return '#FF9500';
      case 'Poor lighting': return '#FFCC00';
      case 'Icy road': return '#00BCD4';
      case 'Flooded area': return '#007AFF';
      case 'Broken sidewalk': return '#8E8E93';
      default: return '#007AFF';
    }
  };

  const displayType = item.type_label || item.type || "Unknown";
  const displayDate = item.created_at ? new Date(item.created_at).toLocaleString() : item.date;

  return (
    <View style={[styles.card, { borderLeftColor: getBorderColor(displayType) }]}>

      {/* En-tête de la carte : Type et Statut */}
      <View style={styles.header}>
        <Text style={styles.type}>{displayType}</Text>
        <View style={[
          styles.statusBadge,
          // Si c'est "Resolved", on met le badge en vert, sinon gris
          item.status === 'Resolved' ? styles.statusResolved : styles.statusPending
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Description et Date */}
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.date}>{displayDate}</Text>

      {/* Bouton "View Details" */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // Ombre légère (Card style)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Pour Android
    borderLeftWidth: 5, // La barre colorée à gauche
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF3CD', // Fond jaune clair
  },
  statusResolved: {
    backgroundColor: '#D4EDDA', // Fond vert clair
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligne à droite
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 5,
  },
});