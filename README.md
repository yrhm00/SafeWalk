# SafeWalk - Projet Complet

Application SafeWalk complète comprenant un Backend (Node.js/Express), un Frontend (React) et une Application Mobile (React Native/Expo).

Le backend a été refait pour suivre strictement l'architecture MVC et les bonnes pratiques enseignées dans les laboratoires Node.js.

## 🏗️ Architecture Backend

Le backend suit l'architecture MVC enseignée dans les 7 laboratoires :

```
backend/
├── database/database.js       # Pool PostgreSQL (Labo 2)
├── middleware/
│   ├── identification/
│   │   ├── basic.js           # Auth Basic (Labo 4)
│   │   └── jwt.js             # Auth JWT (Labo 5)
│   └── autorisation/
│       └── checkRole.js       # Vérification des rôles (Labo 4)
├── src/
│   ├── model/                 # Accès base de données (Labo 2)
│   ├── controler/             # Logique métier (Labo 2)
│   └── routes/                # Endpoints HTTP (Labo 1)
├── validation/                # Schémas VineJS (Labo 4)
└── server.js                  # Point d'entrée (Labo 1)
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** (v18 ou supérieur)
- **Docker** et **Docker Compose** (pour la base de données)
- **Git**

### 1. Backend (Serveur & Base de données)

C'est la partie la plus importante, à lancer en premier.

1.  **Installation des dépendances** :
    ```bash
    npm install
    ```

2.  **Configuration** :
    Copiez le fichier d'exemple `.env.example` vers `.env` (les valeurs par défaut devraient fonctionner) :
    ```bash
    cp .env.example .env
    ```

3.  **Démarrage de la Base de données** :
    Lance PostgreSQL avec PostGIS dans un conteneur Docker :
    ```bash
    npm run db:start
    ```

4.  **Initialisation des données** :
    Crée les tables et ajoute les utilisateurs de test :
    ```bash
    npm run db:seed
    ```

5.  **Démarrage du Serveur** :
    ```bash
    npm run dev
    ```
    Le backend tourne sur : **http://localhost:3001**

### 2. Frontend (Backoffice Web)

Ouvrez un **nouveau terminal**.

1.  **Installation & Démarrage** :
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
2.  **Accès** :
    Le site web sera accessible sur : **http://localhost:5173**

### 3. Mobile (Application Citoyen)

Ouvrez un **nouveau terminal**.

1.  **Installation & Démarrage** :
    ```bash
    cd mobile
    npm install
    npx expo start
    ```
2.  **Test** :
    - Scannez le **QR Code** avec l'application **Expo Go** (Android) ou l'appareil photo (iOS).
    - Assurez-vous que votre téléphone est sur le **même réseau Wi-Fi** que votre ordinateur.

---

## 👥 Comptes de test

Tous les mots de passe sont hashés avec **argon2** (Labo 5).

### Admin (Backoffice)
- **Email:** `admin@safewalk.local`
- **Password:** `admin`

### Utilisateurs (Mobile)
- **Email:** `yassin@mail.com` / **Password:** `password`
- **Email:** `florian@mail.com` / **Password:** `password`
- **Email:** `aboub@mail.com` / **Password:** `password`
- **Email:** `emma@mail.com` / **Password:** `password`

---

## 📡 Documentation API

### Authentification (Labo 4 & 5)

- **Méthode recommandée : JWT (Labo 5)**
    1.  `POST /users/login` avec email/password pour obtenir un token.
    2.  Envoyer le header `Authorization: Bearer <token>` pour les requêtes suivantes.

### Endpoints Principaux

#### Users
- `POST /users/register` - Inscription
- `POST /users/login` - Connexion
- `GET /users/me` - Profil utilisateur connecté
- `GET /users` - Liste utilisateurs (Admin)

#### Reports (Signalements)
- `GET /reports` - Liste tous les rapports
- `POST /reports` - Créer un rapport
- `PATCH /reports/:id` - Modifier un rapport (Admin)
- `GET /reports/nearby` - Rechercher à proximité (Géolocalisation)

#### Zones & Types
- `GET /zones`, `POST /zones`, `PATCH /zones/:id`
- `GET /report-types`, `POST /report-types`, `PATCH /report-types/:id`

---

## 🛠️ Commandes Utiles (Backend)

```bash
npm run setup       # Installe les dépendances
npm run db:start    # Démarre PostgreSQL avec Docker
npm run db:stop     # Arrête PostgreSQL
npm run db:restart  # Redémarre PostgreSQL
npm run db:seed     # Initialise/réinitialise la base de données
npm run dev         # Démarre le serveur en mode développement
```

## ❓ Dépannage

### Port 5432 déjà utilisé
Si vous avez déjà PostgreSQL installé localement, changez le port dans `docker-compose.yml` (ex: `5433:5432`) et mettez à jour `HOSTDB` dans `.env`.

### Mobile : "Network request failed"
Si l'app mobile n'arrive pas à joindre le backend :
1.  Vérifiez que votre téléphone et PC sont sur le même Wi-Fi.
2.  Dans le code mobile, remplacez `localhost` par l'adresse IP locale de votre PC (ex: `192.168.1.x`).
