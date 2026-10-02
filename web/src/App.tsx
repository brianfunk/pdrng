import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultCard } from './components/ResultCard';
import { ShareBar } from './components/ShareBar';
import { JsonDrawer } from './components/JsonDrawer';
import { Footer } from './components/Footer';
import { useCopy, useSeedParam, useTheme } from './hooks';
import { buildProfile } from './lib/profile';
import { cardsFor } from './lib/cards';

export default function App() {
  const { dark, toggle } = useTheme();
  const [seed, setSeed] = useSeedParam();
  const [jsonOpen, setJsonOpen] = useState(false);
  const { copied, copy } = useCopy();

  const profile = useMemo(() => buildProfile(seed), [seed]);
  const cards = useMemo(() => cardsFor(profile), [profile]);

  const seedParam = seed.trim() === '' ? 'brian' : seed.trim();
  const apiPath = `/api/v1/profile?seed=${encodeURIComponent(seedParam)}`;
  const shareUrl = typeof window === 'undefined' ? '' : window.location.href;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header dark={dark} onToggleTheme={toggle} />
      <main className="flex-1">
        <Hero seed={seed} profile={profile} onChange={setSeed} />
        <ShareBar
          shareUrl={shareUrl}
          apiUrl={apiPath}
          jsonOpen={jsonOpen}
          copiedLink={copied === 'link'}
          onToggleJson={() => setJsonOpen((o) => !o)}
          onCopyLink={() => copy('link', window.location.href)}
        />
        {jsonOpen && <JsonDrawer profile={profile} apiPath={apiPath} />}
        <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3" aria-label="Results">
          {cards.map((spec, i) => (
            <ResultCard key={spec.id} spec={spec} index={i} copied={copied === spec.id} onCopy={copy} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
