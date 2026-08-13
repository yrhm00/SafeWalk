import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import { globalStyles, colors, spacing, typography } from "../../styles";

export default function DangerDetailsScreen() {
  const { params } = useRoute();
  const reportId = params?.reportId;

  const storedReport = useSelector((state) =>
    state.reports.list.find((item) => String(item.id) === String(reportId))
  );

  const [report, setReport] = useState(storedReport || null);
  const [comments, setComments] = useState([]);
  const [voteStats, setVoteStats] = useState({ up: 0, down: 0 });
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      setReport(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.get(`/comments/report/${reportId}`);
      setComments(response.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const loadVotes = async () => {
    try {
      const response = await api.get(`/votes/report/${reportId}`);
      setVoteStats({
        up: Number(response.data.summary.upvotes),
        down: Number(response.data.summary.downvotes),
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      await loadReport();
      await loadComments();
      await loadVotes();
      setLoading(false);
    };

    loadDetails();
  }, []);

  const handleVote = async (value) => {
    setError("");
    try {
      await api.post("/votes", { report_id: Number(reportId), value });
      await loadVotes();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    setError("");
    try {
      await api.post("/comments", {
        report_id: Number(reportId),
        content: newComment.trim(),
      });
      setNewComment("");
      await loadComments();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.screen}>
        <SafeWalkHeader title="Incident details" showBack />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={globalStyles.screen}>
        <SafeWalkHeader title="Incident details" showBack />
        <Text style={styles.emptyText}>
          {error !== "" ? error : "Report not found."}
        </Text>
      </View>
    );
  }

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={typography.caption}>{item.user_name || item.username}</Text>
      <Text style={typography.body}>{item.content}</Text>
    </View>
  );

  const listHeader = (
    <View>
      {report.image_url ? (
        <Image
          source={{ uri: report.image_url }}
          style={styles.reportImage}
          resizeMode="cover"
        />
      ) : null}

      <Card style={styles.mainCard}>
        <Text style={typography.h1}>{report.title}</Text>
        <Text style={[typography.body, styles.description]}>
          {report.description}
        </Text>
        <Text style={typography.small}>Status: {report.status}</Text>
        <Text style={typography.small}>Severity: {report.severity}</Text>
      </Card>

      <Text style={[typography.h3, styles.sectionTitle]}>Reliability</Text>
      <View style={styles.voteContainer}>
        <TouchableOpacity
          style={[styles.voteButton, styles.confirmButton]}
          onPress={() => handleVote(true)}
        >
          <Ionicons name="thumbs-up" size={24} color={colors.white} />
          <Text style={styles.voteText}>Confirm ({voteStats.up})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.voteButton, styles.denyButton]}
          onPress={() => handleVote(false)}
        >
          <Ionicons name="thumbs-down" size={24} color={colors.white} />
          <Text style={styles.voteText}>Deny ({voteStats.down})</Text>
        </TouchableOpacity>
      </View>

      {error !== "" && <Text style={styles.errorText}>{error}</Text>}

      <Text style={[typography.h3, styles.sectionTitle]}>
        Comments ({comments.length})
      </Text>
    </View>
  );

  const listFooter = (
    <View style={styles.inputRow}>
      <View style={styles.inputField}>
        <TextField
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
      </View>
      <TouchableOpacity style={styles.sendIcon} onPress={handlePostComment}>
        <Ionicons name="send" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Incident details" showBack />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          ListEmptyComponent={
            <Text style={styles.noComment}>No comment yet.</Text>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  listContent: { padding: spacing.md },
  loader: { marginTop: 50 },
  reportImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
  },
  mainCard: { borderLeftWidth: 5, borderLeftColor: colors.primary },
  description: { marginVertical: spacing.sm },
  sectionTitle: { marginBottom: spacing.sm, marginTop: spacing.md },
  voteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: 12,
    width: "48%",
  },
  confirmButton: { backgroundColor: colors.success },
  denyButton: { backgroundColor: colors.danger },
  voteText: {
    color: colors.white,
    fontWeight: "bold",
    marginLeft: spacing.sm,
  },
  commentItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noComment: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  inputField: { flex: 1 },
  sendIcon: { marginLeft: spacing.sm, padding: spacing.sm },
});
