import { useEffect, useRef, useState } from 'react';
import type { Profile } from '../lib/profile';

interface Props {
  seed: string;
  profile: Profile;
  onChange: (next: string) => void;
}

const STEPS = 28;
const STEP_MS = 45;

/**
 * Deterministic "cycling" sequence: the display runs through digits derived from
 * the seed and the step index, then settles on the real value. No randomness.
 */
const frame = (target: string, step: number): string =>
  target
    .split('')
    .map((_, i) => String((step * 7 + i * 3 + target.charCodeAt(i)) % 10))
    .join('');

export const Generator = ({ seed, profile, onChange }: Props) => {
  const target = String(profile.seed);
  const [display, setDisplay] = useState(target);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  const run = () => {
    if (timer.current) window.clearInterval(timer.current);
    let step = 0;
    setRunning(true);
    timer.current = window.setInterval(() => {
      step += 1;
      if (step >= STEPS) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setDisplay(target);
        setRunning(false);
      } else {
        setDisplay(frame(target, step));
      }
    }, STEP_MS);
  };

  // When the seed changes, show the new value immediately (typing is not a generation event).
  useEffect(() => {
    if (!running) setDisplay(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const { digits, digitSum, digitProduct } = profile.derived;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 sm:pt-16" aria-label="Generator">
      <button
        type="button"
        onClick={run}
        data-running={running}
        className="gen focus-ring block w-full cursor-pointer select-none px-4 py-6 text-center text-sm font-bold uppercase tracking-[0.18em] sm:py-8 sm:text-base"
        aria-label="Generate number"
        title="Click to generate"
      >
        <span className="block">Pseudo Deterministic Random Number Generator</span>
        <span className="mt-2 block text-[10px] font-normal normal-case tracking-[0.2em] opacity-70">
          [ click to generate ]
        </span>
      </button>

      <output
        className="mt-10 block text-center font-mono text-7xl font-bold tabular-nums leading-none sm:text-9xl"
        aria-live="polite"
        aria-label="Generated number"
      >
        {display}
      </output>

      <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4 sm:text-sm">
        <div className="flex justify-between border-b border-soft py-1 sm:block">
          <dt className="text-muted">digits</dt>
          <dd className="tabular-nums">{digits.join(' ')}</dd>
        </div>
        <div className="flex justify-between border-b border-soft py-1 sm:block">
          <dt className="text-muted">digit sum</dt>
          <dd className="tabular-nums">{digitSum}</dd>
        </div>
        <div className="flex justify-between border-b border-soft py-1 sm:block">
          <dt className="text-muted">digit product</dt>
          <dd className="tabular-nums">{digitProduct}</dd>
        </div>
        <div className="flex justify-between border-b border-soft py-1 sm:block">
          <dt className="text-muted">6 digits</dt>
          <dd className="tabular-nums">{profile.number.digits6}</dd>
        </div>
      </dl>

      <form className="mx-auto mt-10 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="seed" className="block text-xs uppercase tracking-[0.18em] text-muted">
          seed
        </label>
        <div className="mt-2 flex items-stretch border-2 border-line">
          <input
            id="seed"
            name="seed"
            value={seed}
            onChange={(e) => onChange(e.target.value)}
            placeholder="enter a seed (any text or number)"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="focus-ring w-full bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted/50"
          />
          <span className="flex items-center whitespace-nowrap border-l-2 border-line px-4 text-sm text-muted tabular-nums" aria-hidden>
            → {target}
          </span>
        </div>
        {profile.input !== null && (
          <p className="mt-2 text-xs text-muted">
            {typeof profile.input === 'number'
              ? `numeric input: |floor(${profile.input})| = ${target}`
              : `text input hashed to ${target}`}
          </p>
        )}
      </form>
    </section>
  );
};
