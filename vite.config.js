import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    open: true,
    proxy: {
      '/api-pss': {
        target: 'http://api.pixelstarships.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-pss/, '')
      },
      '/api-fleetdata': {
        target: 'https://fleetdata.dolores2.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-fleetdata/, '')
      },
      '/api-reality': {
        target: 'https://pss.reality.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-reality/, '')
      },
      '/api-pixyship': {
        target: 'https://pixyship.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-pixyship/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('@tanstack/')) {
              return 'vendor-query';
            }
            if (id.includes('lucide-react/')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
});
