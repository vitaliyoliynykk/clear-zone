import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Clear Zone - Home air quality app',
        short_name: 'Clear Zone',
        description: 'Air quality insights',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/clear-zone.svg',
            sizes: '192x192',
            type: 'image/svg',
          },
          {
            src: '/clear-zone.svg',
            sizes: '512x512',
            type: 'image/svg',
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts', // Файл для ініціалізації тестів
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
