'use client';

import { useLayoutEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type SiteTheme,
} from '@/lib/theme';

type ThemeToggleProps = {
  /** Footer: compact text control (x.ai-style). Default: icon button for nav. */
  variant?: 'default' | 'footer';
};

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
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
  const label = nextTheme === 'cloudflare' ? 'Light' : 'Dark';

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`Switch to ${nextTheme} theme`}
        title={`Switch to ${nextTheme} theme`}
        className="inline-flex items-center gap-1 text-[11px] leading-none text-muted-foreground/70 hover:text-muted-foreground transition-colors shrink-0"
        style={{ touchAction: 'manipulation' }}
      >
        <ThemeIcon className="h-3 w-3 opacity-80" aria-hidden />
        <span>Theme</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="capitalize">{label}</span>
      </button>
    );
  }

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
