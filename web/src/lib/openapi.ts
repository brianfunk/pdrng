import { ROUTES, type Param } from './routes';

const paramSchema = (param: Param) => {
  const schema: Record<string, unknown> = { type: param.type };
  if (param.default !== undefined) schema.default = param.default;
  return {
    name: param.name,
    in: 'query',
    required: Boolean(param.required),
    description: param.description,
    schema,
    ...(param.example !== undefined ? { example: param.example } : {}),
  };
};

/** Build the OpenAPI 3.1 document from the same route table the router uses. */
export const buildOpenApi = (origin: string) => ({
  openapi: '3.1.0',
  info: {
    title: 'pdrng API',
    version: '1.1.1',
    summary: 'Pseudo Deterministic Random Number Generator. Same seed, same output.',
    description:
      'Every route takes a `seed` and returns the same answer for that seed, forever. ' +
      'Pass any word or number: "brian" resolves to 814, the default. Deterministic responses are cached immutably at the edge.',
    license: { name: 'MIT', url: 'https://github.com/brianfunk/pdrng/blob/main/LICENSE' },
    contact: { name: 'Brian Funk', url: 'https://github.com/brianfunk/pdrng' },
  },
  servers: [{ url: origin }],
  tags: [
    { name: 'Profile', description: 'Everything for a seed' },
    { name: 'Numbers', description: 'Numeric utilities' },
    { name: 'Games', description: 'Games of chance' },
    { name: 'Fate', description: 'Oracles and omens' },
  ],
  paths: Object.fromEntries(
    ROUTES.map((route) => [
      `/api/v1/${route.name}`,
      {
        get: {
          operationId: route.name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
          tags: [tagFor(route.name)],
          summary: route.summary,
          description: route.description,
          parameters: route.params.map(paramSchema),
          responses: {
            '200': { description: 'Success', content: { 'application/json': { schema: route.response } } },
            ...(route.params.length
              ? { '400': { description: 'Invalid parameter', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } } }
              : {}),
          },
        },
      },
    ]),
  ),
  components: {
    schemas: {
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: { code: { type: 'string', example: 'invalid_parameter' }, message: { type: 'string' } },
          },
        },
      },
      Roulette: {
        type: 'object',
        properties: {
          number: { type: 'integer', minimum: 0, maximum: 36 },
          color: { type: 'string', enum: ['red', 'black', 'green'] },
          parity: { type: 'string', enum: ['odd', 'even', 'zero'] },
        },
      },
      Roll: {
        type: 'object',
        properties: {
          rolls: { type: 'array', items: { type: 'integer' } },
          modifier: { type: 'integer' },
          total: { type: 'integer' },
        },
      },
      Profile: {
        type: 'object',
        properties: {
          input: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] },
          seed: { type: 'integer' },
          derived: {
            type: 'object',
            properties: {
              digits: { type: 'array', items: { type: 'integer' } },
              digitSum: { type: 'integer' },
              digitProduct: { type: 'integer' },
              firstDigit: { type: 'integer' },
              lastDigit: { type: 'integer' },
            },
          },
          number: { type: 'object', properties: { digits3: { type: 'integer' }, digits6: { type: 'integer' } } },
          float: { type: 'number' },
          uuid: { type: 'string' },
          oddOrEven: { type: 'string', enum: ['odd', 'even'] },
          redOrBlack: { type: 'string', enum: ['red', 'black'] },
          coin: { type: 'string', enum: ['heads', 'tails'] },
          dice: { type: 'object', properties: { d6: { type: 'integer' }, d20: { type: 'integer' } } },
          card: { type: 'string' },
          roulette: { $ref: '#/components/schemas/Roulette' },
          rps: { type: 'string', enum: ['rock', 'paper', 'scissors'] },
          magic8: { type: 'string' },
          zodiac: { type: 'string' },
          tarot: { type: 'string' },
          fortune: { type: 'string' },
          bingo: { type: 'string' },
          color: { type: 'string' },
          roll: { allOf: [{ $ref: '#/components/schemas/Roll' }, { type: 'object', properties: { notation: { type: 'string' } } }] },
        },
      },
    },
  },
});

function tagFor(name: string): string {
  if (name === 'profile' || name === 'seed') return 'Profile';
  if (['number', 'float', 'range', 'array', 'uuid', 'odd-or-even', 'random-seed', 'color'].includes(name)) return 'Numbers';
  if (['coin', 'dice', 'card', 'roulette', 'rps', 'spin', 'roll', 'bingo', 'red-or-black'].includes(name)) return 'Games';
  return 'Fate';
}
