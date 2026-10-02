import type { Profile } from '../lib/profile';

interface Props {
  profile: Profile;
  apiPath: string;
}

export const JsonDrawer = ({ profile, apiPath }: Props) => (
  <section className="mx-auto mt-3 w-full max-w-5xl px-4 sm:px-6" aria-label="Profile JSON">
    <div className="border border-soft">
      <div className="flex items-center justify-between gap-3 border-b border-soft px-4 py-2 text-xs text-muted">
        <span>GET {apiPath}</span>
        <span>cache-control: immutable</span>
      </div>
      <pre className="max-h-[28rem] overflow-auto px-4 py-3 text-[13px] leading-relaxed">
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
    </div>
  </section>
);
