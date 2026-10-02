import { BookOpen, Code2, Moon, Package, Sun } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggleTheme: () => void;
}

const linkClass =
  'focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition hover:text-[var(--fg)]';

export const Header = ({ dark, onToggleTheme }: Props) => (
  <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
    <a href="/" className="focus-ring flex items-center gap-2.5 rounded-lg" aria-label="pdrng home">
      <span className="grid size-9 place-items-center rounded-xl bg-ink font-mono text-[11px] font-bold text-gold-400 shadow-sm dark:bg-white/10">
        814
      </span>
      <span className="text-lg font-semibold tracking-tight">pdrng</span>
    </a>
    <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Primary">
      <a href="/api/docs" className={linkClass}>
        <BookOpen className="size-4" aria-hidden /> <span className="hidden sm:inline">API</span>
      </a>
      <a href="https://www.npmjs.com/package/pdrng" className={linkClass} rel="noreferrer">
        <Package className="size-4" aria-hidden /> <span className="hidden sm:inline">npm</span>
      </a>
      <a href="https://github.com/brianfunk/pdrng" className={linkClass} rel="noreferrer">
        <Code2 className="size-4" aria-hidden /> <span className="hidden sm:inline">GitHub</span>
      </a>
      <button
        type="button"
        onClick={onToggleTheme}
        className="focus-ring ml-1 grid size-9 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-[var(--fg)] dark:hover:bg-white/10"
        aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
      </button>
    </nav>
  </header>
);
