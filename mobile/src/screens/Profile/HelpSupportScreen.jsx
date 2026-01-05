import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, colors, spacing, typography } from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function HelpSupportScreen() {
  const handleContact = () => {
    Linking.openURL("mailto:support@safewalk.com");
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Help & Support" showBack />
      
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h1, { marginBottom: spacing.md }]}>How can we help?</Text>

        <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Frequently Asked Questions</Text>
        
        <FAQItem 
          question="How do I report an incident?" 
          answer="Click the '+' button in the center of the navigation bar and fill out the details."
        />
        <FAQItem 
          question="Who validates the reports?" 
          answer="Reports are validated by the community through votes and reviewed by our safety moderators."
        />
        <FAQItem 
          question="Is my data secure?" 
          answer="Yes, all location data is encrypted and only shared with authorities if you explicitly choose to."
        />

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[typography.h3, { textAlign: "center", marginBottom: spacing.md }]}>
            Still need help?
          </Text>
          <PrimaryButton title="Contact Support via Email" onPress={handleContact} />
        </View>

        <Text style={[typography.small, { textAlign: "center", marginTop: spacing.xl, color: colors.textMuted }]}>
          App Version 1.0.4 (Build 2026)
        </Text>
      </ScrollView>
    </View>
  );
}

function FAQItem({ question, answer }) {
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <Text style={[typography.body, { fontWeight: "700" }]}>{question}</Text>
      <Text style={[typography.body, { marginTop: spacing.xs, color: colors.textSecondary }]}>
        {answer}
      </Text>
    </Card>
  );
}