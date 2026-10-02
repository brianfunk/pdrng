interface Props {
  apiUrl: string;
  jsonOpen: boolean;
  copiedLink: boolean;
  onToggleJson: () => void;
  onCopyLink: () => void;
}

const btn = 'focus-ring border border-soft px-3 py-1.5 text-xs uppercase tracking-[0.14em] hover:border-line';

export const ShareBar = ({ apiUrl, jsonOpen, copiedLink, onToggleJson, onCopyLink }: Props) => (
  <div className="mx-auto mt-10 flex w-full max-w-5xl flex-wrap items-center gap-2 px-4 sm:px-6">
    <button type="button" onClick={onCopyLink} className={btn} aria-live="polite">
      {copiedLink ? 'link copied' : 'copy link'}
    </button>
    <button type="button" onClick={onToggleJson} className={btn} aria-expanded={jsonOpen}>
      {jsonOpen ? 'hide json' : 'json'}
    </button>
    <a href={apiUrl} className={btn} target="_blank" rel="noreferrer">
      api
    </a>
  </div>
);
