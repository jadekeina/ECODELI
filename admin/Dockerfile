# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers depuis admin/
COPY admin/package*.json ./

# Config NPM
RUN npm config set prefer-online true \
  && npm config set registry https://registry.npmjs.org/ \
  && npm config set fetch-retries 5 \
  && npm config set fetch-retry-mintimeout 20000 \
  && npm config set fetch-retry-maxtimeout 120000 \
  && npm cache clean --force

RUN npm ci

# Copier le reste du code
COPY admin/ .

RUN npm run build

# Stage 2: Serve
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
