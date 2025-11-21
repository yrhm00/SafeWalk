# PostGIS - Fonctionnalités Géospatiales SafeWalk

## ✅ PostGIS Activé

Votre backend SafeWalk dispose maintenant de **PostGIS** pour les fonctionnalités géospatiales avancées.

---

## 🗺️ Nouvelles fonctionnalités

### 1. Recherche par proximité (Nearby Search)

**Endpoint:** `GET /reports/nearby`

**Query Parameters:**
- `latitude` (required): Latitude du point de recherche
- `longitude` (required): Longitude du point de recherche
- `radius` (optional): Rayon en mètres (défaut: 5000m = 5km)

**Exemple:**
```bash
GET /reports/nearby?latitude=50.845&longitude=4.355&radius=10000
```

**Réponse:**
```json
[
  {
    "id": "1",
    "title": "Lampadaire cassé",
    "latitude": 50.845,
    "longitude": 4.355,
    "distance_meters": 0,
    "user_name": "Yassin Rhouma",
    "type_label": "Poor lighting",
    "zone_name": "City Center"
  },
  {
    "id": "2",
    "title": "Route gelée",
    "latitude": 50.846,
    "longitude": 4.357,
    "distance_meters": 179.49,
    "user_name": "Florian Dupont"
  }
]
```

**Tri:** Les résultats sont **automatiquement triés par distance** (du plus proche au plus loin).

---

## 📱 Utilisation dans votre app mobile

### Rechercher les rapports autour de la position actuelle

```javascript
import * as Location from 'expo-location';

// 1. Obtenir la position de l'utilisateur
const location = await Location.getCurrentPositionAsync({});
const { latitude, longitude } = location.coords;

// 2. Rechercher les rapports dans un rayon de 5km
const response = await fetch(
  `http://localhost:3001/reports/nearby?latitude=${latitude}&longitude=${longitude}&radius=5000`
);
const nearbyReports = await response.json();

// 3. Afficher sur la carte avec distance
nearbyReports.forEach(report => {
  console.log(`${report.title} - ${Math.round(report.distance_meters)}m`);
});
```

### Afficher avec react-native-maps

```javascript
<MapView
  initialRegion={{
    latitude: userLatitude,
    longitude: userLongitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05
  }}
>
  {nearbyReports.map(report => (
    <Marker
      key={report.id}
      coordinate={{
        latitude: report.latitude,
        longitude: report.longitude
      }}
      title={report.title}
      description={`À ${Math.round(report.distance_meters)}m de vous`}
    />
  ))}
</MapView>
```

---

## 🔧 Structure technique

### Table `report`

```sql
CREATE TABLE report (
  ...
  latitude       DOUBLE PRECISION NOT NULL,
  longitude      DOUBLE PRECISION NOT NULL,
  point          geometry(POINT, 4326) GENERATED ALWAYS AS 
                 (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  ...
);
```

**Points clés:**
- ✅ Stockage **double** : `latitude/longitude` (simples) + `point` (PostGIS)
- ✅ Colonne `point` **auto-générée** depuis latitude/longitude
- ✅ Compatible avec le mobile (utilise latitude/longitude)
- ✅ Performant pour les requêtes géospatiales (utilise point)

### Table `zone`

```sql
CREATE TABLE zone (
  ...
  geom geometry(POLYGON, 4326)
);
```

Vous pouvez maintenant vérifier si un rapport est **dans une zone** avec:

```sql
SELECT * FROM report r
JOIN zone z ON ST_Within(r.point, z.geom)
WHERE r.id = 1;
```

---

## 🚀 Fonctions PostGIS utiles

| Fonction | Usage | Exemple |
|----------|-------|---------|
| `ST_Distance()` | Calculer la distance entre 2 points | Déjà utilisé dans `/reports/nearby` |
| `ST_DWithin()` | Filtrer dans un rayon | Déjà utilisé dans `/reports/nearby` |
| `ST_Within()` | Point dans un polygone | Vérifier si un rapport est dans une zone |
| `ST_Buffer()` | Créer un rayon autour d'un point | Créer des zones de sécurité |
| `ST_Intersects()` | Vérifier intersection | Zones qui se chevauchent |

---

## 📊 Exemple de filtres avancés

### 1. Rapports dans une zone spécifique

```javascript
// Modèle
export const readReportsInZone = async (SQLClient, zoneId) => {
  const query = `
    SELECT r.* FROM report r
    JOIN zone z ON z.id = $1
    WHERE ST_Within(r.point, z.geom)
  `;
  const { rows } = await SQLClient.query(query, [zoneId]);
  return rows;
};
```

### 2. Zones accessibles depuis un point (dans 2km)

```javascript
export const findAccessibleZones = async (SQLClient, {latitude, longitude}) => {
  const query = `
    SELECT z.*, 
           ST_Distance(
             z.geom::geography,
             ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
           ) as distance_meters
    FROM zone z
    WHERE ST_DWithin(
      z.geom::geography,
      ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
      2000
    )
    ORDER BY distance_meters
  `;
  const { rows } = await SQLClient.query(query, [latitude, longitude]);
  return rows;
};
```

---

## 🐳 Configuration Docker

**Image:** `postgis/postgis:16-3.4-alpine`
- ✅ Compatible ARM64 (Mac M1/M2)
- ✅ Compatible x86_64 (Windows/Linux)
- ✅ Léger (version Alpine)

**docker-compose.yml:**
```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
```

---

## ✅ Avantages de cette approche

1. **Double compatibilité:**
   - Mobile utilise `latitude/longitude` (simple)
   - Backend utilise `point` geometry (performant)

2. **Auto-synchronisation:**
   - Le `point` est automatiquement calculé depuis latitude/longitude
   - Pas de risque de désynchronisation

3. **Extensible:**
   - Facile d'ajouter de nouvelles fonctions géospatiales
   - PostGIS offre plus de 100 fonctions

4. **Performant:**
   - Index spatiaux automatiques sur geometry
   - Requêtes optimisées pour la géolocalisation

---

## 📝 URLs de test

```bash
# Recherche autour du centre-ville
curl "http://localhost:3001/reports/nearby?latitude=50.845&longitude=4.355&radius=5000"

# Recherche avec rayon de 10km
curl "http://localhost:3001/reports/nearby?latitude=50.845&longitude=4.355&radius=10000"

# Recherche avec rayon de 1km (rapports très proches)
curl "http://localhost:3001/reports/nearby?latitude=50.845&longitude=4.355&radius=1000"
```

---

Profitez de PostGIS pour créer des fonctionnalités géospatiales puissantes dans SafeWalk! 🗺️🚀
