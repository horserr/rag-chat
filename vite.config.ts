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
});

// ReactDOM.createRoot(mountNode).render(<Icon component={MessageSvg} />);