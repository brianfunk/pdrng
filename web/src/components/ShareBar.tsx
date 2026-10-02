import { Braces, Check, Link2, Terminal } from 'lucide-react';

interface Props {
  shareUrl: string;
  apiUrl: string;
  jsonOpen: boolean;
  copiedLink: boolean;
  onToggleJson: () => void;
  onCopyLink: () => void;
}

const btn =
  'focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2 text-sm font-medium transition hover:-translate-y-px hover:shadow-sm';

export const ShareBar = ({ shareUrl, apiUrl, jsonOpen, copiedLink, onToggleJson, onCopyLink }: Props) => (
  <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6">
    <button type="button" onClick={onCopyLink} className={btn} aria-live="polite">
      {copiedLink ? <Check className="size-4 text-emerald-600" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      {copiedLink ? 'Link copied' : 'Copy share link'}
    </button>
    <button type="button" onClick={onToggleJson} className={btn} aria-expanded={jsonOpen}>
      <Braces className="size-4" aria-hidden /> {jsonOpen ? 'Hide JSON' : 'View JSON'}
    </button>
    <a href={apiUrl} className={btn} target="_blank" rel="noreferrer">
      <Terminal className="size-4" aria-hidden /> Open in API
    </a>
    <span className="sr-only">{shareUrl}</span>
  </div>
);
