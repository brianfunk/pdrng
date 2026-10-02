import { Check, Copy } from 'lucide-react';
import type { CardSpec } from '../lib/cards';

interface Props {
  spec: CardSpec;
  index: number;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
}

const ROULETTE_BG: Record<string, string> = {
  red: 'bg-red-600 text-white',
  black: 'bg-neutral-900 text-white ring-1 ring-white/20',
  green: 'bg-emerald-600 text-white',
};

const Value = ({ spec }: { spec: CardSpec }) => {
  switch (spec.kind) {
    case 'color':
      return (
        <div className="flex items-center gap-3">
          <span className="size-10 shrink-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10" style={{ background: spec.accent }} aria-hidden />
          <span className="font-mono text-2xl font-bold uppercase">{spec.value}</span>
        </div>
      );
    case 'roulette':
      return (
        <div className="flex items-center gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-full font-mono text-lg font-bold ${ROULETTE_BG[spec.accent ?? 'black']}`}>
            {spec.value}
          </span>
          <span className="text-lg font-semibold capitalize">{spec.accent}</span>
        </div>
      );
    case 'card': {
      const red = spec.accent === '♥' || spec.accent === '♦';
      return (
        <div className="flex items-center gap-3">
          <span className={`text-3xl leading-none ${red ? 'text-red-600' : 'text-[var(--fg)]'}`} aria-hidden>
            {spec.accent}
          </span>
          <span className="text-2xl font-bold">{spec.value}</span>
        </div>
      );
    }
    case 'coin':
      return (
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-400 font-mono text-xs font-bold uppercase text-ink shadow-inner ring-2 ring-gold-600/40">
            {spec.value[0]}
          </span>
          <span className="text-2xl font-bold capitalize">{spec.value}</span>
        </div>
      );
    case 'number':
      return <span className="font-mono text-2xl font-bold tabular-nums">{spec.value}</span>;
    case 'mono':
      return <span className="break-all font-mono text-base font-semibold tabular-nums sm:text-lg">{spec.value}</span>;
    default:
      return (
        <span
          className={`text-balance text-xl font-bold leading-snug sm:text-2xl ${spec.kind === 'word' ? 'capitalize' : ''} ${spec.accent === 'red' ? 'text-red-600' : ''}`}
        >
          {spec.value}
        </span>
      );
  }
};

export const ResultCard = ({ spec, index, copied, onCopy }: Props) => (
  <button
    type="button"
    onClick={() => onCopy(spec.id, spec.copy)}
    className="card focus-ring group animate-rise flex min-h-40 flex-col rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    aria-label={`${spec.label}: ${spec.copy}. Click to copy.`}
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{spec.label}</span>
      <span className="text-muted/70 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      </span>
    </div>
    <div key={spec.value} className="animate-pop mt-4 flex-1">
      <Value spec={spec} />
    </div>
    <p className="mt-4 text-xs leading-relaxed text-muted">{spec.note}</p>
  </button>
);
