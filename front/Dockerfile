# -------- Étape 1 : Build de l'application --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY front/package*.json ./

# Configuration npm minimale
RUN npm config set registry https://registry.npmjs.org/

# Nettoyer le cache
RUN npm cache clean --force

# Installation avec npm ci
RUN npm ci

# Copier le code source
COPY front/ .

# Build de l'application
RUN npm run build

# -------- Étape 2 : Image de production --------
FROM node:20-alpine AS production

WORKDIR /app

# Installer serve
RUN npm install -g serve

# Copier les fichiers compilés
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["serve", "-s", "dist", "-l", "3000"]