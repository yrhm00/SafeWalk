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
# A faire plus tard
```

---

## 3. Lancer PostgreSQL (Docker)

Le BackEnd utilise une base PostgreSQL exécutée dans Docker.
```bash
# Depuis la racine du projet :
docker compose up -d


# Vérifier que le conteneur tourne :
docker ps


# Vous devez voir un conteneur nommé :
safewalk-db
```

---


## 4. Configuration du BackEnd

```bash
# Entrer dans le dossier du BackEnd :
cd BackEnd


# Créer votre fichier .env :
cp .env.example .env


# Installer les dépendances :
npm install
```

---


## 5. Initialiser la base de données

```bash
# Ce script crée toutes les tables et insère les données de test.
npm run initDB

# Tester la connexion à la base
npm run testDB

#Vous devriez voir un résultat du type :
'{ now: '2025-11-20T12:41:26.214Z' }'
```

## 6. Lancer le serveur BackEnd
```bash
npm run dev
```

L’API tourne maintenant sur :

http://localhost:3000

## 7. Accéder à PostgreSQL en ligne de commande (optionnel)
```bash
docker exec -it safewalk-db psql -U postgres -d safewalk


# Commandes utiles :

\dt                  -- liste des tables
SELECT * FROM "user";
SELECT * FROM report;
\q                    -- quitter
```

## 📍 À venir

Documentation de la partie Web

Documentation de la partie Mobile

Guide API complet

Schéma de base de données
