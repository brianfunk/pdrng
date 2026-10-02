import { describe, it, expect } from 'vitest';
import { handle, ROUTES } from './api';
import { buildProfile, coerceSeed } from './profile';
import { buildOpenApi } from './openapi';

const get = (path: string) => handle(new Request(`https://pdrng.test${path}`));
const body = async (path: string) => (await get(path)).json();

describe('buildProfile', () => {
  it('matches the frozen library outputs for "brian" and 814', () => {
    const brian = buildProfile('brian');
    expect(brian.seed).toBe(814);
    expect(brian.number).toEqual({ digits3: 814, digits6: 814814 });
    expect(brian.float).toBe(0.814814);
    expect(brian.coin).toBe('tails');
    expect(brian.dice).toEqual({ d6: 4, d20: 14 });
    expect(brian.card).toBe('8 of Diamonds');
    expect(brian.roulette).toEqual({ number: 14, color: 'red', parity: 'even' });
    expect(brian.rps).toBe('scissors');
    expect(brian.magic8).toBe('Reply hazy, try again.');
    expect(brian.zodiac).toBe('Gemini');
    expect(brian.tarot).toBe('The Magician');
    expect(brian.fortune).toBe('The answer you seek was never in doubt.');
    expect(brian.bingo).toBe('B-14');
    expect(brian.color).toBe('#a81414');
    expect(brian.derived).toEqual({ digits: [8, 1, 4], digitSum: 13, digitProduct: 32, firstDigit: 8, lastDigit: 4 });
    expect({ ...buildProfile(814), input: 'brian' }).toEqual(brian);
    expect({ ...buildProfile(null), input: 'brian' }).toEqual(brian);
  });

  it('treats numeric strings as numbers and other strings as text', () => {
    expect(coerceSeed('814')).toBe(814);
    expect(coerceSeed(' 0.5 ')).toBe(0.5);
    expect(coerceSeed('-42')).toBe(-42);
    expect(coerceSeed('')).toBeNull();
    expect(coerceSeed('  ')).toBeNull();
    expect(coerceSeed('alice')).toBe('alice');
    expect(coerceSeed(7)).toBe(7);
    expect(buildProfile('814').seed).toBe(814);
    expect(buildProfile('alice').seed).not.toBe(814);
  });
});

describe('API router', () => {
  it('serves the index at /api', async () => {
    const res = await get('/api');
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const data = await res.json();
    expect(data.routes).toHaveLength(ROUTES.length);
    expect(data.docs).toBe('https://pdrng.test/api/docs');
  });

  it('serves the OpenAPI spec and Swagger UI', async () => {
    const spec = await body('/api/openapi.json');
    expect(spec.openapi).toBe('3.1.0');
    expect(Object.keys(spec.paths)).toHaveLength(ROUTES.length);
    const docs = await get('/api/docs/');
    expect(docs.status).toBe(200);
    expect(docs.headers.get('content-type')).toContain('text/html');
    expect(await docs.text()).toContain('/api/openapi.json');
  });

  it('returns the profile with immutable caching', async () => {
    const res = await get('/api/v1/profile?seed=brian');
    expect(res.headers.get('cache-control')).toContain('immutable');
    const data = await res.json();
    expect(data.seed).toBe(814);
    expect(data.card).toBe('8 of Diamonds');
  });

  it('answers every route with its documented example', async () => {
    for (const route of ROUTES) {
      const q = new URLSearchParams();
      for (const param of route.params) {
        const value = param.example ?? param.default;
        if (value !== undefined) q.set(param.name, String(value));
      }
      const res = await get(`/api/v1/${route.name}?${q}`);
      expect(res.status, route.name).toBe(200);
      const data = await res.json();
      expect(data, route.name).toHaveProperty('seed');
    }
  });

  it('returns known values for individual routes', async () => {
    expect(await body('/api/v1/dice?seed=814&sides=20')).toEqual({ seed: 814, sides: 20, value: 14 });
    expect(await body('/api/v1/range?seed=brian&min=1&max=100')).toEqual({ seed: 814, min: 1, max: 100, value: 14 });
    expect(await body('/api/v1/seed?seed=brian')).toEqual({ input: 'brian', seed: 814 });
    expect(await body('/api/v1/spin?seed=brian&choices=a,%20b,c,d')).toEqual({ seed: 814, choices: ['a', 'b', 'c', 'd'], value: 'c' });
    expect(await body('/api/v1/roll?seed=brian&notation=2d6%2B3')).toEqual({
      seed: 814, notation: '2d6+3', value: { rolls: [5, 1], modifier: 3, total: 9 },
    });
    expect(await body('/api/v1/array?count=3&digits=2')).toEqual({ seed: 814, count: 3, digits: 2, values: [14, 46, 78] });
    expect(await body('/api/v1/number?digits=6')).toEqual({ seed: 814, digits: 6, value: 814814 });
    expect(await body('/api/v1/float?precision=3')).toEqual({ seed: 814, precision: 3, value: 0.814 });
  });

  it('random-seed is never cached and differs between calls', async () => {
    const res = await get('/api/v1/random-seed');
    expect(res.headers.get('cache-control')).toBe('no-store');
    const a = (await res.json()).seed;
    const b = (await body('/api/v1/random-seed')).seed;
    expect(Number.isInteger(a)).toBe(true);
    expect(a).not.toBe(b);
  });

  it('rejects invalid parameters with 400', async () => {
    const cases: [string, RegExp][] = [
      ['/api/v1/dice?sides=0', /sides must be an integer >= 1/],
      ['/api/v1/dice?sides=abc', /sides must be an integer/],
      ['/api/v1/number?digits=20', /digits must be an integer between 1 and 15/],
      ['/api/v1/range?min=1', /max is required/],
      ['/api/v1/range?min=10&max=1', /max must be an integer between 10/],
      ['/api/v1/spin', /choices is required/],
      ['/api/v1/spin?choices=,,', /at least one entry/],
      ['/api/v1/roll?notation=banana', /Invalid dice notation/],
      ['/api/v1/array?count=-1', /count must be an integer/],
    ];
    for (const [path, pattern] of cases) {
      const res = await get(path);
      expect(res.status, path).toBe(400);
      const data = await res.json();
      expect(data.error.code).toMatch(/invalid_parameter|missing_parameter/);
      expect(data.error.message, path).toMatch(pattern);
    }
  });

  it('returns 404 for unknown routes and 405 for non-GET', async () => {
    expect((await get('/api/v1/nope')).status).toBe(404);
    expect((await get('/api/v2/coin')).status).toBe(404);
    const post = handle(new Request('https://pdrng.test/api/v1/coin', { method: 'POST' }));
    expect(post.status).toBe(405);
    const options = handle(new Request('https://pdrng.test/api/v1/coin', { method: 'OPTIONS' }));
    expect(options.status).toBe(204);
  });
});

describe('OpenAPI document', () => {
  it('documents every parameter and uses the request origin as server', () => {
    const spec = buildOpenApi('https://example.com');
    expect(spec.servers).toEqual([{ url: 'https://example.com' }]);
    const dice = spec.paths['/api/v1/dice'].get;
    expect(dice.parameters.map((p: { name: string }) => p.name)).toEqual(['seed', 'sides']);
    expect(dice.responses['400']).toBeDefined();
    expect(spec.paths['/api/v1/random-seed'].get.responses['400']).toBeUndefined();
    expect(spec.paths['/api/v1/odd-or-even'].get.operationId).toBe('oddOrEven');
  });
});

describe('versioning', () => {
  it('keeps the OpenAPI version in sync with the published package version', async () => {
    const { readFile } = await import('node:fs/promises');
    const root = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url), 'utf8'));
    const web = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
    expect(buildOpenApi('https://x').info.version).toBe(root.version);
    expect(web.version).toBe(root.version);
  });
});
