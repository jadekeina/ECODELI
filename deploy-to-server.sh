#!/bin/bash

# === CONFIGURATION ===
SERVER_USER=sandrine
SERVER_IP=51.89.21.8
DEPLOY_PATH=/home/sandrine

# === BUILD AMD64 IMAGES ===
echo "🚀 Build de l'image ecodeli_api (linux/amd64)..."
docker buildx build --platform linux/amd64 -t ecodeli_api -f ./api/Dockerfile.prod ./api --load

echo "🚀 Build de l'image ecodeli_admin (linux/amd64)..."
docker buildx build --platform linux/amd64 -t ecodeli_admin -f ./admin/Dockerfile.prod ./admin --load

echo "🚀 Build de l'image ecodeli_front (linux/amd64)..."
docker buildx build --platform linux/amd64 -t ecodeli_front -f ./front/Dockerfile.prod ./front --load

# === EXPORT EN .tar ===
echo "📦 Export des images Docker en .tar..."
docker save ecodeli_api > api.tar
docker save ecodeli_admin > admin.tar
docker save ecodeli_front > front.tar

# === TRANSFERT SCP ===
echo "📤 Envoi des fichiers .tar vers le serveur..."
scp api.tar admin.tar front.tar $SERVER_USER@$SERVER_IP:$DEPLOY_PATH

echo "✅ Tout est prêt. Connecte-toi au serveur et fais :"
echo "    docker load < api.tar"
echo "    docker load < admin.tar"
echo "    docker load < front.tar"
echo "    docker compose -f docker-compose.prod.yml up -d"
