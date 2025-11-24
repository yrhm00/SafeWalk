# 🚀 Guide de démarrage - SafeWalk (Complet)

Ce guide est destiné aux collègues qui veulent lancer le projet SafeWalk complet (Backend, Frontend, Mobile).

## Prérequis

- **Node.js** (v18 ou supérieur)
- **Docker** et **Docker Compose**
- **Git**
- **Expo Go** (sur votre téléphone pour tester l'app mobile)

## 📦 1. Backend (Serveur & Base de données)

C'est la partie la plus importante, à lancer en premier.

### Installation

```bash
# À la racine du projet
npm install
```

### Configuration

Copier le fichier d'exemple:
```bash
cp .env.example .env
```
Vérifiez que les valeurs sont correctes (DB, JWT, etc.).

### Démarrage Base de données

```bash
# Lance PostgreSQL
npm run db:start
```

### Initialisation des données

```bash
# Crée les tables et ajoute les données de test
npm run db:seed
```

### Démarrer le Serveur

```bash
npm run dev
```
Le backend tourne sur : **http://localhost:3001**

---

## 💻 2. Frontend (Backoffice Web)

Ouvrez un **nouveau terminal**.

### Installation & Démarrage

```bash
cd frontend
npm install
npm run dev
```
Le site web sera accessible (généralement) sur : **http://localhost:5173**

---

## 📱 3. Mobile (Application Citoyen)

Ouvrez un **nouveau terminal**.

### Installation & Démarrage

```bash
cd mobile
npm install
npx expo start
```

- Scannez le **QR Code** avec l'application **Expo Go** (Android) ou l'appareil photo (iOS).
- Assurez-vous que votre téléphone est sur le **même réseau Wi-Fi** que votre ordinateur.

---

## 🛑 Arrêter le projet

Pour tout arrêter proprement :

1. **Terminaux** : `Ctrl+C` dans chaque terminal.
2. **Base de données** :
   ```bash
   npm run db:stop
   ```

## 👥 Comptes de test

### Admin (Backoffice)
- **Email:** `admin@safewalk.local`
- **Password:** `admin`

### Utilisateurs (Mobile)
- **Email:** `yassin@mail.com` / **Password:** `password`
- **Email:** `florian@mail.com` / **Password:** `password`

---

## ❓ Problèmes courants

### Port 5432 déjà utilisé
Si vous avez déjà PostgreSQL installé localement, changez le port dans `docker-compose.yml` (ex: `5433:5432`) et mettez à jour `.env`.

### Mobile : "Network request failed"
Si l'app mobile n'arrive pas à joindre le backend :
1. Vérifiez que votre téléphone et PC sont sur le même Wi-Fi.
2. Dans le code mobile, remplacez `localhost` par l'adresse IP locale de votre PC (ex: `192.168.1.x`).
