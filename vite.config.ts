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
    },
    headers: {
      // CSP permissiva apenas para desenvolvimento para permitir HMR e eval
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' http: https: ws: wss:",
        "font-src 'self' data:",
        "worker-src 'self' blob:"
      ].join('; '),
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
    headers: {
      // CSP mais restrita para preview (quase produção), sem unsafe-eval
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "connect-src 'self' https: wss:",
        "font-src 'self' data:",
        "worker-src 'self' blob:"
      ].join('; '),
    },
  }
});
