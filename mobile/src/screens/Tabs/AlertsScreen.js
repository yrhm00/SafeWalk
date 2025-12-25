import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Données fictives basées sur la Maquette Page 7
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'success', // Pour choisir l'icône verte
    title: 'Signalement validé',
    message: 'Votre signalement #2847 a été validé par notre équipe de sécurité.',
    time: 'Il y a 2 min',
  },
  {
    id: '2',
    type: 'danger', // Pour l'icône rouge d'alerte
    title: 'Incident à proximité',
    message: 'Alerte sécurité : Incident signalé à 300m de votre position sur la Rue de la Paix.',
    time: 'Il y a 15 min',
  },
  {
    id: '3',
    type: 'info', // Pour l'ampoule (Conseil)
    title: 'Conseil de sécurité',
    message: 'Privilégiez les rues éclairées lorsque vous rentrez tard le soir.',
    time: 'Il y a 2 jours',
  },
  {
    id: '4',
    type: 'reminder', // Pour l'horloge
    title: 'Rappel',
    message: 'N\'oubliez pas de partager votre position lors de votre trajet ce soir.',
    time: 'Il y a 5 heures',
  },
  {
    id: '5',
    type: 'weather', // Nouveau type pour la météo
    title: 'Alerte Météo',
    message: 'Fortes pluies prévues ce soir. La visibilité pourrait être réduite.',
    time: 'Il y a 1 heure',
  },
  {
    id: '6',
    type: 'community', // Nouveau type pour la communauté
    title: 'Communauté',
    message: '5 nouveaux utilisateurs ont rejoint SafeWalk dans votre quartier cette semaine !',
    time: 'Il y a 3 jours',
  },
  {
    id: '7',
    type: 'admin', // Nouveau type pour message admin
    title: 'Message Admin',
    message: 'Une maintenance des serveurs est prévue cette nuit entre 2h et 4h.',
    time: 'Il y a 1 jour',
  }
];

export default function AlertsScreen() {

  // Petite fonction pour choisir l'icône et la couleur selon le type
  const getIcon = (type) => {
    switch (type) {
      case 'success': return { name: 'checkmark-circle', color: '#34C759' }; // Vert
      case 'danger': return { name: 'warning', color: '#FF3B30' };           // Rouge
      case 'info': return { name: 'bulb', color: '#FF9500' };                // Orange
      case 'reminder': return { name: 'time', color: '#5856D6' };            // Violet
      case 'weather': return { name: 'rainy', color: '#007AFF' };            // Bleu Pluie
      case 'community': return { name: 'people', color: '#FF2D55' };         // Rose
      case 'admin': return { name: 'shield-checkmark', color: '#5AC8FA' };   // Bleu Ciel
      default: return { name: 'notifications', color: '#007AFF' };
    }
  };

  const renderItem = ({ item }) => {
    const iconData = getIcon(item.type);

    return (
      <TouchableOpacity style={styles.notificationItem}>
        {/* Colonne Gauche : Icône */}
        <View style={styles.iconContainer}>
          <Ionicons name={iconData.name} size={28} color={iconData.color} />
        </View>

        {/* Colonne Droite : Textes */}
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.messageText} numberOfLines={2}>
            {item.message}
          </Text>
        </View>

        {/* Petit point bleu si non lu (optionnel, pour le style) */}
        {item.type === 'success' && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Alertes & Notifications</Text>
        <Text style={styles.subTitle}>Restez informé de vos signalements et incidents proches</Text>
      </View>

      {/* Liste des notifications */}
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 15,
    marginTop: 2, // Pour aligner avec le titre
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 10,
    marginTop: 6,
  },
});