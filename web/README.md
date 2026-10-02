# pdrng web

The site and REST API for [pdrng](../README.md), deployed to Netlify from this folder.

- **Site:** Vite + React 19 + TypeScript + Tailwind v4. Type a seed, see every result, share the URL.
- **API:** one Netlify Function (`netlify/functions/api.mts`) routing everything under `/api`.
  Route table, OpenAPI 3.1 generator and Swagger UI live in `src/lib/`.
- The library is consumed as a local dependency (`"pdrng": "file:.."`), so the site always
  reflects the code at the repo root.

```bash
npm install
npm run dev      # site + API at http://localhost:5173 (API served by a Vite middleware)
npm test         # vitest: profile builder, router, OpenAPI
npm run lint     # oxlint
npm run build    # tsc -b && vite build → dist/
```

Try the API locally:

```bash
curl "localhost:5173/api/v1/profile?seed=brian"
curl "localhost:5173/api/v1/dice?seed=brian&sides=20"
open  http://localhost:5173/api/docs
```

Production is https://pdrng.com (DNS on Cloudflare, hosting on Netlify). Deployment is configured by `../netlify.toml`: base `web/`, publish `dist/`, functions bundled with esbuild, SPA fallback for everything the API does not claim.
