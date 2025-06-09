# Étape unique : juste un serveur pour le build local
FROM  node:20-bullseye AS builder

WORKDIR /app

# Supprime les proxies si définis
RUN npm config delete proxy && npm config delete https-proxy

# Copie les fichiers nécessaires
COPY admin/package*.json ./

# Force l'utilisation de legacy-peer-deps pour éviter les bugs
RUN npm install --legacy-peer-deps

# Installe TypeScript et Vite globalement pour éviter le bug "tsc not found"
RUN npm install -g typescript vite

# Copie du code source
COPY admin/ .

# Build du projet
RUN npm run build

# Étape de prod
FROM node:18-alpine

WORKDIR /app

RUN npm config delete proxy && npm config delete https-proxy && \
    npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
