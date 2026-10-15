import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';
import {defineConfig} from 'vite';
import { createApiRouter } from './src/api-router';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'agentpay-api',
      configureServer(server) {
        const apiApp = express();
        apiApp.use(createApiRouter());
        server.middlewares.use(apiApp as any);
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
