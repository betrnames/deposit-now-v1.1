'use client';

import { useLayoutEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type SiteTheme,
} from '@/lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>('cloudflare');

  useLayoutEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const handleToggle = () => {
    const next = toggleTheme(theme);
    setTheme(next);
    applyTheme(next);
  };

  const nextTheme = toggleTheme(theme);
  const ThemeIcon = nextTheme === 'cloudflare' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
      style={{ touchAction: 'manipulation' }}
    >
      <ThemeIcon className="h-4 w-4" aria-hidden />
    </button>
  );
}