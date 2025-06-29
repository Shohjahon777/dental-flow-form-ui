export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
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
