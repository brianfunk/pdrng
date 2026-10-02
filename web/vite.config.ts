/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Serve the Netlify API function inside `vite dev` so `npm run dev` gives the
 * full site + API without the Netlify CLI. Production uses netlify/functions/api.mts.
 */
const localApi = (): Plugin => ({
  name: 'pdrng-local-api',
  configureServer(server) {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
      if (!req.url || !(req.url === '/api' || req.url.startsWith('/api/') || req.url.startsWith('/api?'))) return next();
      const { handle } = await server.ssrLoadModule('/src/lib/api.ts');
      const host = req.headers.host ?? 'localhost';
      const response: Response = handle(new Request(`http://${host}${req.url}`, { method: req.method }));
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), localApi()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
