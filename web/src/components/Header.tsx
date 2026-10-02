import { Moon, Sun } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
}

const link = 'focus-ring px-2 py-1 text-sm text-muted hover:text-[var(--fg)] hover:underline underline-offset-4';

export const Header = ({ dark, onToggleTheme }: Props) => (
  <header className="mx-auto flex w-full max-w-5xl items-center justify-between border-b border-soft px-4 py-3 sm:px-6">
    <a href="/" className="focus-ring flex items-center gap-2" aria-label="pdrng home">
      <span className="grid size-7 place-items-center bg-[var(--fg)] text-base font-bold text-[var(--bg)]" aria-hidden>
        #
      </span>
      <span className="text-base font-bold">pdrng</span>
    </a>
    <nav className="flex items-center gap-1 sm:gap-3" aria-label="Primary">
      <a href="/api/docs" className={link}>api</a>
      <a href="https://www.npmjs.com/package/pdrng" className={link} rel="noreferrer">npm</a>
      <a href="https://github.com/brianfunk/pdrng" className={link} rel="noreferrer">github</a>
      <button
        type="button"
        onClick={onToggleTheme}
        className="focus-ring ml-1 grid size-8 place-items-center border border-soft text-muted hover:border-line hover:text-[var(--fg)]"
        aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      </button>
    </nav>
  </header>
);
