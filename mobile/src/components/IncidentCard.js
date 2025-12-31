import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function IncidentCard({ item, onPress }) {

  const getIncidentMeta = (type) => {
    switch (type) {
      case 'Suspicious activity': return { icon: 'eye', color: '#FF3B30', label: 'Suspicious' };
      case 'Poor lighting': return { icon: 'flashlight', color: '#FFCC00', label: 'Dark Spot' };
      case 'Icy road': return { icon: 'snow', color: '#00BCD4', label: 'Icy' };
      case 'Flooded area': return { icon: 'water', color: '#007AFF', label: 'Flood' };
      case 'Broken sidewalk': return { icon: 'alert-circle', color: '#8E8E93', label: 'Broken' };
      default: return { icon: 'warning', color: '#007AFF', label: 'Incident' };
    }
  };

  const displayType = item.type_label || item.type || "Unknown";
  const meta = getIncidentMeta(displayType);
  const displayDate = item.created_at ? new Date(item.created_at).toLocaleDateString() : item.date;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.card}>
        {/* Left Icon Strip */}
        <View style={[styles.iconStrip, { backgroundColor: meta.color + '20' }]}>
          <Ionicons name={meta.icon} size={24} color={meta.color} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{meta.label}</Text>
            <Text style={styles.date}>{displayDate}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

          <View style={styles.footer}>
            <View style={[
              styles.badge,
              item.status === 'validated' ? styles.badgeValidated :
                item.status === 'resolved' ? styles.badgeResolved :
                  styles.badgePending
            ]}>
              <Text style={[
                styles.badgeText,
                item.status === 'validated' ? styles.textValidated :
                  item.status === 'resolved' ? styles.textResolved :
                    styles.textPending
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconStrip: {
    width: 50, height: 50, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  date: { fontSize: 12, color: '#999' },
  description: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: 'row' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgePending: { backgroundColor: '#FFF8E1' },
  badgeValidated: { backgroundColor: '#E8F5E9' },
  badgeResolved: { backgroundColor: '#E3F2FD' },
  textPending: { color: '#FFA000', fontSize: 10, fontWeight: 'bold' },
  textValidated: { color: '#4CAF50', fontSize: 10, fontWeight: 'bold' },
  textResolved: { color: '#1976D2', fontSize: 10, fontWeight: 'bold' },
  arrow: { paddingLeft: 10 }
});