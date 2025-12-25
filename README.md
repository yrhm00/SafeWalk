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

Avant de lancer les différentes parties, copiez le fichier de configuration (qui contient les vraies données) :
```bash
cp .env.example .env
```

### 1. Backend (Serveur API)

Le backend doit être lancé en premier pour que les applications frontend et mobile puissent fonctionner.

1.  Ouvrez un terminal et naviguez dans le dossier `backend` :
    ```bash
    cd backend
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Configurez vos variables d'environnement :
    *   Créez un fichier `.env` dans le dossier `backend` ou copiez celui de la racine :
    ```bash
    cp ../.env .env
    ```
4.  Lancez le serveur :
    ```bash
    npm run dev
    ```
    Le serveur démarrera généralement sur `http://localhost:3000` (ou le port défini).

### 2. Frontend (Dashboard Web)

1.  Ouvrez un nouveau terminal et naviguez dans le dossier `frontend` :
    ```bash
    cd frontend
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez l'interface web :
    ```bash
    npm run dev
    ```
    L'application sera accessible via l'URL indiquée dans le terminal (souvent `http://localhost:5173`).

### 3. Mobile (Application iOS/Android)

1.  Ouvrez un nouveau terminal et naviguez dans le dossier `mobile` :
    ```bash
    cd mobile
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez Expo :
    ```bash
    npm start
    ```
4.  Un QR code s'affichera.
    *   **Android** : Scannez-le avec l'application "Expo Go".
    *   **iOS** : Scannez-le avec l'application Appareil photo (nécessite Expo Go installé).
    *   Vous pouvez aussi appuyer sur `a` pour lancer un émulateur Android ou `i` pour un simulateur iOS (si configurés).

---

## 🛠 Technologies Utilisées

*   **Backend** : Node.js, Express, PostgreSQL, Prisma (ou autre ORM selon le projet), Swagger.
*   **Frontend** : React, Vite.
*   **Mobile** : React Native, Expo.

## 📝 Auteurs

Projet réalisé dans le cadre du cours de développement mobile/web.
