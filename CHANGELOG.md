# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
