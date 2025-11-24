import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearToken } from '../store/slices/authSlice';
import { getMe } from '../api/userApi';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setProfile(me);
      } catch (e) {
        console.warn('Erreur chargement profil', e);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    dispatch(clearToken());
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=80' }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge} />
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Nom Inconnu'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || 'Email Inconnu'}</Text>
        </View>

        <View style={styles.menuCard}>
          <ProfileRow label="Edit Profile" />
          <ProfileRow label="Notifications" />
          <ProfileRow label="Privacy Settings" />
          <ProfileRow label="Help & Support" isLast />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ProfileRow({ label, isLast }) {
  return (
    <View style={[styles.row, isLast && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowChevron}>{'>'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101214',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#4b5cff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 13,
    color: '#e6e6e6',
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 15,
  },
  rowChevron: {
    fontSize: 18,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff1f0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff4d4f',
    fontWeight: '600',
    fontSize: 15,
  },
});
