import type { Profile } from '../lib/profile';

interface Props {
  profile: Profile;
  apiPath: string;
}

export const JsonDrawer = ({ profile, apiPath }: Props) => (
  <section className="mx-auto mt-6 w-full max-w-6xl px-4 sm:px-6" aria-label="Profile JSON">
    <div className="card animate-rise overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--card-border)] px-5 py-3 text-xs">
        <span className="font-semibold uppercase tracking-[0.16em] text-muted">GET {apiPath}</span>
        <span className="font-mono text-muted">Cache-Control: immutable</span>
      </div>
      <pre className="max-h-[28rem] overflow-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </div>
  </section>
);
