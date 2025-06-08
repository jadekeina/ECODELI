# Étape 1 : Build
FROM node:20 AS builder

WORKDIR /app

# Copier package.json et lock d'abord pour cache
COPY front/package*.json ./

# Installation des dépendances (sans soucis Alpine)
RUN npm install

# Copier tout le code
COPY front/ .

# Installer typescript (local) au cas où
RUN npm install typescript --save-dev

# Build du projet
RUN npx tsc -b && npx vite build

# Étape 2 : Production
FROM node:20 AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
