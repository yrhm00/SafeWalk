import { View, Text } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { globalStyles, typography, spacing } from "../../styles";

import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function DangerDetailsScreen() {
  const { params } = useRoute();
  const reportId = params?.reportId;

  const report = useSelector((state) =>
    state.reports.list.find(
      (r) => String(r.id) === String(reportId)
    )
  );

  if (!report) {
    return (
      <View style={globalStyles.screen}>
        <SafeWalkHeader title="Danger details" showBack />
        <View style={styles.container}>
          <Text style={typography.h2}>Report not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Danger details" showBack />

      <View style={styles.container}>
        <Text style={typography.h2}>{report.title}</Text>

        <Text style={typography.body}>{report.description}</Text>

        <Text style={typography.caption}>
          Severity: {report.severity}
          Type : {report.type_id}
        </Text>

        <Text style={typography.caption}>
          Status: {report.status}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
};
