import { View, Text } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { globalStyles, typography, spacing } from "../../styles";

export default function DangerDetailsScreen({ route }) {
  const { report } = route.params;

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Danger details" showBack />

      <View style={styles.container}>
        <Text style={typography.h2}>{report.title}</Text>

        <Text style={typography.body}>
          Severity: {report.severity}
        </Text>

        <Text style={typography.caption}>
          Latitude: {report.latitude}
        </Text>
        <Text style={typography.caption}>
          Longitude: {report.longitude}
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
