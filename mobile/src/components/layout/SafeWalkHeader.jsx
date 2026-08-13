import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography, spacing, colors, shadows } from "../../styles";

const TOUCH_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export default function SafeWalkHeader({
  title = "SafeWalk",
  showBack = false,
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.leftSide}>
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={TOUCH_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[typography.h2, styles.centerText]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSide}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Tabs", { screen: "Map" })}
            hitSlop={TOUCH_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Go to the map"
          >
            <Image
              source={require("../../../assets/logo-small.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.white,
  },
  container: {
    height: 56,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...shadows.card,
  },
  leftSide: {
    width: 45,
    alignItems: "flex-start",
  },
  rightSide: {
    width: 45,
    alignItems: "flex-end",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
  },
  logo: {
    width: 45,
    height: 45,
  },
});
