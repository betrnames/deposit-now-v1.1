import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Default site theme on load = Cloudflare (see lib/theme.ts DEFAULT_THEME).
 * Colors derived from app/globals.css html.dark[data-theme='cloudflare']:
 *   --background oklch(0.1776 0 0)  → #111111
 *   --card        oklch(0.2264 0 0)  → #1c1c1c
 *   --primary     oklch(0.7235 0.1724 53.7949) → #f6821f
 *   --muted-foreground → #a1a1aa
 */
const CF = {
  bg: '#111111',
  card: '#1c1c1c',
  primary: '#f6821f',
  foreground: '#fafafa',
  muted: '#a1a1aa',
  mutedDim: '#737373',
  border: '#2e2e33',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'social');
fs.mkdirSync(outDir, { recursive: true });

/** Coins mark from DepositLogo / DepositCoinsPaths */
function coinsSvg(size, stroke = CF.primary, strokeWidth = 1.5) {
  return Buffer.from(`
<svg width="${size}" height="${size}" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg" fill="none">
  <g stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"/>
    <path d="M15 6h1v4"/>
    <path d="m6.134 14.768.866-.5 2 3.464"/>
    <circle cx="16" cy="8" r="6"/>
  </g>
</svg>`);
}

/**
 * Homepage-style outline pill: zap + uppercase label, balanced pad.
 * Width uses char + inter-letter tracking (not length * oversize factor).
 *
 * @param {{ x?: number, cx?: number, y: number, label: string, fontSize?: number, h?: number, tracking?: number }} opts
 *   Pass either left edge `x` or center `cx`.
 */
function outlinePill({ x, cx, y, label, fontSize = 16, h = 42, tracking = 0.14 }) {
  const padX = Math.round(h * 0.52);
  const iconSize = Math.round(fontSize * 1.05);
  const iconGap = Math.round(fontSize * 0.5);
  // Bold caps ~0.58–0.64em; letter-spacing only between chars
  const charW = fontSize * 0.6;
  const trackW = fontSize * tracking;
  const textW = label.length * charW + Math.max(0, label.length - 1) * trackW;
  const contentW = iconSize + iconGap + textW;
  const w = Math.ceil(padX * 2 + contentW);
  const left = cx != null ? Math.round(cx - w / 2) : x;
  const cy = y + h / 2;
  const iconX = left + padX;
  const iconY = cy - iconSize / 2;
  const textX = iconX + iconSize + iconGap;
  const zapScale = iconSize / 24;

  return {
    w,
    h,
    left,
    svg: `
  <rect x="${left}" y="${y}" width="${w}" height="${h}"
        rx="${h / 2}" ry="${h / 2}"
        fill="none" stroke="${CF.primary}" stroke-opacity="0.55" stroke-width="2"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${zapScale})" fill="none" stroke="${CF.primary}" stroke-width="2.25"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </g>
  <text x="${textX}" y="${cy}" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${fontSize}" font-weight="900" fill="${CF.primary}"
        letter-spacing="${tracking}em">${label}</text>
`,
  };
}

async function main() {
  // --- Profile pic 400x400 (matches Cloudflare default) ---
  const avatarCoins = await sharp(coinsSvg(240, CF.primary, 1.7)).png().toBuffer();

  const avatarBg = Buffer.from(`
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${CF.bg}"/>
  <circle cx="200" cy="200" r="188" fill="${CF.card}"/>
  <circle cx="200" cy="200" r="188" fill="none" stroke="${CF.primary}" stroke-width="3.5" opacity="0.9"/>
  <circle cx="200" cy="200" r="178" fill="none" stroke="${CF.primary}" stroke-width="1" opacity="0.2"/>
</svg>`);

  await sharp(avatarBg)
    .composite([{ input: avatarCoins, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, 'x-profile.png'));

  // --- Header 1500x500 (mobile-first for X) ---
  // Profile avatar covers bottom-left — keep critical text in upper/center band.
  // No "deposit.now" in title (profile already shows the handle/name).
  const cx = 750;
  const titleSize = 62;
  const tagSize = 28;
  const titleH = 58;
  const tagH = 32;
  const gap = 32;
  const pillH = 42;
  const stackH = pillH + gap + titleH + gap + tagH;
  const stackTop = Math.round((500 - 100 - stackH) / 2) + 8;
  const pill = outlinePill({
    cx,
    y: stackTop,
    label: 'X402 · BASE',
    fontSize: 16,
    h: pillH,
    tracking: 0.14,
  });
  const titleCy = stackTop + pill.h + gap + titleH / 2;
  const tagCy = stackTop + pill.h + gap + titleH + gap + tagH / 2;

  const headerSvg = Buffer.from(`
<svg width="1500" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1500" height="500" fill="${CF.bg}"/>
  <rect width="1500" height="500" fill="url(#grid)"/>

  ${pill.svg}

  <!-- primary message (no brand name — avatar + display name carry that) -->
  <text x="${cx}" y="${titleCy}" text-anchor="middle" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${titleSize}" font-weight="800" fill="${CF.foreground}" letter-spacing="-0.02em">Agent → agent deposits</text>

  <!-- tagline -->
  <text x="${cx}" y="${tagCy}" text-anchor="middle" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${tagSize}" font-weight="600" fill="${CF.primary}">One HTTP call · no API key · 0.25% fee, $0.25 cap</text>
</svg>`);

  await sharp(headerSvg).png().toFile(path.join(outDir, 'x-header.png'));

  // --- OG / social share 1200×630 (matches current site messaging) ---
  const ogW = 1200;
  const ogH = 630;
  const coinsOg = await sharp(coinsSvg(112, CF.primary, 1.55)).png().toBuffer();
  const ogPill = outlinePill({
    x: 72,
    y: 88,
    label: 'X402 · BASE MAINNET',
    fontSize: 15,
    h: 40,
    tracking: 0.12,
  });

  const ogSvg = Buffer.from(`
<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="oggrid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${ogW}" height="${ogH}" fill="${CF.bg}"/>
  <rect width="${ogW}" height="${ogH}" fill="url(#oggrid)"/>
  <rect x="0" y="0" width="8" height="${ogH}" fill="${CF.primary}"/>

  ${ogPill.svg}

  <text x="72" y="220"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="64" font-weight="800" fill="${CF.foreground}" letter-spacing="-0.03em">Open x402</text>
  <text x="72" y="300"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="64" font-weight="800" fill="${CF.primary}" letter-spacing="-0.03em">funding rail</text>

  <text x="72" y="380"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="28" font-weight="600" fill="${CF.primary}">Agents fund any wallet via one HTTP call</text>
  <text x="72" y="430"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="22" font-weight="500" fill="${CF.muted}">0.25% fee · $0.25 cap · no humans · no API key</text>

  <text x="72" y="${ogH - 48}"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="20" fill="${CF.mutedDim}">deposit.now</text>
  <text x="${ogW - 72}" y="${ogH - 48}" text-anchor="end"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="18" fill="${CF.mutedDim}">@Deposit_Now · Base · x402</text>
</svg>`);

  const ogPath = path.join(root, 'public', 'og.png');
  await sharp(ogSvg)
    .composite([{ input: coinsOg, left: ogW - 72 - 112, top: 72 }])
    .png()
    .toFile(ogPath);

  // JPEG (no alpha) — LinkedIn is unreliable with PNG-with-alpha share cards
  await sharp(ogPath)
    .flatten({ background: CF.bg })
    .jpeg({ quality: 92, progressive: true })
    .toFile(path.join(root, 'public', 'og.jpg'));

  // Also keep a social/ copy for X assets folder
  await sharp(ogPath).toFile(path.join(outDir, 'open-rail.v1.png'));

  console.log('theme: cloudflare (default)');
  console.log('primary', CF.primary, 'bg', CF.bg);
  console.log('OK', path.join(outDir, 'x-profile.png'));
  console.log('OK', path.join(outDir, 'x-header.png'));
  console.log('OK', ogPath);
  console.log('OK', path.join(outDir, 'open-rail.v1.png'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
