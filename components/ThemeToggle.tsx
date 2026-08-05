'use client';

import { useLayoutEffect, useState } from 'react';
import {
  applyTheme,
  getStoredTheme,
  toggleTheme,
  type SiteTheme,
} from '@/lib/theme';

type ThemeToggleProps = {
  /** Footer: slightly smaller switch. Default: standard size. */
  variant?: 'default' | 'footer';
};

/**
 * Visual switch between cloudflare (orange) and classic (blue) palettes.
 * No text labels — pure switch with inset stroke.
 */
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

  // "on" = classic (right); "off" = cloudflare (left)
  const isOn = theme === 'classic';
  const compact = variant === 'footer';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      aria-label={isOn ? 'Switch to Cloudflare theme' : 'Switch to Classic theme'}
      title={isOn ? 'Classic theme' : 'Cloudflare theme'}
      className={[
        'relative shrink-0 rounded-full transition-colors',
        'border border-border/50 bg-muted/25',
        // inset stroke + soft inner depth
        'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_2px_rgba(0,0,0,0.35)]',
        'hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border/70',
        compact ? 'h-4 w-7' : 'h-5 w-9',
      ].join(' ')}
      style={{ touchAction: 'manipulation' }}
    >
      <span
        aria-hidden
        className={[
          'pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full',
          'bg-foreground/85 shadow-sm',
          'border border-border/40',
          'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]',
          'transition-transform duration-200 ease-out',
          compact ? 'left-0.5 h-2.5 w-2.5' : 'left-0.5 h-3.5 w-3.5',
          isOn
            ? compact
              ? 'translate-x-3'
              : 'translate-x-4'
            : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}
