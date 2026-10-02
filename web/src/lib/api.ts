import { ApiError, ROUTES, type Route } from './routes';
import { buildOpenApi } from './openapi';
import { docsHtml } from './docs';

export { ROUTES, ApiError } from './routes';
export type { Route, Param } from './routes';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body: unknown, status = 200, cache: Route['cache'] = 'none'): Response =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...CORS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cache === 'immutable' ? 'public, max-age=31536000, immutable' : 'no-store',
    },
  });

const error = (status: number, code: string, message: string): Response =>
  json({ error: { code, message } }, status, 'none');

/** Handle any request under /api. Pure function of the Request; safe in any runtime with fetch primitives. */
export const handle = (request: Request): Response => {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET') return error(405, 'method_not_allowed', 'Only GET is supported');

  if (path === '/api') {
    return json(
      {
        name: 'pdrng',
        docs: `${url.origin}/api/docs`,
        openapi: `${url.origin}/api/openapi.json`,
        routes: ROUTES.map((r) => ({ path: `/api/v1/${r.name}`, summary: r.summary })),
      },
      200,
      'immutable',
    );
  }
  if (path === '/api/openapi.json') return json(buildOpenApi(url.origin), 200, 'immutable');
  if (path === '/api/docs') {
    return new Response(docsHtml, {
      headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  const match = path.match(/^\/api\/v1\/([a-z0-9-]+)$/);
  const route = match ? ROUTES.find((r) => r.name === match[1]) : undefined;
  if (!route) return error(404, 'not_found', `No route for ${path}. See /api for the index.`);

  try {
    return json(route.handler(url.searchParams), 200, route.cache);
  } catch (err) {
    if (err instanceof ApiError) return error(err.status, err.code, err.message);
    if (err instanceof RangeError) return error(400, 'invalid_parameter', err.message);
    if (err instanceof Error && /notation|non-empty array/.test(err.message)) {
      return error(400, 'invalid_parameter', err.message);
    }
    return error(500, 'internal_error', 'Something went wrong');
  }
};
