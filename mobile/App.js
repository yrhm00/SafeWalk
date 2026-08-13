import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/store/store";
import Navigation from "./src/navigation";
import SplashScreen from "./src/components/layout/SplashScreen";
import OfflineBanner from "./src/components/layout/OfflineBanner";
import api from "./src/services/api";
import { getToken, clearSession } from "./src/services/secureStore";
import { setCredentials, logout } from "./src/store/authSlice";

const MainApp = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      let token = null;
      try {
        token = await getToken();
        if (!token) {
          dispatch(logout());
          return;
        }
        const response = await api.get("/users/me");
        dispatch(setCredentials({ token, user: response.data }));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await clearSession();
          dispatch(logout());
        } else {
          dispatch(setCredentials({ token, user: null }));
        }
      }
    };

    restoreSession();

    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !minimumTimeElapsed) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.app}>
      <OfflineBanner />
      <Navigation />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
