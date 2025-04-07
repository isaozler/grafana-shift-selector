import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts', 'e2e/**/*.spec.ts'],
    coverage: {
      provider: 'istanbul', // or 'v8' depending on your preference
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/', 'dist/', 'e2e/'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@grafana': resolve(__dirname, './node_modules/@grafana'),
    },
  },
});
