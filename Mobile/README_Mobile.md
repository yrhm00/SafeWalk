# 📱 SafeWalk – Application Mobile (React Native + Expo)

Bienvenue dans la partie **mobile** du projet SafeWalk.  
Cette application permet d’afficher une carte interactive, de signaler des dangers, de consulter les alertes proches et d’interagir avec l’API SafeWalk.

---

# 🚀 1. Fonctionnalités principales

- **Carte interactive** : Visualisation des zones à risque et de votre position en temps réel.
- **Signalement d'incidents** : Création de rapports détaillés avec photos, type de danger et description.
- **Alertes & Notifications** : Liste des activités récentes à proximité pour assurer la sécurité des utilisateurs.
- **Authentification complète** : Connexion et inscription avec gestion sécurisée des sessions (JWT).
- **Profil Utilisateur** : Personnalisation du profil et mise à jour des informations personnelles.

---

# 🛠️ 2. Technologies utilisées

- **React Native & Expo** : Framework principal pour le développement cross-platform.
- **Redux Toolkit** : Gestion centralisée de l'état (Auth, Reports, UI).
- **React Navigation** : Navigation imbriquée via Stack et Tab Navigators.
- **Axios** : Client HTTP pour la communication avec l'API backend.
- **Expo SecureStore** : Stockage sécurisé des jetons d'authentification sur l'appareil.
- **Expo Image Picker** : Gestion de la caméra et de la galerie pour les avatars et rapports.

---

# 📂 3. Structure du projet

Voici l'organisation actuelle du dossier `src/` basée sur l'architecture du projet :

```text
Mobile/
├── assets/             # Logos (logo.png), splash screen et icônes applicatives
└── src/
    ├── components/
    │   ├── danger/     # Composants liés aux incidents (ex: FilterBar)
    │   ├── layout/     # SafeWalkHeader, SplashScreen
    │   └── ui/         # Composants atomiques (Card, TextField, PrimaryButton)
    ├── navigation/     # Configuration des Navigators et CustomTabBar
    ├── screens/        # Écrans organisés par modules (Auth, Home, Profile, Tab)
    ├── services/       # Instances API (Axios) et gestion SecureStore
    ├── store/          # Redux Store et Slices (authSlice, reportSlice)
    └── styles/         # Thème global, couleurs, typo et espacements