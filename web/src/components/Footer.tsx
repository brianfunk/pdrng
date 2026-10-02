export const Footer = () => (
  <footer className="mx-auto mt-16 w-full max-w-6xl px-4 pb-12 text-center text-sm text-muted sm:px-6">
    <p className="mx-auto max-w-2xl text-pretty">
      pdrng is a deterministic engine for games of chance, not a cryptographic random number generator. Every answer on this page is a pure function of the seed, which is why the API caches them forever.
    </p>
    <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      <a className="focus-ring rounded hover:text-[var(--fg)]" href="https://www.npmjs.com/package/pdrng" rel="noreferrer">npm install pdrng</a>
      <a className="focus-ring rounded hover:text-[var(--fg)]" href="/api/docs">API reference</a>
      <a className="focus-ring rounded hover:text-[var(--fg)]" href="/api/openapi.json">OpenAPI 3.1</a>
      <a className="focus-ring rounded hover:text-[var(--fg)]" href="https://github.com/brianfunk/pdrng" rel="noreferrer">Source</a>
    </p>
    <p className="mt-4">
      MIT · <a className="focus-ring rounded hover:text-[var(--fg)]" href="https://www.linkedin.com/in/brianrandyfunk" rel="noreferrer">Brian Funk</a>
    </p>
  </footer>
);
