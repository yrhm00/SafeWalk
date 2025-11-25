# 📘 SafeWalk – Documentation des Endpoints API

Ce document décrit l’ensemble des endpoints prévus pour l’API SafeWalk.  
Ils couvrent l'authentification, la gestion des utilisateurs, les signalements de dangers, les commentaires, les votes ainsi que l’utilisation future de fonctionnalités géospatiales via PostGIS.

Tous les endpoints sont préfixés par :

```
/api
```

---

# 0️⃣ Healthcheck

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/health` | Vérifie que l'API fonctionne correctement |

---

# 1️⃣ Authentification & utilisateurs

## 🔸 Auth

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **POST** | `/api/auth/register` | Inscription d’un nouvel utilisateur |
| **POST** | `/api/auth/login` | Connexion, renvoie un token JWT |
| **GET** | `/api/auth/me` | Retourne les infos de l'utilisateur connecté |

## 🔸 Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/users/me` | Récupère les infos du user connecté |
| **GET** | `/api/users/:id` | Récupère un utilisateur public |
| **GET** | `/api/users` | Liste des utilisateurs *(admin)* |
| **PATCH** | `/api/users/:id` | Modifier un utilisateur |
| **DELETE** | `/api/users/:id` | Supprimer un utilisateur *(admin ou self)* |

---

# 2️⃣ Types de danger (report_type)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/report-types` | Liste de tous les types de danger |
| **GET** | `/api/report-types/:id` | Détail d’un type |
| **POST** | `/api/report-types` | Créer un type *(admin)* |
| **PATCH** | `/api/report-types/:id` | Modifier un type *(admin)* |
| **DELETE** | `/api/report-types/:id` | Supprimer un type *(admin)* |

---

# 3️⃣ Zones

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/zones` | Liste des zones |
| **GET** | `/api/zones/:id` | Détail d’une zone |
| **POST** | `/api/zones` | Créer une zone *(admin)* |
| **PATCH** | `/api/zones/:id` | Modifier une zone *(admin)* |
| **DELETE** | `/api/zones/:id` | Supprimer une zone *(admin)* |

### 🔮 Endpoints géospatiaux (PostGIS – plus tard)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/zones/contains-point?lat=&lng=` | Trouver la zone contenant un point |

---

# 4️⃣ Reports (signalements de danger)

## 🔸 Liste et détail

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/reports` | Liste des signalements, avec filtres |
| **GET** | `/api/reports/:id` | Détail d’un signalement |

Filtres acceptés pour `/api/reports` :
- `status=pending|validated|resolved`
- `severity=Low|Medium|High`
- `type_id=1`
- `zone_id=2`
- `user_id=3`
- `page`, `limit`
- (avec PostGIS) `lat`, `lng`, `radius`

## 🔸 Création & modification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **POST** | `/api/reports` | Créer un nouveau signalement |
| **PATCH** | `/api/reports/:id` | Modifier un signalement |
| **PATCH** | `/api/reports/:id/status` | Modifier le statut *(admin)* |
| **DELETE** | `/api/reports/:id` | Supprimer un signalement *(admin ou créateur)* |

## 🔮 Endpoints géospatiaux (PostGIS – plus tard)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/reports/nearby?lat=&lng=&radius=` | Reports autour d’un point |
| **GET** | `/api/reports/in-zone/:zoneId` | Reports situés dans une zone |
| **GET** | `/api/reports/heatmap?bbox=` | Données pour une heatmap |

---

# 5️⃣ Commentaires

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/reports/:id/comments` | Liste des commentaires pour un report |
| **POST** | `/api/reports/:id/comments` | Ajouter un commentaire |
| **DELETE** | `/api/comments/:commentId` | Supprimer un commentaire |

---

# 6️⃣ Votes

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/reports/:id/votes` | Statistiques de votes du report |
| **POST** | `/api/reports/:id/votes` | Créer ou mettre à jour un vote |
| **DELETE** | `/api/reports/:id/votes` | Retirer son vote |

---

# 🗺️ 7️⃣ Vue d’ensemble

Voici une synthèse de toutes les ressources :

- 👤 Utilisateurs : inscription, login, profil, gestion admin  
- ⚠️ Types de danger : gestion des catégories  
- 🗺 Zones : gestion des zones géographiques  
- 📍 Reports : signalements, géolocalisation, statut  
- 💬 Commentaires : discussions sur les reports  
- 👍 Votes : confirmation ou validation de danger  

---

# 🔧 8️⃣ Notes importantes

- Pas d’ORM : toutes les requêtes se font via `pool.query`
- Middleware JWT requis pour les endpoints protégés
- Middleware rôle “admin” requis pour les actions sensibles
- Endpoints géospatiaux activés après ajout de PostGIS
