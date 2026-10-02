/**
 * pdrng - Pseudo Deterministic Random Number Generator
 * Type definitions. All functions are pure: the same seed always yields the same result.
 */

/** Options accepted by every pdrng function. */
export interface Options {
  /**
   * Custom seed. Numbers are floored and made absolute; floats in (0, 1) such as
   * `Math.random()` are scaled to integers; strings are hashed (`"brian"` → 814).
   * Defaults to 814.
   */
  seed?: number | string;
}

export type CoinSide = 'heads' | 'tails';
export type Parity = 'odd' | 'even';
export type RedOrBlack = 'red' | 'black';
export type RouletteColor = 'red' | 'black' | 'green';
export type RpsChoice = 'rock' | 'paper' | 'scissors';
export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface RouletteResult {
  /** 0 to 36 */
  number: number;
  color: RouletteColor;
  parity: Parity | 'zero';
}

export interface RollResult {
  /** Individual die results, 1..sides each */
  rolls: number[];
  /** Parsed modifier from the notation (e.g. +3), 0 when absent */
  modifier: number;
  /** Sum of rolls plus modifier */
  total: number;
}

/** The default seed, 814. */
export const DEFAULT_SEED: 814;

/**
 * Generate a deterministic number with exactly `digits` digits (1-15).
 * @throws {RangeError} if digits is not an integer between 1 and 15
 */
export function pdrng(digits?: number, options?: Options): number;

/** Deterministic float in [0, 1) with `precision` decimal places (1-15). */
export function float(precision?: number, options?: Options): number;

/** Deterministic integer in [min, max] (inclusive) using seed priority selection. */
export function range(min: number, max: number, options?: Options): number;

/** Array of `count` deterministic numbers with `digits` digits each. */
export function array(count: number, digits?: number, options?: Options): number[];

/** Deterministic UUID in v4 format. */
export function uuid(options?: Options): string;

/** "odd" or "even" based on the seed. */
export function oddOrEven(options?: Options): Parity;

/** "red" or "black" based on the seed's digit sum. */
export function redOrBlack(options?: Options): RedOrBlack;

/** A fresh non-deterministic seed from the Web Crypto API (Math.random fallback). */
export function randomSeed(): number;

/** Deterministic coin flip. */
export function coin(options?: Options): CoinSide;

/** Deterministic die result, 1..sides. @throws {RangeError} if sides < 1 */
export function dice(sides?: number, options?: Options): number;

/** Deterministic playing card, e.g. "8 of Diamonds". */
export function card(options?: Options): string;

/** Deterministic roulette spin. */
export function roulette(options?: Options): RouletteResult;

/** Deterministic rock, paper, scissors. */
export function rps(options?: Options): RpsChoice;

/** Deterministic Magic 8-Ball response. */
export function magic8(options?: Options): string;

/** Deterministic zodiac sign. */
export function zodiac(options?: Options): ZodiacSign;

/** Deterministic Major Arcana tarot card. */
export function tarot(options?: Options): string;

/** Deterministic fortune cookie message. */
export function fortune(options?: Options): string;

/** Deterministic pick from a non-empty array. @throws {Error} if the array is empty */
export function spin<T>(arr: readonly T[], options?: Options): T;

/** Deterministic dice-notation roll, e.g. "2d6+3". @throws {Error} on invalid notation */
export function roll(notation: string, options?: Options): RollResult;

/** Deterministic bingo call, e.g. "B-14". */
export function bingo(options?: Options): string;

/** Deterministic hex color, e.g. "#a81414". */
export function color(options?: Options): string;

export interface Pdrng {
  (digits?: number, options?: Options): number;
  float: typeof float;
  range: typeof range;
  array: typeof array;
  uuid: typeof uuid;
  oddOrEven: typeof oddOrEven;
  redOrBlack: typeof redOrBlack;
  coin: typeof coin;
  dice: typeof dice;
  card: typeof card;
  roulette: typeof roulette;
  rps: typeof rps;
  magic8: typeof magic8;
  zodiac: typeof zodiac;
  tarot: typeof tarot;
  fortune: typeof fortune;
  spin: typeof spin;
  roll: typeof roll;
  bingo: typeof bingo;
  color: typeof color;
  randomSeed: typeof randomSeed;
  DEFAULT_SEED: typeof DEFAULT_SEED;
}

declare const pdrngDefault: Pdrng;
export default pdrngDefault;
