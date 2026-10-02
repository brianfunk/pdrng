import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'pdrng-theme';

/** Light/dark theme. The inline script in index.html sets the initial class before paint. */
export const useTheme = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { dark, toggle };
};

const readSeedParam = (): string => {
  const value = new URLSearchParams(window.location.search).get('seed');
  return value ?? '';
};

/** The seed text, mirrored to `?seed=` so every result has a shareable URL. */
export const useSeedParam = () => {
  const [seed, setSeedState] = useState(readSeedParam);

  useEffect(() => {
    const onPop = () => setSeedState(readSeedParam());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setSeed = useCallback((next: string) => {
    setSeedState(next);
    const url = new URL(window.location.href);
    if (next.trim() === '') url.searchParams.delete('seed');
    else url.searchParams.set('seed', next);
    window.history.replaceState(null, '', url);
  }, []);

  return [seed, setSeed] as const;
};

/** Copy text and report success for a short moment. */
export const useCopy = (resetMs = 1600) => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(
    async (id: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(id);
        window.setTimeout(() => setCopied((c) => (c === id ? null : c)), resetMs);
      } catch {
        /* clipboard blocked */
      }
    },
    [resetMs],
  );
  return { copied, copy };
};
