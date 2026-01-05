import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { typography, spacing, colors, shadows } from "../../styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeWalkHeader({
  title = "SafeWalk",
  showBack = false,
}) {
  const navigation = useNavigation();
  const sideWidth = 45; 

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* CÔTÉ GAUCHE */}
        <View style={{ width: sideWidth, alignItems: 'flex-start' }}>
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        {/* CENTRE */}
        <View style={styles.titleContainer}>
          <Text style={[typography.h2, styles.centerText]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* CÔTÉ DROIT : On navigue vers "Map" (le nom du Tab) */}
        <View style={{ width: sideWidth, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => navigation.navigate("Map")}>
            <Image 
              source={require("../../../assets/logo.png")} 
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
  titleContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  logo: {
    width: 45,
    height: 45,
  },
});