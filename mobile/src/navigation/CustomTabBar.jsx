import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../styles";

/**
 * Composant de barre d'onglets personnalisée (Bottom Tab Bar).
 * @param {Object} state - État de la navigation contenant l'index actuel et les routes.
 * @param {Object} descriptors - Options de configuration pour chaque écran de l'onglet.
 * @param {Object} navigation - Objet de navigation pour déclencher les changements d'écran.
 */
export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        // Récupère les options définies pour cet écran spécifique
        const { options } = descriptors[route.key];
        
        // Vérifie si l'onglet actuel est celui sur lequel l'utilisateur se trouve
        const isFocused = state.index === index;

        /**
         * 🔵 CAS PARTICULIER : BOUTON CENTRAL "+" (CreateReport)
         * Ce bouton est stylisé différemment (plus grand et surélevé).
         */
        if (route.name === "CreateReport") {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateReport")}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
          );
        }

        // Récupère le nom de l'icône via la fonction tabBarIcon définie dans le Navigator
        const iconName = options.tabBarIcon ? options.tabBarIcon({
          focused: isFocused,
          color: isFocused ? colors.primary : colors.textMuted,
        }) : "help-outline";

        // Détermine le label à afficher (soit tabBarLabel, soit le nom de la route par défaut)
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.6}
          >
            {/* Icône de l'onglet */}
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? colors.primary : colors.textMuted}
            />
            
            {/* ✅ Libellé sous l'icône */}
            <Text 
              style={[
                styles.tabLabel, 
                { color: isFocused ? colors.primary : colors.textMuted }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Conteneur principal de la barre d'onglets
  container: {
    flexDirection: "row",
    height: 75, // Augmenté légèrement pour accueillir le texte
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 5, // Espace pour décoller le texte du bas de l'écran
  },
  // Style pour chaque onglet individuel
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Style pour le bouton central "+"
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30, // Fait dépasser le bouton au-dessus de la barre
    elevation: 8, // Ombre sur Android
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // ✅ Style pour le texte sous les icônes
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
});