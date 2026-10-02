# Contributing

Issues and pull requests are welcome. For anything beyond a small fix, open an issue first so
the change can be discussed.

## Ground rules

- **Outputs are frozen.** `test/snapshot.test.js` locks every result for the default seed and
  several others. A change to any existing output is a breaking change and needs a major
  version bump, an updated snapshot and a CHANGELOG entry explaining why.
- **Everything is a pure function of the seed** except `randomSeed()`.
- Keep 100% test coverage on `index.js` and a clean lint. CI checks both.
- Update `CHANGELOG.md` for user-facing changes and `index.d.ts` for API changes.

## Workflow

1. Branch from `dev`.
2. `npm install && npm test && npm run lint` at the root; `cd web && npm install && npm test && npm run build` for the site and API.
3. Open a pull request against `dev`. CI must pass before it can merge.
4. `main` is production and only receives pull requests from `dev`.

See `AGENTS.md` for a fuller description of the repository's conventions.
