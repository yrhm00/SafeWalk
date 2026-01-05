import React, { useState } from "react";
import { View, Text, Switch, ScrollView, StyleSheet } from "react-native";
import { globalStyles, colors, spacing, typography } from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";

export default function PrivacySettingsScreen() {
  const [isPublic, setIsPublic] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [anonymousReports, setAnonymousReports] = useState(false);

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Privacy Settings" showBack />
      
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h1, { marginBottom: spacing.md }]}>Data & Privacy</Text>
        
        <PrivacyToggle 
          title="Public Profile" 
          description="Allow others to see your badges and safety contributions."
          value={isPublic}
          onValueChange={setIsPublic}
        />

        <PrivacyToggle 
          title="Location History" 
          description="Save your frequent routes to improve safety alerts."
          value={shareLocation}
          onValueChange={setShareLocation}
        />

        <PrivacyToggle 
          title="Anonymous Reporting" 
          description="Hide your username when submitting new incident reports."
          value={anonymousReports}
          onValueChange={setAnonymousReports}
        />

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.danger }]}>Data Deletion</Text>
          <Text style={[typography.body, { marginTop: spacing.xs, color: colors.textSecondary }]}>
            Permanently delete your account and all associated safety reports. This action cannot be undone.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

function PrivacyToggle({ title, description, value, onValueChange }) {
  return (
    <Card style={styles.toggleCard}>
      <View style={styles.textContainer}>
        <Text style={typography.h3}>{title}</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
});