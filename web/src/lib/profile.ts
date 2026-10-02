import * as p from 'pdrng';
import type { RollResult, RouletteResult } from 'pdrng';

/** Shape returned by `/api/v1/profile` and rendered by the site. */
export interface Profile {
  /** The seed exactly as supplied (string or number), or null for the default. */
  input: string | number | null;
  /** The numeric seed every result derives from. */
  seed: number;
  derived: {
    digits: number[];
    digitSum: number;
    digitProduct: number;
    firstDigit: number;
    lastDigit: number;
  };
  number: { digits3: number; digits6: number };
  float: number;
  uuid: string;
  oddOrEven: 'odd' | 'even';
  redOrBlack: 'red' | 'black';
  coin: 'heads' | 'tails';
  dice: { d6: number; d20: number };
  card: string;
  roulette: RouletteResult;
  rps: 'rock' | 'paper' | 'scissors';
  magic8: string;
  zodiac: string;
  tarot: string;
  fortune: string;
  bingo: string;
  color: string;
  roll: RollResult & { notation: string };
}

export const digitsOf = (seed: number): number[] => String(seed).split('').map(Number);

/**
 * Turn any seed input into a numeric seed. Numeric-looking strings such as
 * "814" or "0.5" are treated as numbers; everything else is hashed as text.
 */
export const coerceSeed = (raw: string | number | null | undefined): string | number | null => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return raw;
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
};

/** Build the complete deterministic profile for a seed. */
export const buildProfile = (raw?: string | number | null): Profile => {
  const input = coerceSeed(raw);
  const seed = p.resolveSeed(input ?? undefined);
  const o = { seed };
  const digits = digitsOf(seed);

  return {
    input,
    seed,
    derived: {
      digits,
      digitSum: digits.reduce((a, b) => a + b, 0),
      digitProduct: digits.reduce((a, b) => a * b, 1),
      firstDigit: digits[0],
      lastDigit: digits[digits.length - 1],
    },
    number: { digits3: p.pdrng(3, o), digits6: p.pdrng(6, o) },
    float: p.float(6, o),
    uuid: p.uuid(o),
    oddOrEven: p.oddOrEven(o),
    redOrBlack: p.redOrBlack(o),
    coin: p.coin(o),
    dice: { d6: p.dice(6, o), d20: p.dice(20, o) },
    card: p.card(o),
    roulette: p.roulette(o),
    rps: p.rps(o),
    magic8: p.magic8(o),
    zodiac: p.zodiac(o),
    tarot: p.tarot(o),
    fortune: p.fortune(o),
    bingo: p.bingo(o),
    color: p.color(o),
    roll: { notation: '2d6', ...p.roll('2d6', o) },
  };
};
