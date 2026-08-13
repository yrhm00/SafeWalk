import {
  View,
  Text,
  ScrollView,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { SUPPORT_EMAIL, APP_VERSION } from "../../utils/constants";
import { globalStyles, colors, spacing, typography } from "../../styles";

const FAQ = [
  {
    question: "How do I report an incident?",
    answer:
      "Tap the '+' button in the center of the navigation bar, pick an incident type, describe the situation and submit.",
  },
  {
    question: "Who validates the reports?",
    answer:
      "Other users confirm or deny a report with the vote buttons, and an administrator sets its final status.",
  },
  {
    question: "What data does SafeWalk use?",
    answer:
      "Your location is used to position the reports you create, and the photos you attach are stored on our server. See Privacy Settings for details.",
  },
];

function FAQItem({ question, answer }) {
  return (
    <Card style={styles.faqCard}>
      <Text style={[typography.body, styles.question]}>{question}</Text>
      <Text style={[typography.body, styles.answer]}>{answer}</Text>
    </Card>
  );
}

export default function HelpSupportScreen() {
  const handleContact = async () => {
    try {
      await Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    } catch (error) {
      Alert.alert("No email app found", `You can reach us at ${SUPPORT_EMAIL}.`);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Help & Support" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, styles.pageTitle]}>How can we help?</Text>

        <Text style={[typography.h3, styles.sectionTitle]}>
          Frequently asked questions
        </Text>

        {FAQ.map((item) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}

        <View style={styles.contactSection}>
          <Text style={[typography.h3, styles.contactTitle]}>
            Still need help?
          </Text>
          <PrimaryButton
            title="Contact support by email"
            onPress={handleContact}
          />
        </View>

        <Text style={styles.version}>App version {APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  pageTitle: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  faqCard: { marginBottom: spacing.sm },
  question: { fontWeight: "700" },
  answer: { marginTop: spacing.xs, color: colors.textSecondary },
  contactSection: { marginTop: spacing.xl },
  contactTitle: { textAlign: "center", marginBottom: spacing.md },
  version: {
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.xl,
    color: colors.textMuted,
  },
});
