import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { globalStyles, colors, spacing, typography } from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
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

  // Chargement des données sociales (commentaires et votes)
  useEffect(() => {
    fetchSocialData();
  }, [reportId]);

  const fetchSocialData = async () => {
    try {
      const [commentsRes, votesRes] = await Promise.all([
        api.get(`/api/v1/reports/${reportId}/comments`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/api/v1/reports/${reportId}/votes`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setComments(commentsRes.data);
      // Logique simplifiée pour compter les votes (true = up, false = down)
      const stats = votesRes.data.reduce((acc, v) => {
        v.value ? acc.up++ : acc.down++;
        return acc;
      }, { up: 0, down: 0 });
      setVoteStats(stats);
    } catch (err) {
      console.log("Erreur chargement données sociales", err);
    }
  };

  const handleVote = async (value) => {
    try {
      await api.post(`/api/v1/reports/${reportId}/votes`, { value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Succès", "Votre vote a été enregistré.");
      fetchSocialData();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de voter pour le moment.");
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/api/v1/reports/${reportId}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewComment("");
      fetchSocialData();
    } catch (e) {
      Alert.alert("Erreur", "L'envoi du commentaire a échoué.");
    }
  };

  if (!report) return <Text>Signalement introuvable</Text>;

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Détails de l'incident" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Infos principales */}
        <Card style={styles.mainCard}>
          <Text style={typography.h1}>{report.title}</Text>
          <Text style={[typography.body, { marginVertical: spacing.sm }]}>{report.description}</Text>
          <Text style={typography.small}>Statut: {report.status || "En attente"}</Text>
        </Card>

        {/* Section Votes : Confirmer ou Infirmer */}
        <Text style={[typography.h3, styles.sectionTitle]}>Fiabilité du signalement</Text>
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
        <Text style={[typography.h3, styles.sectionTitle]}>Commentaires ({comments.length})</Text>
        <Card>
          {comments.map((item, index) => (
            <View key={index} style={styles.commentItem}>
              <Text style={typography.caption}>Utilisateur #{item.user_id}</Text>
              <Text style={typography.body}>{item.content}</Text>
            </View>
          ))}
          
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
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.md },
  mainCard: { borderLeftWidth: 5, borderLeftColor: colors.primary },
  sectionTitle: { marginBottom: spacing.sm, marginTop: spacing.md },
  voteContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  voteButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: spacing.md, 
    borderRadius: 12, 
    width: "48%",
    justifyContent: "center"
  },
  voteText: { color: "white", fontWeight: "bold", marginLeft: spacing.sm },
  commentItem: { 
    paddingVertical: spacing.sm, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    marginBottom: spacing.xs
  },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  sendIcon: { marginLeft: spacing.sm, padding: spacing.sm }
});