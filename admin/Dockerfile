# Étape 1 : Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -D typescript vite

COPY . .
RUN npm run build

# Étape 2 : Serve
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
