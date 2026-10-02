import type { CardSpec } from '../lib/cards';

interface Props {
  spec: CardSpec;
  copied: boolean;
  onCopy: (id: string, text: string) => void;
}

const Value = ({ spec }: { spec: CardSpec }) => {
  switch (spec.kind) {
    case 'color':
      return (
        <span className="flex items-center gap-3">
          <span className="size-6 border border-line" style={{ background: spec.accent }} aria-hidden />
          <span>{spec.value}</span>
        </span>
      );
    case 'roulette':
      return <span>{spec.value} {spec.accent}</span>;
    case 'card':
      return <span>{spec.accent} {spec.value}</span>;
    case 'mono':
      return <span className="break-all text-sm sm:text-base">{spec.value}</span>;
    default:
      return <span>{spec.value}</span>;
  }
};

export const ResultCard = ({ spec, copied, onCopy }: Props) => (
  <button
    type="button"
    onClick={() => onCopy(spec.id, spec.copy)}
    className="focus-ring group flex min-h-32 flex-col border border-soft p-4 text-left hover:border-line"
    aria-label={`${spec.label}: ${spec.copy}. Click to copy.`}
  >
    <span className="flex items-baseline justify-between text-xs uppercase tracking-[0.14em] text-muted">
      <span>{spec.label}</span>
      <span className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
        {copied ? 'copied' : 'copy'}
      </span>
    </span>
    <span className="mt-3 flex-1 text-xl font-bold leading-snug sm:text-2xl">
      <Value spec={spec} />
    </span>
    <span className="mt-3 text-xs leading-relaxed text-muted">{spec.note}</span>
  </button>
);
