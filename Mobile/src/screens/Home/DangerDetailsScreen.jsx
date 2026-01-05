import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { globalStyles, colors, spacing, typography } from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import api from "../../services/api";

export default function DangerDetailsScreen() {
  const { params } = useRoute();
  const reportId = params?.reportId;
  const token = useSelector((state) => state.auth.token);

  const report = useSelector((state) =>
    state.reports.list.find((r) => String(r.id) === String(reportId))
  );

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [voteStats, setVoteStats] = useState({ up: 0, down: 0 });

  useEffect(() => {
    if (reportId) {
      fetchSocialData();
    }
  }, [reportId]);

  const fetchSocialData = async () => {
    try {
      const [commentsRes, votesRes] = await Promise.all([
        api.get(`/api/v1/comments/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/api/v1/votes/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setComments(commentsRes.data);
      
      const summary = votesRes.data.summary;
      setVoteStats({
        up: Number(summary.upvotes),
        down: Number(summary.downvotes),
      });
    } catch (err) {
      console.log("Erreur chargement données sociales", err);
    }
  };

  const handleVote = async (value) => {
    try {
      await api.post(
        `/api/v1/votes`,
        { report_id: reportId, value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Succès", "Votre vote a été enregistré.");
      fetchSocialData();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de voter pour le moment.");
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(
        `/api/v1/comments`,
        { report_id: reportId, content: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewComment("");
      fetchSocialData();
    } catch (e) {
      Alert.alert("Erreur", "L'envoi du commentaire a échoué.");
    }
  };

  if (!report) return <View style={globalStyles.screen}><Text>Signalement introuvable</Text></View>;

  // Sécurisation de l'URL image (évite le crash si string vide "")
  const hasImage = report.image_url && report.image_url.length > 0;

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Détails de l'incident" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {hasImage ? (
            <Image
              source={{ uri: report.image_url }}
              style={styles.reportImage}
              resizeMode="cover"
            />
          ) : null}

          {/* Infos principales */}
          <Card style={styles.mainCard}>
            <Text style={typography.h1}>{report.title}</Text>
            <Text style={[typography.body, { marginVertical: spacing.sm }]}>
              {report.description}
            </Text>
            <Text style={typography.small}>
              Statut: {report.status || "En attente"}
            </Text>
             <Text style={typography.small}>
              Gravité: {report.severity}
            </Text>
          </Card>

          {/* Section Votes */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            Fiabilité du signalement
          </Text>
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={[styles.voteButton, { backgroundColor: colors.success }]}
              onPress={() => handleVote(true)}
            >
              <Ionicons name="thumbs-up" size={24} color="white" />
              <Text style={styles.voteText}>Confirmer ({voteStats.up})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.voteButton, { backgroundColor: colors.danger }]}
              onPress={() => handleVote(false)}
            >
              <Ionicons name="thumbs-down" size={24} color="white" />
              <Text style={styles.voteText}>Infirmer ({voteStats.down})</Text>
            </TouchableOpacity>
          </View>

          {/* Section Commentaires */}
          <Text style={[typography.h3, styles.sectionTitle]}>
            Commentaires ({comments.length})
          </Text>
          <Card>
            {comments.length > 0 ? (
              comments.map((item, index) => (
                <View key={index} style={styles.commentItem}>
                  <Text style={typography.caption}>Utilisateur #{item.user_id}</Text>
                  <Text style={typography.body}>{item.content}</Text>
                </View>
              ))
            ) : (
              <Text style={[typography.small, { fontStyle: "italic", marginBottom: 10 }]}>
                Aucun commentaire pour le moment.
              </Text>
            )}

            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <TextField
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChangeText={setNewComment}
                />
              </View>
              <TouchableOpacity style={styles.sendIcon} onPress={postComment}>
                <Ionicons name="send" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.md },
  reportImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: "#e1e1e1",
  },
  mainCard: { borderLeftWidth: 5, borderLeftColor: colors.primary },
  sectionTitle: { marginBottom: spacing.sm, marginTop: spacing.md },
  voteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 12,
    width: "48%",
    justifyContent: "center",
  },
  voteText: { color: "white", fontWeight: "bold", marginLeft: spacing.sm },
  commentItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  sendIcon: { marginLeft: spacing.sm, padding: spacing.sm },
});