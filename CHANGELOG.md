# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-10-02

### Fixed

- **`rps()` chose rock about 90% of the time.** It used the digit product mod 3, and the digit product is divisible by 3 whenever any digit is 0, 3, 6 or 9. Now `(seed + digitSum) mod 3`. Seed 814 still gives scissors.
- **`roll()` and `array()` produced identical dice and elements for a third of seeds** (any seed containing a 0 digit has a digit product of 0). Sub-seeds now step by `2 × digitSum + 1`, which is always odd and nonzero. Seed 814: `roll('2d6+3')` is now `[5, 2]` total 10 (was `[5, 1]` total 9); `array(3, 2)` is now `[14, 41, 68]` (was `[14, 46, 78]`).
- **`spin()` could never reach odd positions of even-length lists for text seeds**, because text seeds always hash to an even number. Index is now `(seed + digitSum) mod length`. Seed 814 with `['a','b','c','d']` is now `"d"` (was `"c"`).
- **Magic 8-Ball had "Reply hazy, try again." twice** and was missing "Concentrate and ask again." Replaced the first duplicate (index 10), so seed 814's answer is unchanged.

These change frozen outputs. Shipped as a patch rather than a major because 1.1.0 was published hours earlier with no dependents and the previous behaviour was a defect, not a design. The snapshot test was updated deliberately and only for the keys listed above.

## [1.1.0] - 2026-10-01

### Added

- **Website + REST API** - interactive site and JSON API deployed on Netlify (see `web/`), with OpenAPI 3.1 spec and Swagger UI at `/api/docs`
- **`resolveSeed(seed)`** - returns the numeric seed any input resolves to (`"brian"` → 814)
- **TypeScript definitions** - `index.d.ts` with typed options and result shapes
- **Frozen-output snapshot tests** - every public function's result for seed 814, `"brian"` and several other seeds is locked; any drift fails CI
- **Input validation** - `pdrng`, `float`, `range`, `array`, `dice` and `roll` throw `RangeError` on invalid arguments instead of returning `NaN` or imprecise numbers

### Changed

- Node.js 20+ required (Node 18 is end of life); CI matrix is now 20, 22, 24
- `pdrng(digits)` and `float(precision)` accept 1-15 digits; larger values lost precision and now throw
- Package description and keywords reframed around games of chance
- `files` field added so only the library ships to npm

### Fixed

- Tiny float seeds such as `1e-7` no longer produce `NaN` digits
- Coverage gap in the `randomSeed()` Math.random fallback

## [1.0.0] - 2026-02-08

### Added

- **Core function** - `pdrng(digits)` with digit-fill algorithm
- **Utilities** - `float`, `range`, `array`, `uuid`, `oddOrEven`, `redOrBlack`
- **13 simulation functions** - `coin`, `dice`, `card`, `roulette`, `rps`, `magic8`, `zodiac`, `tarot`, `fortune`, `spin`, `roll`, `bingo`, `color`
- **Seed priority algorithm** — deterministic selection using priority-ordered seed derivations
- **`randomSeed()`** — generate random seeds using `crypto.getRandomValues` with `Math.random` fallback
- Custom seed support (numeric, text, and float seeds)
- Text seed `"brian"` maps to default seed 814 via rolling XOR hash
- Default seed: 814
- Full test suite (105 tests)
- GitHub Actions CI (Node 18, 20, 22)
- ESLint 9 with flat config
- ESM-only package
- MIT license
