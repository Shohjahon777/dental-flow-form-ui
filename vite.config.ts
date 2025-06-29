import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backendfastapi-v8lv.onrender.com',
        changeOrigin: true,
        secure: true,
      },
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
  build: {
    outDir: 'dist',
  }
}));
