import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5177,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5177,
    },
    fs: {
      allow: ['..']
    }
  }
});
