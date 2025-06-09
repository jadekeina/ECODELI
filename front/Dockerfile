# Étape build
FROM node:20 AS builder

WORKDIR /app

# Retirer proxy si présent
RUN npm config delete proxy \
 && npm config delete https-proxy

# Copier les fichiers de dépendances
COPY front/package*.json ./

# Installer dépendances + TypeScript & Vite
RUN npm install \
 && npm install -D typescript vite

# Copier le code source
COPY front/ .

# Builder le projet
RUN npm run build

# Étape production
FROM node:20-alpine

WORKDIR /app

# Supprime proxy + installer serveur statique
RUN npm config delete proxy \
 && npm config delete https-proxy \
 && npm install -g serve

# Copier le build généré
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
