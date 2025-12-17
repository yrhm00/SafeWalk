# 📱 SafeWalk – Application Mobile (React Native + Expo)

Bienvenu dans la partie **mobile** du projet SafeWalk.  
Cette application permet d’afficher une carte interactive, de signaler des dangers, de consulter les alertes proches et d’interagir avec l’API SafeWalk.

---

# 🚀 1. Fonctionnalités principales

- Affichage d’une **carte interactive**
- Consultation des **dangers signalés**
- Création d’un signalement (photo, position, type, description)
- Authentification (login + register)
- Profil utilisateur
- Navigation moderne via **React Navigation**
- Connexion en temps réel avec l’API SafeWalk (backend)

---

# 🛠️ 2. Technologies utilisées

- **React Native**
- **Expo**
- **React Navigation**
- **Axios**
- **Context API**
- **AsyncStorage** (plus tard)
- **React Native Maps** *(sera ajouté plus tard)*

---

# 📂 3. Structure du projet

```
Mobile/
│
├── App.js
├── app.json
├── package.json
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── styles/
│   └── utils/
│
└── README.md
```

---

# 📦 4. Installation du projet

## 4.1. Cloner le projet

```bash
git clone https://github.com/<ton-repo>/SafeWalk.git
cd SafeWalk/Mobile
```

---

## 4.2. Installer les dépendances

```bash
npm install
```

---

# ▶️ 5. Lancer l'application

```bash
npm run start
```

Ensuite :

- Scanner le QR code (Expo Go)
- ou lancer dans un émulateur

---

# 🔌 6. Configuration API

```
src/api/axiosClient.js
```

```js
baseURL: "http://10.0.2.2:3001/api";  
```

---

# 🔑 7. Authentification

Gestion via :

- **AuthContext**
- **React Navigation**
- Token stocké en mémoire (AsyncStorage bientôt)

---

# 🧪 8. Écrans inclus

- Login
- Register
- Home
- DangerDetails
- CreateReport
- Profile

---

# 🧭 9. Navigation

```
AppNavigator
│
├── AuthNavigator (Login/Register)
└── TabNavigator
     ├── HomeNavigator
     └── ProfileScreen
```

---

# 🗺️ 10. À venir

- Carte interactive
- Upload photo
- Notifications
- Mode offline

---

# 🏁 11. Support

Consulte la documentation backend ou contacte l’équipe.

---

Merci d’utiliser **SafeWalk Mobile** 🚀
