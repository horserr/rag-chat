import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ svgrOptions: { icon: true } })],
  resolve: {
    alias: {
      "@": "/src",
      "@styles": "/src/styles",
      "@components": "/src/components",
      "@layouts": "/src/layouts",
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
        '/rag': {
          target: 'http://127.0.0.1:8082',
          changeOrigin: true,
        },
        '/api/prompt': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/api/rag': {
          target: 'http://127.0.0.1:8081',
          changeOrigin: true,
        },
      },
    },
});

// ReactDOM.createRoot(mountNode).render(<Icon component={MessageSvg} />);