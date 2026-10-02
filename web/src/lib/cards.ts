import type { Profile } from './profile';

/** `word` is a single lowercase token shown capitalized; `text` keeps its own casing. */
export type CardKind = 'text' | 'word' | 'number' | 'color' | 'roulette' | 'card' | 'coin' | 'mono';

export interface CardSpec {
  id: string;
  label: string;
  /** What is displayed large */
  value: string;
  /** Text copied to the clipboard */
  copy: string;
  /** One line explaining the derivation */
  note: string;
  kind: CardKind;
  /** Optional accent data (hex for color, roulette color, suit for card) */
  accent?: string;
}

const SUIT_SYMBOL: Record<string, string> = { Spades: '♠', Hearts: '♥', Diamonds: '♦', Clubs: '♣' };

/** Translate a profile into display cards with plain-language derivation notes. */
export const cardsFor = (p: Profile): CardSpec[] => {
  const { digitSum, digitProduct, firstDigit } = p.derived;
  const seedStr = String(p.seed);
  const last2 = seedStr.length >= 2 ? seedStr.slice(-2) : seedStr;
  const suit = p.card.split(' of ')[1];

  return [
    {
      id: 'card',
      label: 'card',
      value: p.card,
      copy: p.card,
      note: `rank from (seed − 1) mod 13, suit from digit sum ${digitSum} mod 4`,
      kind: 'card',
      accent: SUIT_SYMBOL[suit],
    },
    {
      id: 'roulette',
      label: 'roulette',
      value: String(p.roulette.number),
      copy: `${p.roulette.number} ${p.roulette.color} ${p.roulette.parity}`,
      note: `last two digits ${last2} mod 37 → ${p.roulette.color}, ${p.roulette.parity}`,
      kind: 'roulette',
      accent: p.roulette.color,
    },
    {
      id: 'tarot',
      label: 'tarot',
      value: p.tarot,
      copy: p.tarot,
      note: `Major Arcana card ${p.seed % 22 + 1} of 22, from seed mod 22`,
      kind: 'text',
    },
    {
      id: 'magic8',
      label: 'magic 8-ball',
      value: p.magic8,
      copy: p.magic8,
      note: `answer ${p.seed % 20 + 1} of 20, from seed mod 20`,
      kind: 'text',
    },
    {
      id: 'coin',
      label: 'coin flip',
      value: p.coin,
      copy: p.coin,
      note: `digit sum ${digitSum} is ${digitSum % 2 === 0 ? 'even → heads' : 'odd → tails'}`,
      kind: 'coin',
    },
    {
      id: 'dice',
      label: 'dice',
      value: `${p.dice.d6} · ${p.dice.d20}`,
      copy: `d6 ${p.dice.d6}, d20 ${p.dice.d20}`,
      note: `d6 and d20 by seed priority: first of ${seedStr}, trailing digits, ${firstDigit}, ${p.derived.lastDigit}… that fits`,
      kind: 'number',
    },
    {
      id: 'roll',
      label: 'roll 2d6',
      value: p.roll.rolls.join(' + ') + ` = ${p.roll.total}`,
      copy: `2d6: ${p.roll.rolls.join(', ')} (total ${p.roll.total})`,
      note: `each die is (seed + i × digit product ${digitProduct}) mod 6 + 1`,
      kind: 'number',
    },
    {
      id: 'rps',
      label: 'rock, paper, scissors',
      value: p.rps,
      copy: p.rps,
      note: `digit product ${digitProduct} mod 3 → ${p.rps}`,
      kind: 'word',
    },
    {
      id: 'zodiac',
      label: 'zodiac',
      value: p.zodiac,
      copy: p.zodiac,
      note: `last two digits ${last2} mod 12 → ${p.zodiac}`,
      kind: 'text',
    },
    {
      id: 'fortune',
      label: 'fortune',
      value: p.fortune,
      copy: p.fortune,
      note: `fortune ${digitSum % 20 + 1} of 20, from digit sum ${digitSum} mod 20`,
      kind: 'text',
    },
    {
      id: 'bingo',
      label: 'bingo',
      value: p.bingo,
      copy: p.bingo,
      note: `last two digits ${last2} wrapped into 1–75, lettered by column`,
      kind: 'number',
    },
    {
      id: 'color',
      label: 'color',
      value: p.color,
      copy: p.color,
      note: `first digit ${firstDigit} + 2 in hex, then five seed digits`,
      kind: 'color',
      accent: p.color,
    },
    {
      id: 'redblack',
      label: 'red or black',
      value: p.redOrBlack,
      copy: p.redOrBlack,
      note: `digit sum ${digitSum} is ${digitSum % 2 === 1 ? 'odd → red' : 'even → black'}`,
      kind: 'word',
      accent: p.redOrBlack,
    },
    {
      id: 'oddeven',
      label: 'odd or even',
      value: p.oddOrEven,
      copy: p.oddOrEven,
      note: `the seed ${p.seed} itself is ${p.oddOrEven}`,
      kind: 'word',
    },
    {
      id: 'float',
      label: 'float',
      value: p.float.toFixed(6),
      copy: String(p.float),
      note: `six seed digits behind the decimal point`,
      kind: 'mono',
    },
    {
      id: 'uuid',
      label: 'uuid',
      value: p.uuid,
      copy: p.uuid,
      note: `v4-shaped, built from the seed, digit sum and digit product`,
      kind: 'mono',
    },
  ];
};
