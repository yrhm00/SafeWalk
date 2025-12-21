import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../styles";

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // 🔵 BOUTON CENTRAL "+"
        if (route.name === "CreateReport") {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateReport")}
            >
              <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
          );
        }

        const iconName = options.tabBarIcon({
          focused: isFocused,
          color: isFocused ? colors.primary : colors.textMuted,
        });

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24, // dépasse la tab bar 
    elevation: 8,
  },
});
