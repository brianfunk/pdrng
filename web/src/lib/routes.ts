import * as p from 'pdrng';
import { buildProfile, coerceSeed } from './profile';

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export interface Param {
  name: string;
  description: string;
  type: 'string' | 'integer' | 'number';
  required?: boolean;
  default?: string | number;
  example?: string | number;
}

export interface Route {
  /** Path segment under /api/v1 */
  name: string;
  summary: string;
  description: string;
  params: Param[];
  /** JSON schema fragment for the 200 response */
  response: Record<string, unknown>;
  handler: (q: URLSearchParams) => unknown;
  /** Deterministic routes are cached forever; non-deterministic ones never. */
  cache: 'immutable' | 'none';
}

export const SEED_PARAM: Param = {
  name: 'seed',
  description:
    'Any text or number. Numeric strings are treated as numbers; everything else is hashed as text ("brian" hashes to 814). Defaults to 814.',
  type: 'string',
  example: 'brian',
};

const seedOpt = (q: URLSearchParams) => {
  const s = coerceSeed(q.get('seed'));
  return s === null ? {} : { seed: s };
};

const intParam = (q: URLSearchParams, name: string, fallback: number): number => {
  const raw = q.get(name);
  if (raw === null || raw === '') return fallback;
  if (!/^-?\d+$/.test(raw.trim())) {
    throw new ApiError(400, 'invalid_parameter', `${name} must be an integer, received "${raw}"`);
  }
  return Number(raw);
};

const requireParam = (q: URLSearchParams, name: string): string => {
  const raw = q.get(name);
  if (raw === null || raw.trim() === '') {
    throw new ApiError(400, 'missing_parameter', `${name} is required`);
  }
  return raw.trim();
};

const str = (description: string) => ({ type: 'string', description });
const int = (description: string) => ({ type: 'integer', description });
const withSeed = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties: { seed: int('The numeric seed the result derives from'), ...properties },
});

/** Wrap a handler so its result always includes the resolved seed. */
const seeded = <T extends Record<string, unknown>>(fn: (o: { seed?: string | number }, q: URLSearchParams) => T) =>
  (q: URLSearchParams) => {
    const o = seedOpt(q);
    return { seed: p.resolveSeed(o.seed), ...fn(o, q) };
  };

export const ROUTES: Route[] = [
  {
    name: 'profile',
    summary: 'Everything at once',
    description: 'Every pdrng result for a seed in one response. This is what the website renders.',
    params: [SEED_PARAM],
    response: { $ref: '#/components/schemas/Profile' },
    handler: (q) => buildProfile(q.get('seed')),
    cache: 'immutable',
  },
  {
    name: 'seed',
    summary: 'Resolve a seed',
    description: 'Returns the numeric seed that an input resolves to, e.g. "brian" becomes 814.',
    params: [SEED_PARAM],
    response: withSeed({ input: { description: 'The input as supplied', oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] } }),
    handler: (q) => {
      const input = coerceSeed(q.get('seed'));
      return { input, seed: p.resolveSeed(input ?? undefined) };
    },
    cache: 'immutable',
  },
  {
    name: 'number',
    summary: 'Deterministic number',
    description: 'A number with exactly `digits` digits (1-15), built from the seed with the digit-fill algorithm.',
    params: [SEED_PARAM, { name: 'digits', description: 'Digit count, 1-15', type: 'integer', default: 3 }],
    response: withSeed({ digits: int('Requested digit count'), value: int('The number') }),
    handler: seeded((o, q) => {
      const digits = intParam(q, 'digits', 3);
      return { digits, value: p.pdrng(digits, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'float',
    summary: 'Deterministic float',
    description: 'A float in [0, 1) with `precision` decimal places (1-15).',
    params: [SEED_PARAM, { name: 'precision', description: 'Decimal places, 1-15', type: 'integer', default: 6 }],
    response: withSeed({ precision: int('Requested precision'), value: { type: 'number' } }),
    handler: seeded((o, q) => {
      const precision = intParam(q, 'precision', 6);
      return { precision, value: p.float(precision, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'range',
    summary: 'Integer in a range',
    description: 'An integer in [min, max] using seed priority selection: the first of the seed, its trailing digits, first digit, last digit and middle digits that fits.',
    params: [
      SEED_PARAM,
      { name: 'min', description: 'Lower bound (inclusive)', type: 'integer', required: true, example: 1 },
      { name: 'max', description: 'Upper bound (inclusive)', type: 'integer', required: true, example: 100 },
    ],
    response: withSeed({ min: int('Lower bound'), max: int('Upper bound'), value: int('Selected integer') }),
    handler: seeded((o, q) => {
      requireParam(q, 'min');
      requireParam(q, 'max');
      const min = intParam(q, 'min', 0);
      const max = intParam(q, 'max', 0);
      return { min, max, value: p.range(min, max, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'array',
    summary: 'Array of numbers',
    description: '`count` numbers with `digits` digits each. Each element uses the sub-seed seed + index × (2 × digitSum + 1).',
    params: [
      SEED_PARAM,
      { name: 'count', description: 'Element count, 0-10000', type: 'integer', default: 5 },
      { name: 'digits', description: 'Digits per element, 1-15', type: 'integer', default: 3 },
    ],
    response: withSeed({ count: int('Element count'), digits: int('Digits per element'), values: { type: 'array', items: { type: 'integer' } } }),
    handler: seeded((o, q) => {
      const count = intParam(q, 'count', 5);
      const digits = intParam(q, 'digits', 3);
      return { count, digits, values: p.array(count, digits, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'uuid',
    summary: 'Deterministic UUID',
    description: 'A UUID in v4 format derived from the seed. Same seed, same UUID.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('UUID v4 format') }),
    handler: seeded((o) => ({ value: p.uuid(o) })),
    cache: 'immutable',
  },
  {
    name: 'odd-or-even',
    summary: 'Odd or even',
    description: 'Parity of the seed itself.',
    params: [SEED_PARAM],
    response: withSeed({ value: { type: 'string', enum: ['odd', 'even'] } }),
    handler: seeded((o) => ({ value: p.oddOrEven(o) })),
    cache: 'immutable',
  },
  {
    name: 'red-or-black',
    summary: 'Red or black',
    description: 'Red when the digit sum is odd, black when even.',
    params: [SEED_PARAM],
    response: withSeed({ value: { type: 'string', enum: ['red', 'black'] } }),
    handler: seeded((o) => ({ value: p.redOrBlack(o) })),
    cache: 'immutable',
  },
  {
    name: 'coin',
    summary: 'Coin flip',
    description: 'Heads when the digit sum is even, tails when odd.',
    params: [SEED_PARAM],
    response: withSeed({ value: { type: 'string', enum: ['heads', 'tails'] } }),
    handler: seeded((o) => ({ value: p.coin(o) })),
    cache: 'immutable',
  },
  {
    name: 'dice',
    summary: 'Roll one die',
    description: 'A result from 1 to `sides` using seed priority selection.',
    params: [SEED_PARAM, { name: 'sides', description: 'Number of sides, 1 or more', type: 'integer', default: 6 }],
    response: withSeed({ sides: int('Number of sides'), value: int('Die result') }),
    handler: seeded((o, q) => {
      const sides = intParam(q, 'sides', 6);
      return { sides, value: p.dice(sides, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'card',
    summary: 'Draw a card',
    description: 'A playing card such as "8 of Diamonds". Rank from the seed, suit from the digit sum.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('e.g. "8 of Diamonds"') }),
    handler: seeded((o) => ({ value: p.card(o) })),
    cache: 'immutable',
  },
  {
    name: 'roulette',
    summary: 'Spin the wheel',
    description: 'A roulette pocket (0-36) with its color and parity.',
    params: [SEED_PARAM],
    response: withSeed({ value: { $ref: '#/components/schemas/Roulette' } }),
    handler: seeded((o) => ({ value: p.roulette(o) })),
    cache: 'immutable',
  },
  {
    name: 'rps',
    summary: 'Rock, paper, scissors',
    description: 'Chosen from (seed + digitSum) modulo 3.',
    params: [SEED_PARAM],
    response: withSeed({ value: { type: 'string', enum: ['rock', 'paper', 'scissors'] } }),
    handler: seeded((o) => ({ value: p.rps(o) })),
    cache: 'immutable',
  },
  {
    name: 'magic8',
    summary: 'Magic 8-Ball',
    description: 'One of the twenty classic answers.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('The answer') }),
    handler: seeded((o) => ({ value: p.magic8(o) })),
    cache: 'immutable',
  },
  {
    name: 'zodiac',
    summary: 'Zodiac sign',
    description: 'A zodiac sign from the last two digits of the seed.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('e.g. "Gemini"') }),
    handler: seeded((o) => ({ value: p.zodiac(o) })),
    cache: 'immutable',
  },
  {
    name: 'tarot',
    summary: 'Tarot card',
    description: 'A Major Arcana card.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('e.g. "The Magician"') }),
    handler: seeded((o) => ({ value: p.tarot(o) })),
    cache: 'immutable',
  },
  {
    name: 'fortune',
    summary: 'Fortune cookie',
    description: 'A fortune chosen from the digit sum.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('The fortune') }),
    handler: seeded((o) => ({ value: p.fortune(o) })),
    cache: 'immutable',
  },
  {
    name: 'spin',
    summary: 'Pick from a list',
    description: 'Choose one entry from a comma-separated list of choices.',
    params: [
      SEED_PARAM,
      { name: 'choices', description: 'Comma-separated options', type: 'string', required: true, example: 'pizza,tacos,sushi' },
    ],
    response: withSeed({ choices: { type: 'array', items: { type: 'string' } }, value: str('The chosen entry') }),
    handler: seeded((o, q) => {
      const choices = requireParam(q, 'choices').split(',').map((c) => c.trim()).filter(Boolean);
      if (choices.length === 0) throw new ApiError(400, 'invalid_parameter', 'choices must contain at least one entry');
      return { choices, value: p.spin(choices, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'roll',
    summary: 'Roll dice notation',
    description: 'Tabletop dice notation such as `2d6+3`. Returns each die, the modifier and the total.',
    params: [SEED_PARAM, { name: 'notation', description: 'Dice notation like 2d6, 1d20+5, 3d8-2', type: 'string', default: '2d6', example: '2d6+3' }],
    response: withSeed({ notation: str('Notation as parsed'), value: { $ref: '#/components/schemas/Roll' } }),
    handler: seeded((o, q) => {
      const notation = (q.get('notation') ?? '2d6').trim() || '2d6';
      return { notation, value: p.roll(notation, o) };
    }),
    cache: 'immutable',
  },
  {
    name: 'bingo',
    summary: 'Bingo call',
    description: 'A bingo call such as "B-14" from the last two digits of the seed.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('e.g. "B-14"') }),
    handler: seeded((o) => ({ value: p.bingo(o) })),
    cache: 'immutable',
  },
  {
    name: 'color',
    summary: 'Hex color',
    description: 'A six-digit hex color derived from the seed digits.',
    params: [SEED_PARAM],
    response: withSeed({ value: str('e.g. "#a81414"') }),
    handler: seeded((o) => ({ value: p.color(o) })),
    cache: 'immutable',
  },
  {
    name: 'random-seed',
    summary: 'Fresh random seed',
    description: 'The one non-deterministic endpoint. Returns a seed from the Web Crypto API to feed into any other route.',
    params: [],
    response: { type: 'object', properties: { seed: int('A fresh random seed') } },
    handler: () => ({ seed: p.randomSeed() }),
    cache: 'none',
  },
];
