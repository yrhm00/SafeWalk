import { View, Text } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { globalStyles, typography } from "../../styles";

export default function AlertsScreen() {
  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Alerts" />

      <View style={styles.container}>
        <Text style={typography.caption}>
          Notifications will appear here.
        </Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
};
