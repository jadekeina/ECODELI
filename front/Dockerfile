# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Supprimer proxy au cas où
RUN npm config delete proxy && npm config delete https-proxy

# Copier package.json et installer TOUTES les dépendances (y compris devDependencies)
COPY front/package*.json ./
RUN npm install

# Copier le reste du code
COPY front/ .

# Compiler (TypeScript et Vite)
RUN npm run build

# Étape 2 : image finale
FROM node:20-alpine AS production

WORKDIR /app

# Installer un serveur statique
RUN npm install -g serve

# Copier uniquement les fichiers du build
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
