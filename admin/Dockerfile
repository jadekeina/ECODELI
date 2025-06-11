# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Prepare the built static files
FROM alpine AS production
WORKDIR /app/dist
COPY --from=build /app/dist .