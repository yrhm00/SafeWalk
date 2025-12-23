import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { typography, spacing, colors, shadows } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeWalkHeader({
  title = "SafeWalk",
  showBack = false,
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <Text style={typography.h2}>{title}</Text>

        <TouchableOpacity>
          <Ionicons
            name="person-circle-outline"
            size={30}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safe: {
    backgroundColor: colors.white,
  },
  // SafeWalkHeader styles
  container: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...shadows.card,
  },
};
