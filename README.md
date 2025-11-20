# SafeWalk

📦 1. Cloner le projet

Ouvrez un terminal, puis :

git clone https://github.com/<ton-repo>/SafeWalk.git
cd SafeWalk

🐘 2. Lancer PostgreSQL (Docker)

Le BackEnd utilise une base PostgreSQL exécutée dans Docker.

Depuis la racine du projet :

docker compose up -d


Vérifier que le conteneur tourne :

docker ps


Vous devez voir un conteneur nommé :

safewalk-db

⚙️ 3. Configuration du BackEnd

Entrer dans le dossier du BackEnd :

cd BackEnd


Créer votre fichier .env :

cp .env.example .env


Installer les dépendances :

npm install

🧱 4. Initialiser la base de données

Ce script crée toutes les tables et insère les données de test.

npm run initDB

🧪 5. Tester la connexion à la base
npm run testDB


Vous devriez voir un résultat du type :

{ now: '2025-11-20T12:41:26.214Z' }

🚀 6. Lancer le serveur BackEnd
npm run dev


L’API tourne maintenant sur :

http://localhost:3000

📡 7. Accéder à PostgreSQL en ligne de commande (optionnel)
docker exec -it safewalk-db psql -U postgres -d safewalk


Commandes utiles :

\dt                  -- liste des tables
SELECT * FROM "user";
SELECT * FROM report;
\q                    -- quitter

📍 À venir

Documentation de la partie Web

Documentation de la partie Mobile

Guide API complet

Schéma de base de données
