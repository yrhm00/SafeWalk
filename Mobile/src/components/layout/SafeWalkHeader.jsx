import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { typography, spacing, colors } from "../../styles";

export default function SafeWalkHeader() {
  return (
    <View style={styles.container}>
      <Text style={typography.h2}>SafeWalk</Text>

      <TouchableOpacity>
        <Ionicons
          name="person-circle-outline"
          size={30}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
};
