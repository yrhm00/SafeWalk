import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { listReports } from '../api/reportApi';

const ALERTS = [
  {
    id: 1,
    title: 'Your report was validated',
    description: 'Your incident report #2847 has been reviewed and validated by our safety team.',
    time: '2 minutes ago',
    color: '#52c41a',
  },
  {
    id: 2,
    title: 'New incident nearby',
    description: 'Safety alert: Reported incident 0.3 miles from your location on Main Street.',
    time: '15 minutes ago',
    color: '#ff4d4f',
  },
  {
    id: 3,
    title: 'Safety tip',
    description: 'Remember to stay in well-lit areas when walking after dark.',
    time: '2 days ago',
    color: '#d9d9d9',
  },
  {
    id: 4,
    title: 'Reminder',
    description: "Don’t forget to share your location when walking tonight.",
    time: '5 hours ago',
    color: '#d9d9d9',
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(ALERTS);

  useEffect(() => {
    (async () => {
      try {
        const data = await listReports({ page: 1, size: 10 });
        const items = data.items || data || [];
        setAlerts(items);
      } catch (e) {
        console.warn('Erreur chargement alerts', e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Alerts</Text>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle} />
            <Text style={styles.brandText}>SafeWalk</Text>
          </View>
          <View style={styles.iconPlaceholder} />
        </View>

        <Text style={styles.cardTitle}>Alerts & Notifications</Text>
        <Text style={styles.cardSubtitle}>
          Stay updated on your reports and nearby incidents.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionCount}>12 unread</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[styles.statusCircle, { backgroundColor: alert.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1890ff',
    marginRight: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCount: {
    fontSize: 12,
    color: '#999',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 11,
    color: '#999',
  },
});
