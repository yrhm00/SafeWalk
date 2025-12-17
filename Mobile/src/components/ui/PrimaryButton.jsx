import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

export default function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "700",
  },
});
