# AGENTS.md

Guidance for coding agents and contributors working in this repository.

## What this is

pdrng is a **pseudo deterministic random number generator**: a zero-dependency ESM library
(`index.js`) plus a website and REST API (`web/`). Every output is a pure function of a seed.
The default seed is 814, and the text seed `"brian"` hashes to 814 on purpose.

It is a deterministic engine for games of chance (coin, dice, cards, roulette, tarot, bingo,
Magic 8-Ball, fortunes). Casino and games-of-chance vocabulary is intentional. It is not a
cryptographic RNG and should not be described as one.

## Layout

```
index.js                 library (single file, JSDoc, ESM only)
index.d.ts               hand-written types, keep in sync with index.js
test/index.test.js       unit tests
test/snapshot.test.js    frozen outputs (see below)
web/                     Vite + React 19 + TypeScript + Tailwind v4 site
web/src/lib/routes.ts    API route table (single source for router + OpenAPI)
web/src/lib/api.ts       request handler, used by Netlify and by the Vite dev middleware
web/netlify/functions/   Netlify Functions v2 entry point
netlify.toml             deploy config (base web/, publish dist/)
```

## Hard rules

1. **Outputs are frozen.** `test/snapshot.test.js` locks every public function's result for
   seed 814, `"brian"` and several other seeds. Do not change an existing output. If a change
   is unavoidable it is a breaking change: bump the major version and update the snapshot in
   the same commit with an explanation in CHANGELOG.md.
2. **No randomness in the library or site except `randomSeed()`.** Every other code path must
   be a pure function of the seed. The site's digit-cycling animation derives its frames from
   the seed, not from `Math.random()`.
3. **Validate at the public boundary.** Public functions throw `RangeError` on invalid
   numeric arguments. Never return `NaN`.
4. **100% coverage** on `index.js` and clean ESLint are required. CI enforces both.
5. **Node 20+** for the library. The web app needs Node 22+.
6. **Keep the ASCII art header** at the top of `index.js`.
7. **Update CHANGELOG.md** for any user-facing change.

## Commands

```bash
# library (repo root)
npm install
npm test
npm run test:coverage
npm run lint

# site + API
cd web
npm install
npm run dev        # site and API on one Vite server
npm test
npm run lint
npm run build
```

## Git

- `dev` is the default branch and is protected: changes land through pull requests with
  passing CI. `main` is production and only receives `dev` → `main` PRs.
- Commits are authored by humans. Do not add AI attribution, co-author trailers or model
  names to commits, PR titles, PR bodies or branch names.
- Use the GitHub noreply email configured in the repo for authorship; pushes with other
  addresses are rejected.

## Site conventions

Plain and scientific: monospace type, square corners, grayscale, no marketing copy, no
author name, no disclaimers. The seed field starts empty. The only interactive flourish is
the bevelled generator button that cycles digits and settles on the seed's number.

## Seed algorithm (for reference)

- Text seeds: rolling hash starting at 3, `hash += charCode ^ (hash >> 2)` per character,
  result `2 * (hash + length)`. `"brian"` → 814.
- Numeric seeds: absolute value, floored. Floats in (0, 1) use their decimal digits.
- Seed 814: digits 8 1 4, digit sum 13, digit product 32.
- `dice` and `range` use priority selection: full seed, trailing digits, first digit, last
  digit, middle digits; first value inside the range wins, else `min + seed % span`.
