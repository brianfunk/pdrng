[![pdrng](https://img.shields.io/badge/pdrng-Deterministic%20RNG-b5d4ff.svg)](https://github.com/brianfunk/pdrng)
[![npm version](https://img.shields.io/npm/v/pdrng.svg)](https://www.npmjs.com/package/pdrng)
[![npm downloads](https://img.shields.io/npm/dm/pdrng.svg)](https://www.npmjs.com/package/pdrng)
[![CI](https://github.com/brianfunk/pdrng/actions/workflows/ci.yml/badge.svg)](https://github.com/brianfunk/pdrng/actions/workflows/ci.yml)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badge/)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![LinkedIn](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/brianrandyfunk)

# pdrng

> Pseudo Deterministic Random Number Generator — seed-based deterministic number generation.

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
range(1, 100)     // 14
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

#### `randomSeed()`

Generate a random seed using `crypto.getRandomValues` (with `Math.random` fallback).

```javascript
randomSeed()      // e.g. 3847291056 (different each call)
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
dice(20)          // 14
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

Deterministic zodiac sign.

```javascript
zodiac()          // "Gemini"
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

#### `color(options?)`

Deterministic hex color.

```javascript
color()           // "#a81414"
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
dice(6, { seed: 42 })     // 4
card({ seed: 'brian' })   // deterministic card from text seed
```

Text seeds are converted using a rolling XOR hash, designed so that `"brian"` maps to seed 814:

```javascript
pdrng(3, { seed: 'brian' })  // 814 (same as default!)
pdrng(4, { seed: 'brian' })  // 8148
```

## Random Seeds

While pdrng is deterministic by design, you can use random input to get non-deterministic behavior. Pass `Math.random()`, `crypto.getRandomValues()`, or use the built-in `randomSeed()` helper:

```javascript
import { coin, dice, randomSeed } from 'pdrng';

// Built-in helper (uses crypto.getRandomValues for real entropy)
coin({ seed: randomSeed() })      // different each call

// Math.random() works directly as a seed
dice(6, { seed: Math.random() })  // different each call
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
