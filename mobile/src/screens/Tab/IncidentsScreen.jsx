import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { formatTimeAgo } from "../../utils/date";
import {
  setLoading,
  setReports,
  appendReports,
  REPORTS_LIMIT,
} from "../../store/reportSlice";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import FilterBar from "../../components/danger/FilterBar";
import {
  globalStyles,
  colors,
  spacing,
  typography,
  markerColors,
} from "../../styles";

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "validated", label: "Validated" },
  { key: "resolved", label: "Resolved" },
];

export default function IncidentsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const incidents = useSelector((state) => state.reports.list);
  const loading = useSelector((state) => state.reports.loading);
  const offset = useSelector((state) => state.reports.offset);
  const hasMore = useSelector((state) => state.reports.hasMore);

  const [activeStatus, setActiveStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  const loadReports = async (search) => {
    setError("");
    dispatch(setLoading(true));
    try {
      const response = await api.get("/reports", {
        params: { limit: REPORTS_LIMIT, offset: 0, search },
      });
      dispatch(
        setReports({
          reports: response.data.data,
          hasMore: response.data.pagination.hasMore,
        })
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      dispatch(setLoading(false));
    }
  };

  const loadMoreReports = async () => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    try {
      const response = await api.get("/reports", {
        params: { limit: REPORTS_LIMIT, offset, search: activeSearch },
      });
      dispatch(
        appendReports({
          reports: response.data.data,
          hasMore: response.data.pagination.hasMore,
        })
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadReports("");
  }, []);

  const handleSearch = () => {
    const term = searchInput.trim();
    setActiveSearch(term);
    loadReports(term);
  };

  const handleRefresh = () => {
    loadReports(activeSearch);
  };

  const filteredIncidents =
    activeStatus === "all"
      ? incidents
      : incidents.filter(
          (incident) =>
            incident.status?.toLowerCase() === activeStatus.toLowerCase()
        );

  const getSeverityColor = (severity) => {
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

  const renderIncident = ({ item }) => (
    <Card>
      <View style={styles.cardHeader}>
        <View style={styles.iconTitleRow}>
          <View
            style={[
              styles.severityIndicator,
              { backgroundColor: getSeverityColor(item.severity) },
            ]}
          />
          <Text style={typography.h3}>{item.title}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
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
          <Text style={styles.detailsLink}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
    );
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Incidents" />

      <View style={styles.filterSection}>
        <TextField
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search by title or description..."
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />

        <View style={styles.filterBarWrapper}>
          <FilterBar
            options={STATUS_OPTIONS}
            active={activeStatus}
            onChange={setActiveStatus}
            style={styles.staticFilterBar}
          />
        </View>
      </View>

      {error !== "" && <Text style={styles.errorText}>{error}</Text>}

      {loading && incidents.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncident}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          refreshing={loading}
          onRefresh={handleRefresh}
          onEndReached={loadMoreReports}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text style={[typography.body, styles.emptyText]}>
              {activeSearch !== ""
                ? `No incident found for "${activeSearch}".`
                : "No incidents found."}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: { padding: spacing.md, backgroundColor: colors.background },
  filterBarWrapper: { marginTop: spacing.md },
  staticFilterBar: { position: "relative", top: 0, left: 0, right: 0 },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  loader: { marginTop: 50 },
  footerLoader: { marginVertical: spacing.md },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
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
    backgroundColor: colors.surface,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  description: { marginTop: spacing.sm, color: colors.textSecondary },
  detailsLink: { fontSize: 12, color: colors.primary, fontWeight: "700" },
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
