FROM node:18-alpine

WORKDIR /app
COPY . .

# Installer les dépendances du projet
RUN npm install

# Installer vite et typescript globalement (facultatif mais pratique ici)
RUN npm install -g typescript vite

# Compiler TypeScript puis build Vite
RUN tsc -b && vite build

# Installer serve pour servir le front
RUN npm install -g serve

# Lancer le front à l’ouverture du container
CMD ["serve", "-s", "dist", "-l", "3000"]
