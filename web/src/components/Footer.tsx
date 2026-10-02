const link = 'focus-ring hover:text-[var(--fg)] hover:underline underline-offset-4';

export const Footer = () => (
  <footer className="mx-auto mt-16 flex w-full max-w-5xl flex-wrap gap-x-5 gap-y-1 border-t border-soft px-4 py-6 text-xs text-muted sm:px-6">
    <a className={link} href="https://www.npmjs.com/package/pdrng" rel="noreferrer">npm install pdrng</a>
    <a className={link} href="/api/docs">api docs</a>
    <a className={link} href="/api/openapi.json">openapi.json</a>
    <a className={link} href="https://github.com/brianfunk/pdrng" rel="noreferrer">source</a>
    <span className="ml-auto">MIT</span>
  </footer>
);
