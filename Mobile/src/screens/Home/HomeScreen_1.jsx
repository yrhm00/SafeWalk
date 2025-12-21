import { View, Text, FlatList } from "react-native";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import DangerCard from "../../components/danger/DangerCard";
import FloatingButton from "../../components/ui/FloatingButton";
import { globalStyles, spacing } from "../../styles";

const FAKE_DANGERS = [
  {
    id: "1",
    title: "Poor lighting",
    description: "Street light broken near the park",
    severity: "medium",
  },
  {
    id: "2",
    title: "Suspicious activity",
    description: "Group of people acting strangely",
    severity: "high",
  },
  {
    id: "3",
    title: "Broken sidewalk",
    description: "Sidewalk damaged, hard to walk",
    severity: "low",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={globalStyles.screen}>
      {/* Header */}
      <SafeWalkHeader />

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text>🗺️ Map will be here</Text>
      </View>

      {/* Danger list */}
      <FlatList
        data={FAKE_DANGERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={({ item }) => (
          <DangerCard
            danger={item}
            onPress={() =>
              navigation.navigate("DangerDetails", { id: item.id })
            }
          />
        )}
      />

      {/* Floating action button */}
      <FloatingButton
        onPress={() => navigation.navigate("CreateReport")}
      />
    </View>
  );
}

const styles = {
  mapPlaceholder: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
};
