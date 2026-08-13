import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { formatTimeAgo } from "../../utils/date";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import { globalStyles, colors, spacing, typography } from "../../styles";

const STATUS_INFO = {
  pending: {
    icon: "time-outline",
    color: colors.warning,
    title: "Your report is awaiting review",
  },
  validated: {
    icon: "checkmark-circle",
    color: colors.primary,
    title: "Your report was validated",
  },
  resolved: {
    icon: "shield-checkmark",
    color: colors.success,
    title: "Your report was resolved",
  },
};

const DEFAULT_STATUS_INFO = {
  icon: "notifications",
  color: colors.textMuted,
  title: "Report update",
};

export default function MyReportsScreen() {
  const navigation = useNavigation();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadMyReports = async () => {
    setError("");
    try {
      const response = await api.get("/reports/user/me");
      setReports(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    const loadFirstTime = async () => {
      await loadMyReports();
      setLoading(false);
    };

    loadFirstTime();

    const unsubscribe = navigation.addListener("focus", loadMyReports);
    return unsubscribe;
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMyReports();
    setRefreshing(false);
  };

  const getStatusInfo = (status) => {
    return STATUS_INFO[status?.toLowerCase()] || DEFAULT_STATUS_INFO;
  };

  const renderReport = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DangerDetails", { reportId: item.id })
        }
      >
        <Card style={styles.reportCard}>
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={statusInfo.icon}
                size={24}
                color={statusInfo.color}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={typography.h3}>{statusInfo.title}</Text>
              <Text
                style={[typography.body, styles.description]}
                numberOfLines={2}
              >
                {item.title} — {item.description}
              </Text>
              <Text style={[typography.small, styles.time]}>
                {formatTimeAgo(item.created_at)}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Your reports" />

      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={[typography.h3, styles.subHeaderTitle]}>
            Recent activity
          </Text>
          <Text style={[typography.small, styles.subHeaderCount]}>
            {reports.length} total
          </Text>
        </View>

        {error !== "" && <Text style={styles.errorText}>{error}</Text>}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderReport}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                You have not reported any incident yet.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  subHeaderTitle: { fontSize: 14 },
  subHeaderCount: { color: colors.textMuted },
  listContent: { paddingBottom: spacing.xl },
  loader: { marginTop: 50 },
  reportCard: {
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
    backgroundColor: colors.surface,
  },
  textContainer: { flex: 1 },
  description: {
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  time: {
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textSecondary,
  },
});
