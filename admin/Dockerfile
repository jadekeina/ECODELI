# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Prepare the built static files and set permissions
FROM alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist

# C'est LA LIGNE CRUCIALE pour les permissions
# Elle donne les droits de lecture et d'exécution au propriétaire, groupe et autres
# sur le dossier 'dist' et tout ce qu'il contient.
RUN chmod -R 755 /app/dist

CMD ["tail", "-f", "/dev/null"]