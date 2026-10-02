import { Dices, X } from 'lucide-react';
import { randomSeed } from 'pdrng';
import type { Profile } from '../lib/profile';

interface Props {
  seed: string;
  profile: Profile;
  onChange: (next: string) => void;
}

export const Hero = ({ seed, profile, onChange }: Props) => {
  const resolved = String(profile.seed);
  const showArrow = seed.trim() !== '' && seed.trim() !== resolved;
  const { digitSum, digitProduct } = profile.derived;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 text-center sm:px-6 sm:pt-14">
      <p className="animate-rise text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
        Pseudo Deterministic Random Number Generator
      </p>
      <h1 className="animate-rise mx-auto mt-3 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl [animation-delay:60ms]">
        Your seed, your number, your fate.
      </h1>
      <p className="animate-rise mx-auto mt-4 max-w-xl text-pretty text-base text-muted sm:text-lg [animation-delay:120ms]">
        Type anything. It becomes a number, and that number decides everything below. Same seed in, same fate out, every single time.
      </p>

      <form
        className="animate-rise mx-auto mt-8 flex w-full max-w-xl items-center gap-2 [animation-delay:180ms]"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <label htmlFor="seed" className="sr-only">
          Seed
        </label>
        <div className="card relative flex flex-1 items-center rounded-2xl">
          <input
            id="seed"
            name="seed"
            value={seed}
            onChange={(e) => onChange(e.target.value)}
            placeholder="brian"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="focus-ring w-full rounded-2xl bg-transparent px-5 py-4 text-lg font-medium outline-none placeholder:text-muted/60"
          />
          {seed !== '' && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="focus-ring mr-2 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-black/5 hover:text-[var(--fg)] dark:hover:bg-white/10"
              aria-label="Clear seed"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(String(randomSeed()))}
          className="focus-ring inline-flex h-[58px] shrink-0 items-center gap-2 rounded-2xl bg-ink px-4 text-sm font-semibold text-paper shadow-sm transition hover:-translate-y-px hover:shadow-md active:translate-y-0 dark:bg-gold-400 dark:text-ink sm:px-5"
        >
          <Dices className="size-4" aria-hidden /> <span className="hidden sm:inline">Random</span>
        </button>
      </form>

      <div className="mt-10" aria-live="polite">
        <div className="flex items-center justify-center gap-3 font-mono text-5xl font-bold tracking-tight sm:text-7xl">
          {showArrow && (
            <>
              <span className="max-w-[40vw] truncate text-2xl font-medium text-muted sm:text-4xl" title={seed}>
                {seed.trim()}
              </span>
              <span className="text-2xl text-muted/60 sm:text-4xl" aria-hidden>
                →
              </span>
            </>
          )}
          <span key={resolved} className="animate-pop tabular-nums text-gold-600 dark:text-gold-400">
            {resolved}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">
          digit sum <span className="font-mono font-semibold text-[var(--fg)]">{digitSum}</span> · digit product{' '}
          <span className="font-mono font-semibold text-[var(--fg)]">{digitProduct}</span> · 6 digits{' '}
          <span className="font-mono font-semibold text-[var(--fg)]">{profile.number.digits6}</span>
        </p>
      </div>
    </section>
  );
};
