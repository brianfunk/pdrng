import { handle } from '../../src/lib/api';

/** Netlify Functions v2 entry point. Everything under /api is routed here. */
export default async (request: Request): Promise<Response> => handle(request);

export const config = {
  path: ['/api', '/api/*'],
};
