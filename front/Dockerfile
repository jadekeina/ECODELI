# front/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Build Vite (TypeScript est en dépendance locale, pas besoin de global install)
RUN npm run build

# Installer serve pour servir le build
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Lancer le serveur statique
CMD ["serve", "-s", "dist", "-l", "3000"]
