FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers nécessaires
COPY admin/package*.json ./

# Supprimer proxy si existant (optionnel mais utile dans ton cas)
RUN npm config delete proxy && npm config delete https-proxy

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY admin/ .

# Lancer le build (tsc + vite)
RUN npm run build

# Installer le serveur statique pour servir le front
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Commande de lancement
CMD ["serve", "-s", "dist", "-l", "3000"]
