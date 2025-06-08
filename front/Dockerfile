FROM node:20

# Configuration npm avant toute chose pour éviter les erreurs réseau
RUN npm config set prefer-online true \
  && npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000

WORKDIR /app
COPY . .

# Installer les dépendances du projet
RUN npm install

# Installer vite et typescript globalement
RUN npm install -g typescript vite

# Compiler le projet (TypeScript + Vite)
RUN tsc -b && vite build

# Installer serve pour servir le front
RUN npm install -g serve

# Lancer le serveur statique sur le port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
