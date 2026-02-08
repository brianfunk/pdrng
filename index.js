/**
 *            _
 *  _ __   __| |_ __ _ __   __ _
 * | '_ \ / _` | '__| '_ \ / _` |
 * | |_) | (_| | |  | | | | (_| |
 * | .__/ \__,_|_|  |_| |_|\__, |
 * |_|                      |___/
 *
 * pdrng - Pseudo Deterministic Random Number Generator
 *
 * A seed-based deterministic number generator.
 * All outputs are fully reproducible given the same seed (default: 814).
 *
 * @module pdrng
 * @version 1.0.0
 * @license MIT
 * @author Brian Funk
 */

// ─── Default Seed ────────────────────────────────────────────────────────────

const DEFAULT_SEED = 814;

// ─── Private Helpers ─────────────────────────────────────────────────────────

/**
 * Convert a text string to a numeric seed.
 * Formula: sum of charCode * (index + 1)
 * @param {string} text
 * @returns {number}
 */
const _textToSeed = (text) => {
  const str = String(text);
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) * (i + 1);
  }
  return sum;
};

/**
 * Normalize a seed value to a positive integer.
 * Strings are converted via _textToSeed, numbers are floored and abs'd.
 * @param {number|string} seed
 * @returns {number}
 */
const _normalizeSeed = (seed) => {
  if (seed === undefined || seed === null) return DEFAULT_SEED;
  if (typeof seed === 'string') return _textToSeed(seed);
  const n = Math.abs(Math.floor(Number(seed)));
  return n === 0 ? DEFAULT_SEED : n;
};

/**
 * Get the array of digits from a seed.
 * @param {number} seed
 * @returns {number[]}
 */
const _digits = (seed) => String(seed).split('').map(Number);

/**
 * Sum of all digits.
 * @param {number} seed
 * @returns {number}
 */
const _digitSum = (seed) => _digits(seed).reduce((a, b) => a + b, 0);

/**
 * Product of all digits.
 * @param {number} seed
 * @returns {number}
 */
const _digitProduct = (seed) => _digits(seed).reduce((a, b) => a * b, 1);

/**
 * First digit of the seed.
 * @param {number} seed
 * @returns {number}
 */
const _firstDigit = (seed) => _digits(seed)[0];

/**
 * Last digit of the seed.
 * @param {number} seed
 * @returns {number}
 */
const _lastDigit = (seed) => {
  const d = _digits(seed);
  return d[d.length - 1];
};

/**
 * Last N digits of the seed as a number.
 * @param {number} seed
 * @param {number} n
 * @returns {number}
 */
const _lastN = (seed, n) => {
  const str = String(seed);
  if (n >= str.length) return seed;
  return Number(str.slice(-n));
};

/**
 * Digit-fill algorithm: produce a number with exactly `count` digits
 * derived deterministically from the seed.
 *
 * Rules:
 * - count < seed length: 1 digit → first digit, else last N digits
 * - count = seed length: full seed
 * - count > seed length: repeat full seed, remainder uses 1 char = first digit, 2+ chars = last N
 *
 * @param {number} seed
 * @param {number} count
 * @returns {number}
 */
const _fillDigits = (seed, count) => {
  const seedStr = String(seed);
  const seedLen = seedStr.length;

  if (count <= 0) return 0;

  if (count < seedLen) {
    if (count === 1) return _firstDigit(seed);
    return _lastN(seed, count);
  }

  if (count === seedLen) return seed;

  // count > seedLen: repeat seed, then fill remainder
  let result = '';
  const fullRepeats = Math.floor(count / seedLen);
  const remainder = count % seedLen;

  for (let i = 0; i < fullRepeats; i++) {
    result += seedStr;
  }

  if (remainder > 0) {
    if (remainder === 1) {
      result += String(_firstDigit(seed));
    } else {
      result += String(_lastN(seed, remainder));
    }
  }

  return Number(result);
};

// ─── Data Constants ──────────────────────────────────────────────────────────

const MAGIC_8_RESPONSES = Object.freeze([
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes — definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Reply hazy, try again.',
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
]);

const MAJOR_ARCANA = Object.freeze([
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
  'The Fool'
]);

const FORTUNES = Object.freeze([
  'A beautiful, smart, and loving person will be coming into your life.',
  'A dubious friend may be an enemy in camouflage.',
  'A faithful friend is a strong defense.',
  'A feather in the hand is better than a bird in the air.',
  'A fresh start will put you on your way.',
  'A golden egg of opportunity falls into your lap this month.',
  'A good friendship is often more important than a passionate romance.',
  'A good time to finish up old tasks.',
  'A lifetime friend shall soon be made.',
  'A lifetime of happiness lies ahead of you.',
  'A light heart carries you through all the hard times.',
  'A new perspective will come with the new year.',
  'A pleasant surprise is waiting for you.',
  'The answer you seek was never in doubt.',
  'A smile is your passport into the hearts of others.',
  'A smooth long journey! Great expectations.',
  'A soft voice may be awfully persuasive.',
  'A true friend is the best possession.',
  'Accept something that you cannot change, and you will feel better.',
  'All the effort you are making will ultimately pay off.'
]);

const SUITS = Object.freeze(['Spades', 'Diamonds', 'Hearts', 'Clubs']);

const RANKS = Object.freeze([
  'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Jack', 'Queen', 'King'
]);

const RPS_OPTIONS = Object.freeze(['rock', 'paper', 'scissors']);

const COIN_SIDES = Object.freeze(['heads', 'tails']);

const BINGO_LETTERS = Object.freeze(['B', 'I', 'N', 'G', 'O']);

const RED_NUMBERS = Object.freeze([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
]);

const ZODIAC_SIGNS = Object.freeze([
  { name: 'Aries', month: 3, startDay: 21 },
  { name: 'Taurus', month: 4, startDay: 20 },
  { name: 'Gemini', month: 5, startDay: 21 },
  { name: 'Cancer', month: 6, startDay: 21 },
  { name: 'Leo', month: 7, startDay: 23 },
  { name: 'Virgo', month: 8, startDay: 23 },
  { name: 'Libra', month: 9, startDay: 23 },
  { name: 'Scorpio', month: 10, startDay: 23 },
  { name: 'Sagittarius', month: 11, startDay: 22 },
  { name: 'Capricorn', month: 12, startDay: 22 },
  { name: 'Aquarius', month: 1, startDay: 20 },
  { name: 'Pisces', month: 2, startDay: 19 }
]);

const MONTH_NAMES = Object.freeze([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]);

// ─── Core Function ───────────────────────────────────────────────────────────

/**
 * Generate a deterministic "random" number with the specified number of digits.
 *
 * @param {number} [digits=3] - Number of digits in the result
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {number}
 */
const pdrng = (digits = 3, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return _fillDigits(seed, digits);
};

// ─── Utility Functions ───────────────────────────────────────────────────────

/**
 * Generate a deterministic float between 0 and 1.
 *
 * @param {number} [precision=6] - Number of decimal places
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {number}
 */
const float = (precision = 6, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const filled = _fillDigits(seed, precision);
  return Number('0.' + String(filled).padStart(precision, '0'));
};

/**
 * Generate a deterministic integer within a range (inclusive).
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {number}
 */
const range = (min, max, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return min + (seed % (max - min + 1));
};

/**
 * Generate an array of deterministic numbers.
 * Each element uses a sub-seed derived from the main seed + index.
 *
 * @param {number} count - Number of elements
 * @param {number} [digits=3] - Digits per element
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {number[]}
 */
const array = (count, digits = 3, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const result = [];
  for (let i = 0; i < count; i++) {
    const subSeed = seed + i * _digitProduct(seed);
    result.push(_fillDigits(_normalizeSeed(subSeed), digits));
  }
  return result;
};

/**
 * Generate a deterministic UUID (v4 format).
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string}
 */
const uuid = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const ds = _digitSum(seed);
  const dp = _digitProduct(seed);
  const fd = _firstDigit(seed);
  const ld = _lastDigit(seed);

  // Build 32 hex chars deterministically
  const sources = [seed, ds, dp, fd, ld, seed + ds, seed + dp, seed * fd];
  let hex = '';
  for (const src of sources) {
    let val = Math.abs(src);
    for (let i = 0; i < 4; i++) {
      hex += ((val + i * 7) % 16).toString(16);
    }
  }

  // Format as UUID v4: xxxxxxxx-xxxx-4xxx-Nxxx-xxxxxxxxxxxx
  hex = hex.slice(0, 32);
  const chars = hex.split('');
  chars[12] = '4'; // version 4
  const n = (8 + (_digitSum(seed) % 4)); // variant: 8, 9, a, or b
  chars[16] = n.toString(16);

  return [
    chars.slice(0, 8).join(''),
    chars.slice(8, 12).join(''),
    chars.slice(12, 16).join(''),
    chars.slice(16, 20).join(''),
    chars.slice(20, 32).join('')
  ].join('-');
};

/**
 * Determine if the seed is odd or even.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} "odd" or "even"
 */
const oddOrEven = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return seed % 2 === 0 ? 'even' : 'odd';
};

/**
 * Determine red or black based on digit sum.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} "red" or "black"
 */
const redOrBlack = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return _digitSum(seed) % 2 === 1 ? 'red' : 'black';
};

// ─── Game Functions ──────────────────────────────────────────────────────────

/**
 * Flip a deterministic coin.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} "heads" or "tails"
 */
const coin = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return COIN_SIDES[_digitSum(seed) % 2];
};

/**
 * Roll a deterministic die.
 *
 * @param {number} [sides=6] - Number of sides
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {number} 1 to sides
 */
const dice = (sides = 6, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const result = _lastDigit(seed) % sides;
  return result === 0 ? sides : result;
};

/**
 * Draw a deterministic playing card.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} e.g. "8 of Diamonds"
 */
const card = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const rankIndex = (seed - 1) % 13;
  const suitIndex = _digitSum(seed) % 4;
  return `${RANKS[rankIndex]} of ${SUITS[suitIndex]}`;
};

/**
 * Spin the roulette wheel deterministically.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {Object} { number, color, parity }
 */
const roulette = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const num = _lastN(seed, 2) % 37;

  let color;
  if (num === 0) {
    color = 'green';
  } else if (RED_NUMBERS.includes(num)) {
    color = 'red';
  } else {
    color = 'black';
  }

  const parity = num === 0 ? 'zero' : (num % 2 === 0 ? 'even' : 'odd');

  return { number: num, color, parity };
};

/**
 * Play rock, paper, scissors deterministically.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} "rock", "paper", or "scissors"
 */
const rps = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return RPS_OPTIONS[_digitProduct(seed) % 3];
};

/**
 * Shake the Magic 8-Ball deterministically.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string}
 */
const magic8 = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return MAGIC_8_RESPONSES[seed % 20];
};

/**
 * Determine your deterministic zodiac sign.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {Object} { sign, date }
 */
const zodiac = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const signIndex = _lastN(seed, 2) % 12;
  const sign = ZODIAC_SIGNS[signIndex];
  const dayOffset = _digitSum(seed) + 1;

  // Calculate the date within the zodiac period
  const month = sign.month;
  const day = sign.startDay + dayOffset;

  // Simple day overflow handling
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let finalMonth = month;
  let finalDay = day;
  if (finalDay > daysInMonth[finalMonth - 1]) {
    finalDay = finalDay - daysInMonth[finalMonth - 1];
    finalMonth = (finalMonth % 12) + 1;
  }

  const monthName = MONTH_NAMES[finalMonth - 1];
  return { sign: sign.name, date: `${monthName} ${finalDay}` };
};

/**
 * Draw a deterministic tarot card (Major Arcana).
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string}
 */
const tarot = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return MAJOR_ARCANA[seed % 22];
};

/**
 * Receive a deterministic fortune.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string}
 */
const fortune = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  return FORTUNES[_digitSum(seed) % 20];
};

/**
 * Spin a wheel (pick from an array) deterministically.
 *
 * @param {Array} arr - Array of choices
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {*}
 */
const spin = (arr, options = {}) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('spin() requires a non-empty array');
  }
  const seed = _normalizeSeed(options.seed);
  return arr[seed % arr.length];
};

/**
 * Roll dice using standard notation (e.g. "2d6+3").
 *
 * @param {string} notation - Dice notation like "2d6", "1d20+5", "3d8-2"
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {Object} { rolls, modifier, total }
 */
const roll = (notation, options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const match = String(notation).match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) {
    throw new Error(`Invalid dice notation: "${notation}"`);
  }

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;
  const dp = _digitProduct(seed);

  const rolls = [];
  for (let i = 0; i < count; i++) {
    const val = ((seed + i * dp) % sides) + 1;
    rolls.push(val);
  }

  const total = rolls.reduce((a, b) => a + b, 0) + modifier;
  return { rolls, modifier, total };
};

/**
 * Call a bingo number deterministically.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} e.g. "B-14"
 */
const bingo = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const num = (_lastN(seed, 2) - 1) % 75 + 1;
  const letterIndex = Math.floor((num - 1) / 15);
  return `${BINGO_LETTERS[letterIndex]}-${num}`;
};

/**
 * Generate a deterministic hex color.
 *
 * @param {Object} [options={}] - Options
 * @param {number|string} [options.seed] - Custom seed (default: 814)
 * @returns {string} e.g. "#814148"
 */
const color = (options = {}) => {
  const seed = _normalizeSeed(options.seed);
  const seedStr = String(seed);

  // Rotated seed fill: each full repetition shifts start by 1
  let hex = '';
  for (let i = 0; i < 6; i++) {
    const rotation = Math.floor(i / seedStr.length);
    hex += seedStr[(i + rotation) % seedStr.length];
  }

  // Convert digits to hex-valid characters
  // Replace any character > 'f' equivalent — but our digits are 0-9 so they're already valid hex
  return '#' + hex;
};

// ─── Attach Methods ──────────────────────────────────────────────────────────

pdrng.float = float;
pdrng.range = range;
pdrng.array = array;
pdrng.uuid = uuid;
pdrng.oddOrEven = oddOrEven;
pdrng.redOrBlack = redOrBlack;
pdrng.coin = coin;
pdrng.dice = dice;
pdrng.card = card;
pdrng.roulette = roulette;
pdrng.rps = rps;
pdrng.magic8 = magic8;
pdrng.zodiac = zodiac;
pdrng.tarot = tarot;
pdrng.fortune = fortune;
pdrng.spin = spin;
pdrng.roll = roll;
pdrng.bingo = bingo;
pdrng.color = color;
pdrng.DEFAULT_SEED = DEFAULT_SEED;

// ─── Exports ─────────────────────────────────────────────────────────────────

export default pdrng;

export {
  pdrng,
  float,
  range,
  array,
  uuid,
  oddOrEven,
  redOrBlack,
  coin,
  dice,
  card,
  roulette,
  rps,
  magic8,
  zodiac,
  tarot,
  fortune,
  spin,
  roll,
  bingo,
  color,
  DEFAULT_SEED
};
