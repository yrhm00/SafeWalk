import { StyleSheet } from "react-native";
import { COLORS } from "./colors";

export const globalStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});
