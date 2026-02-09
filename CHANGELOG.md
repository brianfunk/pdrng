# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
