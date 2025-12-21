import { View, Text } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import { globalStyles, typography } from "../../styles";

export default function IncidentsScreen() {
  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Incidents" />

      <View style={styles.container}>
        <Text style={typography.caption}>
          Incident list will be displayed here.
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
