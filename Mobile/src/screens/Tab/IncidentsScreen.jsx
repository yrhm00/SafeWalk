import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  globalStyles,
  colors,
  spacing,
  typography,
  markerColors,
} from "../../styles";

import { useNavigation } from "@react-navigation/native";

// Layout & UI
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import FilterBar from "../../components/danger/FilterBar";

import api from "../../services/api";

export default function IncidentsScreen() {
  const navigation = useNavigation();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "validated", label: "Validated" },
    { key: "resolved", label: "Resolved" },
  ];

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/reports");
      setIncidents(res.data);
    } catch (err) {
      console.log("❌ Error loading incidents:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    if (activeStatus === "all") return incidents;
    return incidents.filter(
      (incident) =>
        incident.status?.toLowerCase() === activeStatus.toLowerCase()
    );
  }, [activeStatus, incidents]);

  // Fonction pour récupérer la couleur de sévérité
  const getSeverityColor = (severity) => {
    // On utilise les couleurs de markerColors.js
    return markerColors[severity?.toLowerCase()] || colors.textMuted;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return colors.success;
      case "validated":
        return colors.primary;
      case "pending":
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  //affichage de la date du report
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown time";

    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return past.toLocaleDateString(); // Affiche la date complète après une semaine
  };

  const renderIncident = ({ item }) => (
    <Card>
      <View style={styles.cardHeader}>
        <View style={styles.iconTitleRow}>
          {/* Cercle de couleur SANS icône, basé sur la sévérité */}
          <View
            style={[
              styles.severityIndicator,
              { backgroundColor: getSeverityColor(item.severity) },
            ]}
          />
          <Text style={typography.h3}>{item.title}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[
              typography.small,
              { color: getStatusColor(item.status), fontWeight: "700" },
            ]}
          >
            {item.status || "Pending"}
          </Text>
        </View>
      </View>

      <Text style={[typography.body, styles.description]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={typography.small}>{formatTimeAgo(item.created_at)}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DangerDetails", { reportId: item.id })
          }
        >
          <Text
            style={[
              typography.small,
              { color: colors.primary, fontWeight: "700" },
            ]}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Incidents" />
      <View style={styles.filterSection}>
        <FilterBar
          options={statusOptions}
          active={activeStatus}
          onChange={setActiveStatus}
          style={styles.staticFilterBar}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncident}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[typography.body, styles.emptyText]}>
              No {activeStatus !== "all" ? activeStatus : ""} incidents found.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: { padding: spacing.md, backgroundColor: colors.background },
  staticFilterBar: { position: "relative", top: 0, left: 0, right: 0 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textSecondary,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconTitleRow: { flexDirection: "row", alignItems: "center" },

  // Nouveau style pour l'indicateur de sévérité (pastille de couleur)
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },

  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  description: { marginTop: spacing.sm, color: colors.textSecondary },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
