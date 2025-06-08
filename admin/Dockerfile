# -------- Étape 1 : Build de l'application --------
FROM node:20-alpine AS builder

# Mise à jour de npm pour éviter les bugs connus
RUN npm install -g npm@latest

# Dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de configuration en premier (meilleur cache)
COPY admin/package*.json ./

# Config réseau pour npm (déjà fait mais on renforce)
RUN npm config set registry https://registry.npmjs.org/ \
  && npm config set prefer-online true \
  && npm config set fetch-retries 10 \
  && npm config set fetch-retry-mintimeout 30000 \
  && npm config set fetch-retry-maxtimeout 180000

# Nettoyage du cache npm (optionnel mais propre)
RUN npm cache clean --force

# Installation des dépendances
RUN npm install

# Copier tout le code source  du projet admin
COPY admin/ .

# Compilation TypeScript + build Vite
RUN npx tsc -b && npx vite build


# -------- Étape 2 : Image de production --------
FROM node:20-alpine AS production

# Dossier de travail
WORKDIR /app

# Installer le serveur statique
RUN npm install -g serve

# Copier uniquement les fichiers compilés
COPY --from=builder /app/dist ./dist

# Exposer le port utilisé par serve
EXPOSE 3001

# Commande de démarrage
CMD ["serve", "-s", "dist", "-l", "3000"]
