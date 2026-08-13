import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Network from "expo-network";
import { colors, spacing } from "../../styles";

export default function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateStatus = (state) => {
      setIsOffline(
        state.isConnected === false || state.isInternetReachable === false
      );
    };

    const checkCurrentState = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        updateStatus(state);
      } catch (error) {
        setIsOffline(false);
      }
    };

    checkCurrentState();

    const subscription = Network.addNetworkStateListener(updateStatus);
    return () => subscription.remove();
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
      <Text style={styles.text}>
        No internet connection. Some data may be out of date.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  text: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
