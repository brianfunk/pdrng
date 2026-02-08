# Claude Code Instructions for pdrng

## Project Context

pdrng is a seed-based deterministic number generator. All outputs are fully reproducible given the same seed (default: 814). Single-file ESM library, zero dependencies, Node 18+.

**Important:** This is a deterministic simulation library, not a real RNG. Avoid language related to gambling, betting, luck, or chance. Use professional terminology: "simulation functions", "deterministic outcomes", "seed-based selection", etc.

## Development Commands

```bash
npm install        # Install dev dependencies
npm test           # Run Vitest tests
npm run lint       # Run ESLint
npm run test:coverage  # Run tests with coverage report
```

## Code Style

- ES2022+ syntax (const/let, arrow functions, template literals)
- ESM modules only (`import`/`export`)
- Full JSDoc documentation
- 100% test coverage target
- Single quotes, semicolons enforced (ESLint)

## Architecture

Single-file library (`index.js`) with:
- Private helpers: `_textToSeed`, `_normalizeSeed`, `_digits`, `_digitSum`, `_digitProduct`, `_firstDigit`, `_lastDigit`, `_lastN`, `_fillDigits`
- Frozen data constants: MAGIC_8_RESPONSES, MAJOR_ARCANA, FORTUNES, SUITS, RANKS, RPS_OPTIONS, COIN_SIDES, BINGO_LETTERS, RED_NUMBERS, ZODIAC_SIGNS, MONTH_NAMES
- Core: `pdrng(digits, options)` — digit-fill algorithm
- Utilities: `float`, `range`, `array`, `uuid`, `oddOrEven`, `redOrBlack`
- Simulation functions: `coin`, `dice`, `card`, `roulette`, `rps`, `magic8`, `zodiac`, `tarot`, `fortune`, `spin`, `roll`, `bingo`, `color`
- All methods attached to `pdrng` object + named exports

## Seed Algorithm

Default seed: 814. Text seeds: `sum of charCode * (index+1)`.

Key derivations for seed 814:
- digitSum: 13, digitProduct: 32
- firstDigit: 8, lastDigit: 4, lastN(2): 14

## Git Workflow

- `dev` is the default branch — all work happens here
- PRs go from `dev` → `main`
- Never push directly to `main`

## When Making Changes

1. Ensure all tests pass: `npm test`
2. Maintain 100% coverage: `npm run test:coverage`
3. Run linter: `npm run lint`
4. Update CHANGELOG.md for any user-facing changes
5. Preserve the ASCII art header in index.js

---

## Working Style

### Think First, Code Second
For anything non-trivial, plan the approach before writing code. Identify which files change, what the edge cases are, and how to verify it works. A solid plan means fewer iterations and cleaner implementations.

### Own the Problem
When something's broken - CI failing, bug reported, error in logs - just go fix it. Read the error, trace the cause, implement the fix. Don't wait for instructions on each step.

### Verify, Don't Assume
After making changes, prove they work. Run the tests. Check the output. If asked to review code, be genuinely critical - find the issues, don't just approve.

### When Stuck or Wrong
If a solution feels hacky, stop. Rethink from scratch using what you learned. If corrected on a mistake, suggest a CLAUDE.md update to prevent it happening again - be specific about what to avoid.

### Stay Focused
Use subagents for research, exploration, or isolated subtasks. Keep the main conversation for coordinating and making decisions.
