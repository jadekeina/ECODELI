# Étape build
FROM node:20 AS builder

WORKDIR /app

RUN npm config delete proxy \
 && npm config delete https-proxy

COPY admin/package*.json ./

RUN npm install \
 && npm install -D typescript vite

COPY admin/ .

RUN npm run build

# Étape production
FROM node:20-alpine

WORKDIR /app

RUN npm config delete proxy \
 && npm config delete https-proxy \
 && npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
