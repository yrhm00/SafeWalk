import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/store/store";
import Navigation from "./src/navigation";

// Imports pour la gestion de la session et du SplashScreen
import { restoreSession } from "./src/store/authSlice";
import SplashScreen from "./src/components/layout/SplashScreen";

/**
 * Composant principal contenant la logique de chargement.
 * On utilise un composant séparé pour pouvoir accéder au store Redux via useSelector.
 */
function MainApp() {
  const dispatch = useDispatch();

  // On récupère l'état 'loading' défini dans le authSlice
  const { loading } = useSelector((state) => state.auth);

  // Etat pour gérer le temps minimum d'affichage
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    // 1. Lancer la restauration de session
    dispatch(restoreSession());

    // 2. Lancer un minuteur de 3 secondes
    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 3000); // 3000ms = 3 secondes

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Si l'application est en train de charger (vérification du token), on affiche l'animation
  //On ne cache le Splash que si l'API a fini ET que les 3 secondes sont passées
  if (loading || !minimumTimeElapsed) {
    return <SplashScreen />;
  }

  // Une fois le chargement terminé, on affiche la navigation principale
  return <Navigation />;
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
