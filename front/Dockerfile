# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers nécessaires d'abord
COPY front/package*.json ./

# Configuration npm pour résilience réseau
RUN npm config set prefer-online true \
  && npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000

# Installer les dépendances (et typescript localement)
RUN npm install

# Copier le reste du code source
COPY front/ .

# Compiler avec le TypeScript local
RUN npx tsc -b && npx vite build

# Étape 2 : image finale
FROM node:20-alpine AS production

WORKDIR /app

# Installer un serveur statique
RUN npm install -g serve

# Copier les fichiers compilés
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Lancer le serveur
CMD ["serve", "-s", "dist", "-l", "3000"]
