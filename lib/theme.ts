export type SiteTheme = 'cloudflare' | 'classic';

export const THEME_STORAGE_KEY = 'deposit-now-theme';
export const DEFAULT_THEME: SiteTheme = 'cloudflare';

export const THEMES: {
  id: SiteTheme;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'cloudflare',
    label: 'Cloudflare',
    shortLabel: 'CF',
    description: 'Orange Cloudflare palette — x402 ecosystem vibe',
  },
  {
    id: 'classic',
    label: 'Classic',
    shortLabel: 'DN',
    description: 'Original deposit.now blue palette',
  },
];

export function isSiteTheme(value: string | null | undefined): value is SiteTheme {
  return value === 'cloudflare' || value === 'classic';
}

export function getStoredTheme(): SiteTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isSiteTheme(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function toggleTheme(current: SiteTheme): SiteTheme {
  return current === 'cloudflare' ? 'classic' : 'cloudflare';
}

export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement;
  root.classList.add('dark');
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}