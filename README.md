# SafeWalk

Application SafeWalk composée de trois parties :

- **Backend** : API Node.js/Express + PostgreSQL (PostGIS)
- **Frontend** : interface web (React + Vite)
- **Mobile** : application mobile (React Native / Expo)

---

## 1. Prérequis

- **Node.js** (version récente, ex. ≥ 18)
- **npm**
- **PostgreSQL** avec **PostGIS**
- (Mobile) **Expo** / émulateur Android ou iOS installés

---

## 2. Installation générale du projet

Depuis la racine du projet (`SafeWalk`) :

```bash
# se placer à la racine
cd SafeWalk

# installer les dépendances backend (via package.json racine)
npm install

# installer les dépendances du frontend
cd frontend
npm install
cd ..

# installer les dépendances du mobile
cd mobile
npm install
cd ..
```

---

## 3. Backend

### 3.1. Structure

Le backend se trouve dans le dossier :

```text
backend/
  server.js
  database/
  middleware/
  src/
    routes/
    controler/
    model/
  validation/
  utils/
```

Le `package.json` **à la racine** contient les scripts pour le backend :

```jsonc
"scripts": {
  "dev": "nodemon backend/server.js",
  "initDB": "node scripts/JS/initDB.js"
}
```

### 3.2. Configuration de la base de données

Créer un fichier `.env` à la **racine** du projet (non versionné) :

```env
HOSTDB=localhost
USERDB=postgres
PASSWORDDB=mot_de_passe_postgres
DBNAME=safewalk
```

Adapter les valeurs selon ta configuration PostgreSQL.

### 3.3. Initialisation de la base

Toujours depuis la racine du projet :

```bash
# création / réinitialisation des tables + données de base
npm run initDB
```

Ce script exécute `scripts/JS/initDB.js`, qui lance le SQL `scripts/SQL/initDB.sql`.

### 3.4. Lancer le backend

Depuis la racine :

```bash
npm run dev
```

L’API sera disponible sur :

```text
http://localhost:3001
```

(CORS est configuré pour accepter le frontend Vite en `http://localhost:5173`.)

---

## 4. Frontend (Web)

### 4.1. Dossier

```text
frontend/
  src/
  vite.config.mjs
  package.json
```

### 4.2. Installation

(À faire une fois, voir section Installation générale)

```bash
cd frontend
npm install
```

### 4.3. Lancer le frontend

```bash
cd frontend
npm run dev
```

Par défaut Vite démarre sur :

```text
http://localhost:5173
```

Le frontend communique avec le backend `http://localhost:3001`.

---

## 5. Mobile (React Native / Expo)

### 5.1. Dossier

```text
mobile/
  App.js
  src/
  package.json
```

### 5.2. Installation

(À faire une fois, voir section Installation générale)

```bash
cd mobile
npm install
```

### 5.3. Lancer l’application mobile

Toujours depuis `mobile/` :

```bash
cd mobile

# démarrer Expo (choisir la plateforme depuis l’interface Expo)
npm run start

# ou directement :
npm run android
npm run ios
npm run web
```

- Scanner le QR code avec l’application Expo Go sur téléphone
- ou utiliser un émulateur Android / iOS.

---

## 6. Scripts utiles (récap)

Depuis la **racine** :

```bash
# initialiser la base de données
npm run initDB

# lancer le backend
npm run dev
```

Depuis `frontend/` :

```bash
npm run dev
```

Depuis `mobile/` :

```bash
npm run start
# ou npm run android / ios / web
```

---

## 7. Gestion des fichiers ignorés

Un fichier `.gitignore` à la racine exclut notamment :

- `node_modules/`
- `dist/`, `build/`
- `.env`
- dossiers spécifiques mobile (`android/`, `ios/`)
- fichiers temporaires et de configuration IDE (`.idea/`, `.vscode/`)

---

## 8. Notes

- Ne pas commit le fichier `.env`.
- Les scripts SQL d’init (`scripts/SQL/initDB.sql`) créent les tables et insèrent des données exemple (admin, utilisateurs, rapports, etc.).

