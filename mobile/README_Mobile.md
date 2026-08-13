# SafeWalk — Application mobile

Application React Native (Expo).

## API et base de données

Code source complet (API, base de données et scripts d'initialisation) :
https://github.com/yrhm00/SafeWalk

Déploiement local avec Docker, depuis la racine du projet :

1. Copier `.env.example` en `.env`
2. `docker compose up --build`

L'API est disponible sur `http://localhost:3001` et sa documentation Swagger sur
`http://localhost:3001/api-docs`. La base PostgreSQL est créée et initialisée
automatiquement au premier démarrage.

## Lancement de l'application mobile

1. Copier `mobile/.env.example` en `mobile/.env` et y renseigner l'IPv4 de la
   machine : `EXPO_PUBLIC_API_URL=http://192.168.x.x:3001`
2. Connecter le téléphone au même réseau Wi-Fi que l'ordinateur
3. `npm install`
4. `npx expo start -c`
5. Scanner le QR code avec l'application Expo Go
