import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";
import { colors } from "../../styles";

const { width } = Dimensions.get("window");
const LOGO_SIZE = width * 0.5;
const ENTRY_DURATION = 1000;
const PULSE_DURATION = 800;

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: PULSE_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: PULSE_DURATION,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    const entry = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ENTRY_DURATION,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: ENTRY_DURATION,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]);

    entry.start(() => pulse.start());

    return () => {
      entry.stop();
      pulse.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../../assets/logo.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
