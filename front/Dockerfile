# -------- Étape 1 : Build de l'application --------
FROM node:20-alpine AS builder

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de configuration en premier (meilleur cache)
COPY front/package*.json ./

# Config réseau pour npm avec timeouts plus longs
RUN npm config set registry https://registry.npmjs.org/ \
  && npm config set prefer-online false \
  && npm config set fetch-retries 10 \
  && npm config set fetch-retry-mintimeout 60000 \
  && npm config set fetch-retry-maxtimeout 300000 \
  && npm config set timeout 300000

# Nettoyage du cache npm
RUN npm cache clean --force

# Installation des dépendances avec npm ci (plus fiable)
RUN npm ci --only=production=false

# Copier tout le code source du projet front
COPY front/ .

# Build avec Vite (sans TypeScript séparé pour éviter les erreurs)
RUN npm run build

# -------- Étape 2 : Image de production --------
FROM nginx:alpine AS production

# Copier les fichiers buildés vers nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée si nécessaire
# COPY front/nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (standard nginx)
EXPOSE 80

# Nginx se lance automatiquement