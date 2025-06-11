import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'


export default defineConfig({
  plugins: [ tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // ← important pour que Docker puisse exposer le port
    port: 80      // ← le même que dans docker-compose
  },
});
