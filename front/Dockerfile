# 👷 Étape "builder"
FROM node:18-bullseye AS builder

WORKDIR /app

# Réinitialisation npm pour contourner le bug de proxy
RUN npm config delete proxy \
 && npm config delete https-proxy

# Copier package.json (pour installer les dépendances)
COPY admin/package*.json ./

# Installer toutes les dépendances + outils
RUN npm install --legacy-peer-deps \
 && npm install -g typescript vite

# Copier le code
COPY admin/ .

# Lancer le build (tsc + vite)
RUN npm run build

# 🧱 Étape "production"
FROM node:18-bullseye-slim

WORKDIR /app

# Installer le serveur statique
RUN npm config delete proxy \
 && npm config delete https-proxy \
 && npm install -g serve

# Copier le build final
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
