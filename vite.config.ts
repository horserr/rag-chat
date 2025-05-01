import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@styles": "/src/styles",
      "@components": "/src/components",
      "@assets": "/src/assets",
    },
  },
  server: {
      proxy: {
        // Any request starting with /api will be proxied to the backend server.
        '/auth': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
      },
    },
});
