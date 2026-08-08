# SafeWalk

SafeWalk est une application complète (Mobile, Web, Backend) conçue pour améliorer la sécurité urbaine. Elle permet aux utilisateurs de signaler des incidents, de voir des zones de danger et d'interagir avec une carte communautaire.

## Architecture du Projet

Le projet est divisé en trois parties principales :
*   **backend/** : API Node.js/Express qui gère les données, les utilisateurs et les signalements.
*   **frontend/** : Dashboard Web (React/Vite) pour l'administration et la visualisation (Backoffice).
*   **mobile/** : Application mobile (React Native/Expo) pour les utilisateurs finaux.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
*   [Node.js](https://nodejs.org/) (version LTS recommandée)
*   [Git](https://git-scm.com/)
*   Une base de données PostgreSQL (pour le backend)

---

## 🚀 Installation et Lancement

### 0. Configuration Initiale

1.  Copiez le fichier de configuration global :
    ```bash
    cp .env.example .env
    ```

### 1. Backend & Base de Données (Via Docker)

Cette commande va créer la base de données, l'initialiser avec les tables nécessaires, installer les dépendances du backend et lancer le serveur API.

1.  À la racine du projet, lancez :
    ```bash
    docker compose up --build
    ```
    *   L'API sera accessible sur `http://localhost:3001`.
    *   La documentation API (Swagger) est disponible sur `http://localhost:3001/api-docs`.
    *   Le serveur redémarre automatiquement en cas de modification (mode dev avec `nodemon`).
    *   La base de données sera automatiquement initialisée.

### 2. Frontend (Dashboard Web)

1.  Ouvrez un nouveau terminal et naviguez dans le dossier `frontend` :
    ```bash
    cd frontend
    ```
2.  Installez les dépendances et lancez le site :
    ```bash
    npm install
    npm run dev
    ```
    L'application sera accessible via l'URL indiquée (souvent `http://localhost:5173`).

### 3. Mobile (Application iOS/Android)

1.  **Configuration IP** :
    *   Ouvrez `mobile/src/config.js`.
    *   Remplacez l'IP par celle de votre machine (ex: `192.168.1.x`). *Ne laissez pas localhost.*

2.  Ouvrez un nouveau terminal et naviguez dans le dossier `mobile` :
    ```bash
    cd mobile
    ```
3.  Installez les dépendances et lancez Expo :
    ```bash
    npm install
    npx expo start
    ```
4.  Lancez l'application :
    *   **Sur téléphone physique** : Scannez le QR code avec l'application **Expo Go**. (Assurez-vous que le téléphone est sur le même réseau WiFi que votre ordinateur).
    *   **Sur ordinateur** : Appuyez sur `i` pour lancer le simulateur iOS (Mac uniquement) ou `a` pour l'émulateur Android.

---

## 🛠 Technologies Utilisées

*   **Backend** : Node.js, Express, PostgreSQL, Swagger.
*   **Frontend** : React, Vite.
*   **Mobile** : React Native, Expo.

## 📝 Auteurs

Projet réalisé dans le cadre du cours de développement mobile/web.
