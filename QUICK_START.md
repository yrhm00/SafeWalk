# 🚀 Quick Start - SafeWalk Backend

Guide rapide pour démarrer le backend SafeWalk après avoir cloné le repo.

## Prérequis

- **Node.js** (v18 ou supérieur)
- **Docker** et **Docker Compose**

## Installation en 5 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Configurer l'environnement
```bash
cp .env.example .env
```
> ⚠️ Le fichier `.env` est déjà configuré avec les bonnes valeurs par défaut. Pas besoin de le modifier sauf si tu veux changer le mot de passe ou le port.

### 3️⃣ Démarrer PostgreSQL
```bash
npm run db:start
```
> Cela lance PostgreSQL avec PostGIS dans un conteneur Docker.

### 4️⃣ Initialiser la base de données
```bash
npm run db:seed
```
> Cela crée les tables et ajoute les utilisateurs de test.

### 5️⃣ Lancer le serveur backend
```bash
npm run dev
```

✅ **C'est tout !** Le backend est maintenant accessible sur **http://localhost:3001**

## 👥 Comptes de test

### Admin
- Email: `admin@safewalk.local`
- Password: `admin`

### Utilisateurs
- Email: `yassin@mail.com` / Password: `password`
- Email: `florian@mail.com` / Password: `password`
- Email: `aboub@mail.com` / Password: `password`
- Email: `emma@mail.com` / Password: `password`

## 🧪 Tester l'API

### Obtenir un token JWT
```bash
curl -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@safewalk.local","password":"admin"}'
```

### Utiliser le token
```bash
curl http://localhost:3001/users/me \
  -H "Authorization: Bearer <ton_token>"
```

## 🛑 Arrêter le projet

1. **Arrêter le serveur**: `Ctrl+C` dans le terminal
2. **Arrêter PostgreSQL**:
   ```bash
   npm run db:stop
   ```

## 📚 Documentation complète

Pour plus de détails, consulte:
- **README.md** - Documentation complète de l'API
- **SETUP_COLLEGUES.md** - Guide pour lancer Backend + Frontend + Mobile

## ❓ Problèmes courants

### Port 5432 déjà utilisé
Si tu as déjà PostgreSQL installé localement:
1. Change le port dans `docker-compose.yml` (ex: `5433:5432`)
2. Mets à jour `HOSTDB` dans `.env` avec `localhost:5433`

### "Cannot connect to database"
Vérifie que Docker est bien lancé et que le conteneur PostgreSQL tourne:
```bash
docker ps
```
