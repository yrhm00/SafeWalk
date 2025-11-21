# 🚀 Guide de démarrage - SafeWalk Backend

Ce guide est destiné aux collègues qui veulent lancer le projet SafeWalk.

## Prérequis

- **Node.js** (v18 ou supérieur)
- **Docker** et **Docker Compose**
- **Git** (pour cloner le projet)

## 📦 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd SafeWalk
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copier le fichier d'exemple:
```bash
cp .env.example .env
```

Le fichier `.env` contient déjà les bonnes valeurs par défaut:
```env
HOSTDB=localhost
USERDB=postgres
PASSWORDDB=yassin123
DBNAME=safewalk
PORT=3001
JWT_SECRET=safewalk_super_secret_key_change_this_in_production_2024
JWT_EXPIRATION=24h
```

### 4. Démarrer PostgreSQL

```bash
docker-compose up -d
```

Cela va:
- ✅ Télécharger l'image PostgreSQL
- ✅ Démarrer le conteneur
- ✅ Créer la base de données `safewalk`

### 5. Initialiser la base de données

```bash
npm run initDB
```

Vous devriez voir:
```
✅ Database initialized successfully
```

### 6. Démarrer le serveur

```bash
npm run dev
```

Le backend est maintenant accessible sur: **http://localhost:3001**

---

## 🧪 Tester l'API

### Login Admin

```bash
curl -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@safewalk.local","password":"admin"}'
```

Vous recevrez un token JWT à utiliser pour les requêtes authentifiées.

---

## 🛑 Arrêter le projet

```bash
# Arrêter le serveur: Ctrl+C

# Arrêter PostgreSQL
docker-compose down

# Supprimer les données (⚠️ ATTENTION: supprime toute la DB)
docker-compose down -v
```

---

## 🔄 Réinitialiser la DB

Si vous voulez repartir de zéro:

```bash
docker-compose down -v
docker-compose up -d
npm run initDB
```

---

## 👥 Utilisateurs de test

### Admin
- **Email:** `admin@safewalk.local`
- **Password:** `admin`

### Citizens
- **Email:** `yassin@mail.com` / **Password:** `password`
- **Email:** `florian@mail.com` / **Password:** `password`

---

## 📚 Documentation

- **Architecture:** Voir [README.md](./README.md)
- **API Endpoints:** Voir [README.md](./README.md#-endpoints)
- **Bruno Tests:** À venir

---

## ❓ Problèmes courants

### Port 5432 déjà utilisé

Si vous avez déjà PostgreSQL installé localement:

```bash
# Option 1: Arrêter PostgreSQL local
brew services stop postgresql

# Option 2: Changer le port dans docker-compose.yml
ports:
  - "5433:5432"  # Utiliser le port 5433 au lieu de 5432
```

N'oubliez pas de modifier `.env`:
```env
HOSTDB=localhost:5433
```

### "Cannot connect to Docker daemon"

Assurez-vous que Docker Desktop est lancé.

### Erreur d'authentification PostgreSQL

Vérifiez que le fichier `.env` contient bien `PASSWORDDB=yassin123`.

---

## 🎓 Notes

Ce projet suit strictement l'architecture enseignée dans les 7 laboratoires Node.js:
- **Labo 1:** Structure MVC
- **Labo 2:** PostgreSQL avec Pool et Adapter
- **Labo 4:** Middleware Basic Auth et Autorisation
- **Labo 5:** JWT et Argon2
