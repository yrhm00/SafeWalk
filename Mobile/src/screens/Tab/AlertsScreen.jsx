import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, colors, spacing, typography, shadows } from "../../styles";

// Composants UI
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";

export default function AlertsScreen() {
  // Simulation de données basées sur le mockup
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      type: "success",
      title: "Your report was validated",
      description: "Your incident report #2847 has been reviewed and validated by our safety team.",
      time: "2 minutes ago",
      unread: true,
      icon: "checkmark-circle",
    },
    {
      id: "2",
      type: "danger",
      title: "New incident nearby",
      description: "Safety alert: Reported incident 0.3 miles from your location on Main Street.",
      time: "15 minutes ago",
      unread: true,
      icon: "warning",
    },
    {
      id: "3",
      type: "info",
      title: "Safety tip",
      description: "Remember to stay in well-lit areas when walking after dark.",
      time: "2 days ago",
      unread: false,
      icon: "shield-checkmark",
    },
    {
      id: "4",
      type: "neutral",
      title: "Reminder",
      description: "Don't forget to share your location when walking tonight.",
      time: "5 hours ago",
      unread: false,
      icon: "notifications",
    },
  ]);

  const getIconStyles = (type) => {
    switch (type) {
      case "success": return { color: colors.success, bg: colors.success + "20" };
      case "danger": return { color: colors.danger, bg: colors.danger + "20" };
      default: return { color: colors.textMuted, bg: colors.border + "40" };
    }
  };

  const renderAlert = ({ item }) => {
    const iconStyle = getIconStyles(item.type);

    return (
      <Card style={styles.alertCard}>
        <View style={styles.cardContent}>
          {/* Icône à gauche */}
          <View style={[styles.iconContainer, { backgroundColor: iconStyle.bg }]}>
            <Ionicons name={item.icon} size={24} color={iconStyle.color} />
          </View>

          {/* Texte central */}
          <View style={styles.textContainer}>
            <Text style={typography.h3}>{item.title}</Text>
            <Text style={[typography.body, styles.description]} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={[typography.small, styles.time]}>{item.time}</Text>
          </View>

          {/* Point de notification non lu */}
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </Card>
    );
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="SafeWalk" />

      <View style={styles.container}>
        {/* En-tête de section */}
        <View style={styles.headerSection}>
          <Text style={typography.h1}>Alerts & Notifications</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            Stay updated on your reports and nearby incidents
          </Text>
        </View>

        <View style={styles.subHeader}>
          <Text style={[typography.h3, { fontSize: 14 }]}>Recent Activity</Text>
          <Text style={[typography.small, { color: colors.textMuted }]}>
            {alerts.filter(a => a.unread).length} unread
          </Text>
        </View>

        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderAlert}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  headerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  alertCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  time: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
});