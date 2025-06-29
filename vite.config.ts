import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      // AI Model API
      '/api': {
        target: 'https://backendfastapi-v8lv.onrender.com',
        changeOrigin: true,
        secure: true,
        // Remove the rewrite since you want to keep /api prefix
      },
      // Auth API (dental backend)
      '/auth': {
        target: 'https://dental-pc4s.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path: string) => path.replace(/^\/auth/, ''),
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {}
  },
}));