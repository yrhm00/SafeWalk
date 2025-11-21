#!/bin/bash

# Script d'initialisation de SafeWalk Backend
# Selon la méthodologie des laboratoires Node.js

echo "🚀 Démarrage de SafeWalk Backend (Architecture Laboratoires)"
echo "============================================================"
echo ""

# 1. Arrêter les conteneurs existants
echo "📦 Nettoyage des conteneurs PostgreSQL existants..."
docker stop postgres-safewalk 2>/dev/null || true
docker rm postgres-safewalk 2>/dev/null || true

# 2. Démarrer PostgreSQL
echo ""
echo "🐘 Démarrage de PostgreSQL avec PostGIS..."
docker run --name postgres-safewalk \
  -e POSTGRES_PASSWORD=yassin123 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=safewalk \
  -p 5432:5432 \
  --rm -d postgres:16

# 3. Attendre que PostgreSQL soit prêt
echo ""
echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 5

# Vérifier que PostgreSQL est accessible
until docker exec postgres-safewalk pg_isready -U postgres > /dev/null 2>&1; do
  echo "   En attente de PostgreSQL..."
  sleep 1
done

echo "✅ PostgreSQL est prêt!"

# 4. Installer PostGIS (si nécessaire)
echo ""
echo "📍 Installation de l'extension PostGIS..."
docker exec postgres-safewalk psql -U postgres -d safewalk -c "CREATE EXTENSION IF NOT EXISTS postgis;" > /dev/null 2>&1

# 5. Initialiser la base de données
echo ""
echo "💾 Initialisation de la base de données (Labo 2)..."
npm run initDB

# Vérifier le résultat
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de données initialisée avec succès!"
    echo ""
    echo "👥 Utilisateurs de test créés:"
    echo "   Admin: admin@safewalk.local / admin"
    echo "   User:  yassin@mail.com / password"
    echo ""
    echo "🔐 Authentification: JWT (Labo 5)"
    echo "✅ Validation: VineJS (Labo 4)"
    echo "✅ Middleware: Basic + JWT (Labo 4 & 5)"
    echo ""
    echo "🚀 Vous pouvez maintenant démarrer le serveur avec:"
    echo "   npm run dev"
    echo ""
else
    echo ""
    echo "❌ Erreur lors de l'initialisation de la base de données"
    echo ""
    echo "Vérifiez que:"
    echo "  - Docker est en cours d'exécution"
    echo "  - Le port 5432 est disponible"
    echo "  - Le fichier .env contient les bonnes informations"
    exit 1
fi
