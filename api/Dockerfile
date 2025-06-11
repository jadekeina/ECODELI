# Stage 1: Build the Node.js application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Run the Node.js application
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/. .
EXPOSE 3002
CMD ["node", "app.js"]