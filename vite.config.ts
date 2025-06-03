import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": {
        target: "https://home.si-qi.wang",
        changeOrigin: true,
      },
      "/rag": {
        target: "https://home.si-qi.wang",
        changeOrigin: true,
      },
      "/api/prompt": {
        target: "https://home.si-qi.wang",
        changeOrigin: true,
      },
      "/api/rag": {
        target: "https://home.si-qi.wang",
        changeOrigin: true,
      },
    },
  },
})
