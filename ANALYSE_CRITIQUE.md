# Analyse critique du projet — SafeWalk (Frontend Web)

## Points forts

- **Authentification JWT complète** : rafraîchissement silencieux automatique du token via un intercepteur Axios (401 → `POST /users/refresh` → rejeu de la requête initiale), sans intervention de l'utilisateur.
- **Résilience réseau** : mécanisme de retry exponentiel (1s / 2s / 4s) sur les erreurs 5xx et réseau, avec protection spécifique évitant de rejouer une requête `POST` non-idempotente.
- **Gestion différenciée des erreurs HTTP** : 401 → rafraîchissement, 5xx → retry, autres 4xx → message détaillé affiché à l'utilisateur (exploite le champ `details` renvoyé par la validation backend).
- **Composants réutilisables et paramétrables** : `DataTable`, `Alert`, `ConfirmDialog` sont génériques et utilisés sur l'ensemble des vues d'administration (utilisateurs, signalements, types, zones), sans duplication de code.
- **Recherche et pagination sur toutes les vues**, avec un hook personnalisé (`useDebouncedValue`) pour éviter un appel réseau à chaque frappe clavier.
- **Code splitting** : toutes les pages sont chargées via `React.lazy()` et `<Suspense>` au niveau du routeur.
- **Typage des props** avec `PropTypes` sur l'ensemble des composants.

## Points faibles

- **Pas de gestion d'état globale (Redux/Context)** : choix assumé, aucune donnée n'est réellement partagée entre plusieurs vues affichées simultanément dans l'application actuelle. Un projet plus large pourrait justifier son introduction.
- **Aucun test automatisé** : la validation du projet s'est faite entièrement par des tests manuels ; l'ajout de tests unitaires/d'intégration renforcerait la fiabilité à long terme.
- **Stockage du token JWT en `localStorage`** plutôt qu'en cookie httpOnly : limite structurelle imposée par le contrat de l'API (le token est renvoyé dans le corps JSON de la réponse), pas un choix frontend.
- **Pas de véritable upload de fichier** : le champ `image_url` des signalements attend une URL déjà hébergée, le backend ne supportant pas encore l'upload multipart d'image.

## Améliorations possibles

- Ajouter une suite de tests automatisés (Jest + React Testing Library) sur les composants critiques (formulaires, authentification).
- Mémoïser certains composants (`React.memo`) pour limiter les rendus inutiles sur les grandes listes.
- Remplacer les indicateurs de chargement textuels par des squelettes de chargement (« skeleton loaders »).
- Prévoir un vrai flux d'upload d'image (FormData/multipart) si le backend évolue en ce sens.

## Fonctionnalités bonus réalisées

- **Lazy loading** des routes (`React.lazy` + `Suspense`)
- **PropTypes** sur tous les composants
- **Hook personnalisé** (`useDebouncedValue`) pour la recherche débouncée
