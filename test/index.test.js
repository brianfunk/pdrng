import { describe, it, expect } from 'vitest';
import pdrng, {
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
  randomSeed,
  DEFAULT_SEED
} from '../index.js';

// ─── Constants ───────────────────────────────────────────────────────────────

describe('DEFAULT_SEED', () => {
  it('should be 814', () => {
    expect(DEFAULT_SEED).toBe(814);
  });

  it('should be accessible on pdrng', () => {
    expect(pdrng.DEFAULT_SEED).toBe(814);
  });
});

// ─── Core: pdrng() ──────────────────────────────────────────────────────────

describe('pdrng()', () => {
  it('should return 814 for 3 digits (default)', () => {
    expect(pdrng()).toBe(814);
  });

  it('should return 8 for 1 digit', () => {
    expect(pdrng(1)).toBe(8);
  });

  it('should return 14 for 2 digits', () => {
    expect(pdrng(2)).toBe(14);
  });

  it('should return 814 for 3 digits', () => {
    expect(pdrng(3)).toBe(814);
  });

  it('should return 8148 for 4 digits', () => {
    expect(pdrng(4)).toBe(8148);
  });

  it('should return 81414 for 5 digits', () => {
    expect(pdrng(5)).toBe(81414);
  });

  it('should return 814814 for 6 digits', () => {
    expect(pdrng(6)).toBe(814814);
  });

  it('should return 0 for 0 digits', () => {
    expect(pdrng(0)).toBe(0);
  });

  it('should accept a custom numeric seed', () => {
    expect(pdrng(3, { seed: 123 })).toBe(123);
  });

  it('should accept a string seed', () => {
    // "brian" → sum of charCode * (index+1)
    const result = pdrng(3, { seed: 'brian' });
    expect(typeof result).toBe('number');
    expect(String(result).length).toBeLessThanOrEqual(4);
  });

  it('should produce deterministic results', () => {
    const a = pdrng(6);
    const b = pdrng(6);
    expect(a).toBe(b);
  });

  it('should handle negative seeds', () => {
    expect(pdrng(3, { seed: -42 })).toBe(424);
  });

  it('should use default seed for null/undefined', () => {
    expect(pdrng(3, { seed: null })).toBe(814);
    expect(pdrng(3, { seed: undefined })).toBe(814);
  });

  it('should use default seed for zero', () => {
    expect(pdrng(3, { seed: 0 })).toBe(814);
  });
});

// ─── Utility: float() ───────────────────────────────────────────────────────

describe('float()', () => {
  it('should return 0.814814 for default precision 6', () => {
    expect(float()).toBe(0.814814);
  });

  it('should return 0.814 for precision 3', () => {
    expect(float(3)).toBe(0.814);
  });

  it('should return a number between 0 and 1', () => {
    const result = float();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it('should be deterministic', () => {
    expect(float(6)).toBe(float(6));
  });

  it('should accept a custom seed', () => {
    const result = float(6, { seed: 123 });
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });
});

// ─── Utility: range() ───────────────────────────────────────────────────────

describe('range()', () => {
  it('should return 14 for range(1, 100) with default seed', () => {
    expect(range(1, 100)).toBe(14);
  });

  it('should return a value within bounds', () => {
    const result = range(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('should be deterministic', () => {
    expect(range(1, 100)).toBe(range(1, 100));
  });

  it('should accept a custom seed', () => {
    const result = range(1, 100, { seed: 42 });
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(100);
  });
});

// ─── Utility: array() ───────────────────────────────────────────────────────

describe('array()', () => {
  it('should return an array of the specified length', () => {
    const result = array(5);
    expect(result).toHaveLength(5);
  });

  it('should return numbers with the specified digit count', () => {
    const result = array(3, 2);
    result.forEach(n => {
      expect(String(n).length).toBeLessThanOrEqual(2);
    });
  });

  it('should be deterministic', () => {
    expect(array(3, 3)).toEqual(array(3, 3));
  });

  it('should accept a custom seed', () => {
    const result = array(3, 3, { seed: 42 });
    expect(result).toHaveLength(3);
  });
});

// ─── Utility: uuid() ────────────────────────────────────────────────────────

describe('uuid()', () => {
  it('should return a valid UUID format', () => {
    const result = uuid();
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should be deterministic', () => {
    expect(uuid()).toBe(uuid());
  });

  it('should accept a custom seed', () => {
    const result = uuid({ seed: 42 });
    expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should produce different UUIDs for different seeds', () => {
    expect(uuid({ seed: 1 })).not.toBe(uuid({ seed: 2 }));
  });
});

// ─── Utility: oddOrEven() ───────────────────────────────────────────────────

describe('oddOrEven()', () => {
  it('should return "even" for default seed 814', () => {
    expect(oddOrEven()).toBe('even');
  });

  it('should return "odd" for an odd seed', () => {
    expect(oddOrEven({ seed: 813 })).toBe('odd');
  });

  it('should be deterministic', () => {
    expect(oddOrEven()).toBe(oddOrEven());
  });
});

// ─── Utility: redOrBlack() ──────────────────────────────────────────────────

describe('redOrBlack()', () => {
  it('should return "red" for default seed 814', () => {
    expect(redOrBlack()).toBe('red');
  });

  it('should be deterministic', () => {
    expect(redOrBlack()).toBe(redOrBlack());
  });

  it('should return "black" for a seed with even digit sum', () => {
    // seed 22: digitSum = 4 (even) → black
    expect(redOrBlack({ seed: 22 })).toBe('black');
  });
});

// ─── Game: coin() ───────────────────────────────────────────────────────────

describe('coin()', () => {
  it('should return "tails" for default seed 814', () => {
    expect(coin()).toBe('tails');
  });

  it('should return "heads" or "tails"', () => {
    expect(['heads', 'tails']).toContain(coin());
  });

  it('should be deterministic', () => {
    expect(coin()).toBe(coin());
  });
});

// ─── Game: dice() ───────────────────────────────────────────────────────────

describe('dice()', () => {
  it('should return 4 for default 6-sided die', () => {
    expect(dice()).toBe(4);
  });

  it('should return a value between 1 and sides', () => {
    const result = dice(20);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(20);
  });

  it('should use seed priority selection', () => {
    // seed 10: priority [10, 1, 0] → 1 is first in [1,6]
    expect(dice(6, { seed: 10 })).toBe(1);
  });

  it('should be deterministic', () => {
    expect(dice()).toBe(dice());
  });

  it('should accept a custom seed', () => {
    const result = dice(6, { seed: 42 });
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
});

// ─── Game: card() ───────────────────────────────────────────────────────────

describe('card()', () => {
  it('should return "8 of Diamonds" for default seed 814', () => {
    expect(card()).toBe('8 of Diamonds');
  });

  it('should return a valid card format', () => {
    const result = card();
    expect(result).toMatch(/^\w+ of \w+$/);
  });

  it('should be deterministic', () => {
    expect(card()).toBe(card());
  });

  it('should accept a custom seed', () => {
    const result = card({ seed: 1 });
    expect(result).toMatch(/of/);
  });
});

// ─── Game: roulette() ───────────────────────────────────────────────────────

describe('roulette()', () => {
  it('should return { number: 14, color: "red", parity: "even" } for default seed', () => {
    const result = roulette();
    expect(result.number).toBe(14);
    expect(result.color).toBe('red');
    expect(result.parity).toBe('even');
  });

  it('should return green for 0', () => {
    // Need a seed where lastN(2)%37 === 0, e.g. seed 37
    const result = roulette({ seed: 37 });
    expect(result.number).toBe(0);
    expect(result.color).toBe('green');
    expect(result.parity).toBe('zero');
  });

  it('should be deterministic', () => {
    expect(roulette()).toEqual(roulette());
  });
});

// ─── Game: rps() ────────────────────────────────────────────────────────────

describe('rps()', () => {
  it('should return "scissors" for default seed 814', () => {
    expect(rps()).toBe('scissors');
  });

  it('should return rock, paper, or scissors', () => {
    expect(['rock', 'paper', 'scissors']).toContain(rps());
  });

  it('should be deterministic', () => {
    expect(rps()).toBe(rps());
  });
});

// ─── Game: magic8() ─────────────────────────────────────────────────────────

describe('magic8()', () => {
  it('should return "Reply hazy, try again." for default seed 814', () => {
    expect(magic8()).toBe('Reply hazy, try again.');
  });

  it('should return a string', () => {
    expect(typeof magic8()).toBe('string');
  });

  it('should be deterministic', () => {
    expect(magic8()).toBe(magic8());
  });
});

// ─── Game: zodiac() ─────────────────────────────────────────────────────────

describe('zodiac()', () => {
  it('should return "Gemini" for default seed 814', () => {
    expect(zodiac()).toBe('Gemini');
  });

  it('should return a string', () => {
    expect(typeof zodiac()).toBe('string');
  });

  it('should be deterministic', () => {
    expect(zodiac()).toBe(zodiac());
  });
});

// ─── Game: tarot() ──────────────────────────────────────────────────────────

describe('tarot()', () => {
  it('should return "The Magician" for default seed 814', () => {
    expect(tarot()).toBe('The Magician');
  });

  it('should return a string', () => {
    expect(typeof tarot()).toBe('string');
  });

  it('should be deterministic', () => {
    expect(tarot()).toBe(tarot());
  });
});

// ─── Game: fortune() ────────────────────────────────────────────────────────

describe('fortune()', () => {
  it('should return the expected fortune for default seed 814', () => {
    expect(fortune()).toBe('The answer you seek was never in doubt.');
  });

  it('should return a string', () => {
    expect(typeof fortune()).toBe('string');
  });

  it('should be deterministic', () => {
    expect(fortune()).toBe(fortune());
  });
});

// ─── Game: spin() ───────────────────────────────────────────────────────────

describe('spin()', () => {
  it('should pick deterministically from an array', () => {
    const choices = ['apple', 'banana', 'cherry', 'date'];
    const result = spin(choices);
    // 814 % 4 = 2 → "cherry"
    expect(result).toBe('cherry');
  });

  it('should throw for empty array', () => {
    expect(() => spin([])).toThrow('spin() requires a non-empty array');
  });

  it('should throw for non-array', () => {
    expect(() => spin('not an array')).toThrow('spin() requires a non-empty array');
  });

  it('should be deterministic', () => {
    const choices = ['a', 'b', 'c'];
    expect(spin(choices)).toBe(spin(choices));
  });
});

// ─── Game: roll() ───────────────────────────────────────────────────────────

describe('roll()', () => {
  it('should return { rolls: [5, 1], modifier: 3, total: 9 } for "2d6+3"', () => {
    const result = roll('2d6+3');
    expect(result.rolls).toEqual([5, 1]);
    expect(result.modifier).toBe(3);
    expect(result.total).toBe(9);
  });

  it('should handle notation without modifier', () => {
    const result = roll('1d20');
    expect(result.modifier).toBe(0);
    expect(result.rolls).toHaveLength(1);
    expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
    expect(result.rolls[0]).toBeLessThanOrEqual(20);
  });

  it('should handle negative modifiers', () => {
    const result = roll('1d6-2');
    expect(result.modifier).toBe(-2);
  });

  it('should throw for invalid notation', () => {
    expect(() => roll('abc')).toThrow('Invalid dice notation');
  });

  it('should be deterministic', () => {
    expect(roll('3d8+2')).toEqual(roll('3d8+2'));
  });
});

// ─── Game: bingo() ──────────────────────────────────────────────────────────

describe('bingo()', () => {
  it('should return "B-14" for default seed 814', () => {
    expect(bingo()).toBe('B-14');
  });

  it('should return a valid bingo call', () => {
    const result = bingo();
    expect(result).toMatch(/^[BINGO]-\d+$/);
  });

  it('should be deterministic', () => {
    expect(bingo()).toBe(bingo());
  });
});

// ─── Game: color() ──────────────────────────────────────────────────────────

describe('color()', () => {
  it('should return "#a81414" for default seed 814', () => {
    expect(color()).toBe('#a81414');
  });

  it('should return a valid hex color format', () => {
    const result = color();
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('should be deterministic', () => {
    expect(color()).toBe(color());
  });

  it('should accept a custom seed', () => {
    const result = color({ seed: 123 });
    expect(result).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

// ─── Method Attachment ───────────────────────────────────────────────────────

describe('method attachment', () => {
  it('should have all methods attached to pdrng', () => {
    expect(typeof pdrng.float).toBe('function');
    expect(typeof pdrng.range).toBe('function');
    expect(typeof pdrng.array).toBe('function');
    expect(typeof pdrng.uuid).toBe('function');
    expect(typeof pdrng.oddOrEven).toBe('function');
    expect(typeof pdrng.redOrBlack).toBe('function');
    expect(typeof pdrng.coin).toBe('function');
    expect(typeof pdrng.dice).toBe('function');
    expect(typeof pdrng.card).toBe('function');
    expect(typeof pdrng.roulette).toBe('function');
    expect(typeof pdrng.rps).toBe('function');
    expect(typeof pdrng.magic8).toBe('function');
    expect(typeof pdrng.zodiac).toBe('function');
    expect(typeof pdrng.tarot).toBe('function');
    expect(typeof pdrng.fortune).toBe('function');
    expect(typeof pdrng.spin).toBe('function');
    expect(typeof pdrng.roll).toBe('function');
    expect(typeof pdrng.bingo).toBe('function');
    expect(typeof pdrng.color).toBe('function');
    expect(typeof pdrng.randomSeed).toBe('function');
  });

  it('should produce same results via method or named export', () => {
    expect(pdrng.coin()).toBe(coin());
    expect(pdrng.dice()).toBe(dice());
    expect(pdrng.card()).toBe(card());
    expect(pdrng.rps()).toBe(rps());
    expect(pdrng.float()).toBe(float());
  });
});

// ─── Custom Seeds ────────────────────────────────────────────────────────────

describe('custom seeds', () => {
  it('should handle text seed "brian"', () => {
    // "brian": b=98*1 + r=114*2 + i=105*3 + a=97*4 + n=110*5
    // = 98 + 228 + 315 + 388 + 550 = 1579
    const result = pdrng(4, { seed: 'brian' });
    expect(result).toBe(1579);
  });

  it('should produce different results for different seeds', () => {
    const a = pdrng(3, { seed: 'alice' });
    const b = pdrng(3, { seed: 'bob' });
    expect(a).not.toBe(b);
  });

  it('should handle single-digit seeds', () => {
    const result = pdrng(3, { seed: 5 });
    expect(result).toBe(555);
  });

  it('should handle large seeds', () => {
    const result = pdrng(3, { seed: 123456789 });
    expect(typeof result).toBe('number');
  });
});

// ─── Utility: randomSeed() ───────────────────────────────────────────────────

describe('randomSeed()', () => {
  it('should return a positive integer', () => {
    const seed = randomSeed();
    expect(typeof seed).toBe('number');
    expect(seed).toBeGreaterThan(0);
    expect(Number.isInteger(seed)).toBe(true);
  });

  it('should be accessible on pdrng', () => {
    expect(typeof pdrng.randomSeed).toBe('function');
  });

  it('should work as a seed for any function', () => {
    const seed = randomSeed();
    expect(() => {
      coin({ seed });
      dice(6, { seed });
      range(1, 100, { seed });
    }).not.toThrow();
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('should handle float seed by flooring', () => {
    expect(pdrng(3, { seed: 814.9 })).toBe(814);
  });

  it('should handle Math.random() as a seed', () => {
    // 0.738193 → strips "0." → 738193, then fillDigits(738193, 3) → 193
    const result = pdrng(3, { seed: 0.738193 });
    expect(result).toBe(193);
  });

  it('should handle small floats as seeds', () => {
    const result = pdrng(3, { seed: 0.5 });
    expect(result).toBe(555);
  });

  it('should handle very large digit counts', () => {
    const result = pdrng(20);
    expect(String(result).length).toBe(20);
  });

  it('should produce consistent results across all functions with same seed', () => {
    const seed = 42;
    const opts = { seed };
    // All functions should return without error
    expect(() => {
      pdrng(3, opts);
      float(6, opts);
      range(1, 100, opts);
      array(3, 3, opts);
      uuid(opts);
      oddOrEven(opts);
      redOrBlack(opts);
      coin(opts);
      dice(6, opts);
      card(opts);
      roulette(opts);
      rps(opts);
      magic8(opts);
      zodiac(opts);
      tarot(opts);
      fortune(opts);
      spin(['a', 'b'], opts);
      roll('1d6', opts);
      bingo(opts);
      color(opts);
    }).not.toThrow();
  });
});
