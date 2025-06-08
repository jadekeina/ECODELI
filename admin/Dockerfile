# Étape 1 : build
FROM node:20 AS builder

WORKDIR /app

# Supprime les proxies si présents
RUN npm config delete proxy && npm config delete https-proxy

# Copie des dépendances
COPY package*.json ./

# Installation des dépendances + TypeScript + Vite
RUN npm install && \
    npm install -D typescript vite && \
    npx tsc --version

# Copie du code source
COPY . .

# Build du projet
RUN npm run build

# Étape 2 : image finale
FROM node:20-alpine

WORKDIR /app

# Serveur statique pour servir l'app
RUN npm config delete proxy && npm config delete https-proxy && \
    npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
