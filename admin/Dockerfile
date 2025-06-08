# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration depuis le dossier front
COPY admin/package*.json ./

# Configuration npm
RUN npm config set prefer-online true \
  && npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000

# Nettoyer le cache
RUN npm cache clean --force

# Installer toutes les dépendances (dev + prod)
RUN npm ci

# Copier le code source du front
COPY admin/ .

# Build de l'application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Installer serve
RUN npm install -g serve

# Copier uniquement les fichiers buildés depuis le stage précédent
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["serve", "-s", "dist", "-l", "3000"]