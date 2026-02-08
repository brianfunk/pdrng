# pdrng

> Pseudo Deterministic Random Number Generator — seed-based deterministic number generation.

[![CI](https://github.com/brianfunk/pdrng/actions/workflows/ci.yml/badge.svg)](https://github.com/brianfunk/pdrng/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/pdrng.svg)](https://www.npmjs.com/package/pdrng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A JavaScript library for generating deterministic outputs based on a numeric seed. Given the same seed, every function produces the same result every time. Useful for testing, simulations, reproducible demos, and seeded content generation.

**Default seed: 814**

## Install

```bash
npm install pdrng
```

## Quick Start

```javascript
import pdrng from 'pdrng';

pdrng()        // 814
pdrng(1)       // 8
pdrng(6)       // 814814
pdrng.coin()   // "tails"
pdrng.dice()   // 4
pdrng.card()   // "8 of Diamonds"
```

## API

### Core

#### `pdrng(digits?, options?)`

Generate a deterministic number with the specified number of digits.

```javascript
pdrng()           // 814 (default: 3 digits)
pdrng(1)          // 8
pdrng(2)          // 14
pdrng(4)          // 8148
pdrng(5)          // 81414
pdrng(6)          // 814814
```

### Utilities

#### `float(precision?, options?)`

```javascript
float()           // 0.814814
float(3)          // 0.814
```

#### `range(min, max, options?)`

```javascript
range(1, 100)     // 15
```

#### `array(count, digits?, options?)`

```javascript
array(3, 2)       // [14, 46, 78] (sub-seeds per element)
```

#### `uuid(options?)`

```javascript
uuid()            // deterministic UUID v4 format
```

#### `oddOrEven(options?)`

```javascript
oddOrEven()       // "even"
```

#### `redOrBlack(options?)`

```javascript
redOrBlack()      // "red"
```

### Simulation Functions

#### `coin(options?)`

Deterministic coin flip.

```javascript
coin()            // "tails"
```

#### `dice(sides?, options?)`

Deterministic die result.

```javascript
dice()            // 4 (6-sided)
dice(20)          // d20 result
```

#### `card(options?)`

Deterministic playing card draw.

```javascript
card()            // "8 of Diamonds"
```

#### `rps(options?)`

Deterministic rock-paper-scissors.

```javascript
rps()             // "scissors"
```

#### `magic8(options?)`

Deterministic 8-ball response.

```javascript
magic8()          // "Reply hazy, try again."
```

#### `zodiac(options?)`

Deterministic zodiac sign and date.

```javascript
zodiac()          // { sign: "Gemini", date: "June 4" }
```

#### `tarot(options?)`

Deterministic tarot card.

```javascript
tarot()           // "The Magician"
```

#### `fortune(options?)`

Deterministic fortune message.

```javascript
fortune()         // "The answer you seek was never in doubt."
```

#### `spin(array, options?)`

Deterministic selection from an array.

```javascript
spin(['a', 'b', 'c', 'd'])  // "c"
```

#### `roll(notation, options?)`

Deterministic dice notation result (tabletop RPG style).

```javascript
roll('2d6+3')     // { rolls: [5, 1], modifier: 3, total: 9 }
```

#### `bingo(options?)`

Deterministic bingo call.

```javascript
bingo()           // "B-14"
```

#### `lottery(count?, max?, options?)`

Deterministic number selection (sorted, unique).

```javascript
lottery()         // [sorted unique numbers]
lottery(5, 90)    // 5 numbers, 1-90
```

#### `color(options?)`

Deterministic hex color.

```javascript
color()           // "#814148"
```

#### `roulette(options?)`

Deterministic number with color and parity.

```javascript
roulette()        // { number: 14, color: "red", parity: "even" }
```

## Custom Seeds

Every function accepts an `options` object with a `seed` property:

```javascript
import { coin, dice, card } from 'pdrng';

coin({ seed: 42 })        // "heads"
dice(6, { seed: 42 })     // 2
card({ seed: 'brian' })   // deterministic card from text seed
```

Text seeds are converted using: `sum of charCode * (index + 1)`

```javascript
// "brian" = 98*1 + 114*2 + 105*3 + 97*4 + 110*5 = 1579
pdrng(4, { seed: 'brian' })  // 1579
```

## Imports

```javascript
// Default import (with all methods attached)
import pdrng from 'pdrng';
pdrng.coin();

// Named imports
import { coin, dice, card, roll } from 'pdrng';
coin();
```

## Requirements

- Node.js 18+
- ESM only (`import`/`export`)

## License

MIT
