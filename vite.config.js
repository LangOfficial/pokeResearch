// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Add aliases for custom module directories
      '@components': '/src/components',
      '@utils': '/src/utils',
    },
  },
});
