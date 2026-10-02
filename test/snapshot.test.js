import { describe, it, expect } from 'vitest';
import * as p from '../index.js';

/**
 * Frozen outputs. These values are the public contract of pdrng:
 * seed 814 (and the text seed "brian") must keep producing exactly these results.
 * Any change here is a breaking change and requires a major version bump.
 */
const SNAPSHOT = {
  '7': {
    'number3': 777,
    'number6': 777777,
    'number1': 7,
    'float6': 0.777777,
    'float3': 0.777,
    'range1_100': 7,
    'range1_6': 2,
    'range50_60': 57,
    'array3_2': [
      77,
      14,
      21
    ],
    'uuid': '7e5c7e5c-7e5c-4e5c-be5c-e5c3e5c318f6',
    'oddOrEven': 'odd',
    'redOrBlack': 'red',
    'coin': 'tails',
    'dice6': 2,
    'dice20': 7,
    'card': '7 of Clubs',
    'roulette': {
      'number': 7,
      'color': 'red',
      'parity': 'odd'
    },
    'rps': 'paper',
    'magic8': 'Outlook good.',
    'zodiac': 'Scorpio',
    'tarot': 'Strength',
    'fortune': 'A good time to finish up old tasks.',
    'spin': 'd',
    'roll': {
      'rolls': [
        2,
        3
      ],
      'modifier': 3,
      'total': 8
    },
    'bingo': 'B-7',
    'color': '#977777'
  },
  '42': {
    'number3': 424,
    'number6': 424242,
    'number1': 4,
    'float6': 0.424242,
    'float3': 0.424,
    'range1_100': 42,
    'range1_6': 4,
    'range50_60': 59,
    'array3_2': [
      42,
      50,
      58
    ],
    'uuid': 'a18f6d4b-8f6d-4b29-a907-07e529078f6d',
    'oddOrEven': 'even',
    'redOrBlack': 'black',
    'coin': 'heads',
    'dice6': 4,
    'dice20': 4,
    'card': '3 of Hearts',
    'roulette': {
      'number': 5,
      'color': 'red',
      'parity': 'odd'
    },
    'rps': 'scissors',
    'magic8': 'Without a doubt.',
    'zodiac': 'Libra',
    'tarot': 'The World',
    'fortune': 'A good friendship is often more important than a passionate romance.',
    'spin': 'c',
    'roll': {
      'rolls': [
        1,
        3
      ],
      'modifier': 3,
      'total': 7
    },
    'bingo': 'N-42',
    'color': '#642424'
  },
  '814': {
    'number3': 814,
    'number6': 814814,
    'number1': 8,
    'float6': 0.814814,
    'float3': 0.814,
    'range1_100': 14,
    'range1_6': 4,
    'range50_60': 50,
    'array3_2': [
      14,
      46,
      78
    ],
    'uuid': 'e5c3d4b2-07e5-4f6d-9b29-b290e5c307e5',
    'oddOrEven': 'even',
    'redOrBlack': 'red',
    'coin': 'tails',
    'dice6': 4,
    'dice20': 14,
    'card': '8 of Diamonds',
    'roulette': {
      'number': 14,
      'color': 'red',
      'parity': 'even'
    },
    'rps': 'scissors',
    'magic8': 'Reply hazy, try again.',
    'zodiac': 'Gemini',
    'tarot': 'The Magician',
    'fortune': 'The answer you seek was never in doubt.',
    'spin': 'c',
    'roll': {
      'rolls': [
        5,
        1
      ],
      'modifier': 3,
      'total': 9
    },
    'bingo': 'B-14',
    'color': '#a81414'
  },
  '1000000': {
    'number3': 0,
    'number6': 0,
    'number1': 1,
    'float6': 0,
    'float3': 0,
    'range1_100': 1,
    'range1_6': 1,
    'range50_60': 51,
    'array3_2': [
      0,
      0,
      0
    ],
    'uuid': '07e518f6-07e5-48f6-97e5-18f607e507e5',
    'oddOrEven': 'even',
    'redOrBlack': 'red',
    'coin': 'tails',
    'dice6': 1,
    'dice20': 1,
    'card': 'Ace of Diamonds',
    'roulette': {
      'number': 0,
      'color': 'green',
      'parity': 'zero'
    },
    'rps': 'rock',
    'magic8': 'It is certain.',
    'zodiac': 'Aries',
    'tarot': 'Death',
    'fortune': 'A dubious friend may be an enemy in camouflage.',
    'spin': 'a',
    'roll': {
      'rolls': [
        5,
        5
      ],
      'modifier': 3,
      'total': 13
    },
    'bingo': 'O-75',
    'color': '#30'
  },
  'brian': {
    'number3': 814,
    'number6': 814814,
    'number1': 8,
    'float6': 0.814814,
    'float3': 0.814,
    'range1_100': 14,
    'range1_6': 4,
    'range50_60': 50,
    'array3_2': [
      14,
      46,
      78
    ],
    'uuid': 'e5c3d4b2-07e5-4f6d-9b29-b290e5c307e5',
    'oddOrEven': 'even',
    'redOrBlack': 'red',
    'coin': 'tails',
    'dice6': 4,
    'dice20': 14,
    'card': '8 of Diamonds',
    'roulette': {
      'number': 14,
      'color': 'red',
      'parity': 'even'
    },
    'rps': 'scissors',
    'magic8': 'Reply hazy, try again.',
    'zodiac': 'Gemini',
    'tarot': 'The Magician',
    'fortune': 'The answer you seek was never in doubt.',
    'spin': 'c',
    'roll': {
      'rolls': [
        5,
        1
      ],
      'modifier': 3,
      'total': 9
    },
    'bingo': 'B-14',
    'color': '#a81414'
  },
  '0.5': {
    'number3': 555,
    'number6': 555555,
    'number1': 5,
    'float6': 0.555555,
    'float3': 0.555,
    'range1_100': 5,
    'range1_6': 5,
    'range50_60': 55,
    'array3_2': [
      55,
      10,
      15
    ],
    'uuid': '5c3a5c3a-5c3a-4c3a-9c3a-a18fa18f907e',
    'oddOrEven': 'odd',
    'redOrBlack': 'red',
    'coin': 'tails',
    'dice6': 5,
    'dice20': 5,
    'card': '5 of Diamonds',
    'roulette': {
      'number': 5,
      'color': 'red',
      'parity': 'odd'
    },
    'rps': 'scissors',
    'magic8': 'As I see it, yes.',
    'zodiac': 'Virgo',
    'tarot': 'The Lovers',
    'fortune': 'A golden egg of opportunity falls into your lap this month.',
    'spin': 'b',
    'roll': {
      'rolls': [
        6,
        5
      ],
      'modifier': 3,
      'total': 14
    },
    'bingo': 'B-5',
    'color': '#755555'
  },
  'alice': {
    'number3': 844,
    'number6': 844844,
    'number1': 8,
    'float6': 0.844844,
    'float3': 0.844,
    'range1_100': 44,
    'range1_6': 4,
    'range50_60': 58,
    'array3_2': [
      44,
      72,
      0
    ],
    'uuid': 'c3a107e5-07e5-4f6d-8b29-c3a1c3a107e5',
    'oddOrEven': 'even',
    'redOrBlack': 'black',
    'coin': 'heads',
    'dice6': 4,
    'dice20': 8,
    'card': 'Queen of Spades',
    'roulette': {
      'number': 7,
      'color': 'red',
      'parity': 'odd'
    },
    'rps': 'scissors',
    'magic8': 'You may rely on it.',
    'zodiac': 'Sagittarius',
    'tarot': 'The Hermit',
    'fortune': 'A soft voice may be awfully persuasive.',
    'spin': 'a',
    'roll': {
      'rolls': [
        5,
        1
      ],
      'modifier': 3,
      'total': 9
    },
    'bingo': 'N-44',
    'color': '#a84444'
  },
  'Hello, World!': {
    'number3': 356,
    'number6': 435656,
    'number1': 4,
    'float6': 0.435656,
    'float3': 0.356,
    'range1_100': 56,
    'range1_6': 4,
    'range50_60': 56,
    'array3_2': [
      56,
      16,
      76
    ],
    'uuid': '4b292907-8f6d-4b29-ad4b-6d4bc3a107e5',
    'oddOrEven': 'even',
    'redOrBlack': 'black',
    'coin': 'heads',
    'dice6': 4,
    'dice20': 4,
    'card': 'Ace of Hearts',
    'roulette': {
      'number': 19,
      'color': 'red',
      'parity': 'odd'
    },
    'rps': 'rock',
    'magic8': 'My reply is no.',
    'zodiac': 'Sagittarius',
    'tarot': 'The Magician',
    'fortune': 'Accept something that you cannot change, and you will feel better.',
    'spin': 'a',
    'roll': {
      'rolls': [
        1,
        1
      ],
      'modifier': 3,
      'total': 5
    },
    'bingo': 'G-56',
    'color': '#643564'
  }
};

const seedFor = (key) => (/^\d+(\.\d+)?$/.test(key) ? Number(key) : key);

const profile = (seed) => {
  const o = { seed };
  return {
    number3: p.pdrng(3, o), number6: p.pdrng(6, o), number1: p.pdrng(1, o),
    float6: p.float(6, o), float3: p.float(3, o),
    range1_100: p.range(1, 100, o), range1_6: p.range(1, 6, o), range50_60: p.range(50, 60, o),
    array3_2: p.array(3, 2, o),
    uuid: p.uuid(o), oddOrEven: p.oddOrEven(o), redOrBlack: p.redOrBlack(o),
    coin: p.coin(o), dice6: p.dice(6, o), dice20: p.dice(20, o), card: p.card(o),
    roulette: p.roulette(o), rps: p.rps(o), magic8: p.magic8(o), zodiac: p.zodiac(o),
    tarot: p.tarot(o), fortune: p.fortune(o), spin: p.spin(['a', 'b', 'c', 'd'], o),
    roll: p.roll('2d6+3', o), bingo: p.bingo(o), color: p.color(o)
  };
};

describe('frozen outputs', () => {
  for (const key of Object.keys(SNAPSHOT)) {
    it(`seed ${JSON.stringify(seedFor(key))} produces its frozen profile`, () => {
      expect(profile(seedFor(key))).toEqual(SNAPSHOT[key]);
    });
  }

  it('text seed "brian" equals the default seed 814', () => {
    expect(profile('brian')).toEqual(profile(814));
    expect(profile(undefined)).toEqual(profile(814));
  });
});
