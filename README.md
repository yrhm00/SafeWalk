# SafeWalk - Refonte Backend selon Méthodologie du Professeur

Application SafeWalk avec backend **refait selon l'architecture des laboratoires Node.js**.

## 🏗️ Architecture

Le backend suit l'architecture MVC enseignée dans les 7 laboratoires:

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

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Le fichier `.env` contient:
```env
HOSTDB=localhost
USERDB=postgres
PASSWORDDB=yassin123
DBNAME=safewalk
PORT=3001
JWT_SECRET=safewalk_super_secret_key_change_this_in_production_2024
JWT_EXPIRATION=24h
```

### 3. Base de données

Démarrer PostgreSQL avec PostGIS:
```bash
docker run --name postgres-safewalk \
  -e POSTGRES_PASSWORD=yassin123 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=safewalk \
  -p 5432:5432 \
  --rm -d postgis/postgis
```

Initialiser la base de données:
```bash
npm run initDB
```

### 4. Lancer le serveur

```bash
npm run dev
```

API disponible sur: `http://localhost:3001`

## 👥 Utilisateurs de test

Tous les mots de passe sont hashés avec **argon2** (Labo 5).

### Admin
- Email: `admin@safewalk.local`
- Password: `admin`

### Utilisateurs
- Email: `yassin@mail.com` / Password: `password`
- Email: `florian@mail.com` / Password: `password`
- Email: `aboub@mail.com` / Password: `password`
- Email: `emma@mail.com` / Password: `password`

## 🔐 Authentification (Labo 4 & 5)

### Méthode 1: Basic Auth (Labo 4)
```http
Authorization: Basic base64(email:password)
```

### Méthode 2: JWT (Labo 5) - **Recommandée**

1. **Login pour obtenir le token:**
```http
POST /users/login
Content-Type: application/json

{
  "email": "admin@safewalk.local",
  "password": "admin"
}
```

Réponse:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

2. **Utiliser le token:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 Endpoints

### Users (Labo 2, 4, 5)
- `POST /users/register` - Inscription (public)
- `POST /users/login` - Connexion → JWT (public)
- `GET /users/me` - Profil utilisateur connecté (JWT required)
- `PATCH /users/me` - Mise à jour profil (JWT required)
- `GET /users` - Liste utilisateurs (admin only)
- `DELETE /users/:id` - Supprimer utilisateur (admin only)

### Reports (Labo 2)
- `GET /reports` - Liste tous les rapports (public)
- `GET /reports/:id` - Un rapport par ID (public)
- `POST /reports` - Créer un rapport (JWT required)
- `PATCH /reports/:id` - Modifier un rapport (admin only)
- `DELETE /reports/:id` - Supprimer un rapport (admin only)

### Comments (Labo 2)
- `GET /comments/report/:reportId` - Liste commentaires (public)
- `POST /comments` - Créer commentaire (JWT required)
- `DELETE /comments/:id` - Supprimer commentaire (JWT required, owner ou admin)

### Zones (Labo 2)
- `GET /zones` - Liste zones (public)
- `GET /zones/:id` - Une zone (public)
- `POST /zones` - Créer zone (admin only)
- `PATCH /zones/:id` - Modifier zone (admin only)
- `DELETE /zones/:id` - Supprimer zone (admin only)

### Votes (Labo 2)
- `GET /votes/report/:reportId` - Statistiques de votes (public)
- `POST /votes` - Voter (JWT required)
- `DELETE /votes` - Retirer son vote (JWT required)
- `GET /votes/report/:reportId/me` - Mon vote (JWT required)

### Report Types (Labo 2)
- `GET /report-types` - Liste types (public)
- `POST /report-types` - Créer type (admin only)
- `DELETE /report-types/:id` - Supprimer type (admin only)

## 🔒 Système de rôles (Labo 4)

Le middleware `checkRole(['admin'])` protège les routes admin.

- **citizen**: Peut créer rapports, commenter, voter
- **admin**: Accès complet + gestion utilisateurs, zones, types

## ✅ Validation (Labo 4)

Toutes les routes utilisent **VineJS** pour valider les données:
- Formats email
- Longueurs minimales/maximales
- Types de données
- Valeurs enum (status, severity, role)

Exemple d'erreur:
```json
{
  "errors": {
    "email": "The email field must be a valid email address"
  }
}
```

## 🗄️ Base de données (Labo 2)

- **PostgreSQL** avec **PostGIS** pour les données géographiques
- **Pool de connexions** avec pattern Adapter (Labo 2)
- **Transactions** supportées via le client SQL
- **Mots de passe**: argon2 (Labo 5)

## 📦 Technologies utilisées

Selon les laboratoires:
- **Express** (Labo 1)
- **PostgreSQL** + **pg** (Labo 2)
- **argon2** (Labo 5)
- **jsonwebtoken** (Labo 5)
- **VineJS** (Labo 4)
- **dotenv** (Labo 2)
- **cors** (Labo 1)
- **PostGIS** (extension PostgreSQL)

## 🧪 Tests (Labo 7)

Pour tester l'API, utilisez **Bruno** (recommandé par le prof) ou Postman.

### Exemple de scénario de test:

1. **Login:**
```http
POST http://localhost:3001/users/login
Content-Type: application/json

{
  "email": "admin@safewalk.local",
  "password": "admin"
}
```

2. **Créer un rapport:**
```http
POST http://localhost:3001/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "type_id": 1,
  "title": "Éclairage défaillant",
  "description": "Lampadaire cassé depuis 2 jours",
  "latitude": 50.845,
  "longitude": 4.355,
  "severity": "medium"
}
```

3. **Voter pour un rapport:**
```http
POST http://localhost:3001/votes
Authorization: Bearer <token>
Content-Type: application/json

{
  "report_id": 1,
  "value": true
}
```

## 📝 Scripts disponibles

```bash
npm run dev      # Démarre le serveur en mode développement (nodemon)
npm run initDB   # Initialise/réinitialise la base de données
```

## 🔄 Différences avec l'ancien code

✅ Architecture MVC stricte (model/controler/routes séparés)
✅ Pool de connexions PostgreSQL avec pattern Adapter  
✅ Middleware d'identification en couches (Basic + JWT)
✅ Middleware d'autorisation basé sur les rôles
✅ Validation VineJS sur toutes les routes
✅ Mots de passe hashés avec argon2 (au lieu de bcrypt)
✅ JWT avec expiration configurable
✅ Gestion d'erreurs standardisée (sendStatus)
✅ Code structuré comme dans les laboratoires

## 📚 Références des laboratoires

- **Labo 1**: Structure MVC, Express, Routes
- **Labo 2**: PostgreSQL, Pool, Scripts d'init, Modèles/Contrôleurs
- **Labo 3**: ORM Prisma (non utilisé, on garde PostgreSQL)
- **Labo 4**: Middleware Basic Auth, Autorisation, Validation VineJS
- **Labo 5**: JWT, Argon2, Hash de mots de passe
- **Labo 6**: Documentation Swagger (à venir)
- **Labo 7**: Tests Bruno (à venir)

## 🚧 Frontend & Mobile

Le frontend (React + Vite) et l'application mobile (React Native/Expo) restent inchangés et sont compatibles avec cette nouvelle API.
