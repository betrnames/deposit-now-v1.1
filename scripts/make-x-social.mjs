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
  // On X mobile the banner is heavily scaled down + center-cropped.
  // Keep 2–3 large lines, centered, high contrast. Drop tiny mono footer.
  // Profile avatar covers bottom-left — leave lower ~20% empty of critical text.
  const cx = 750;
  // Larger pill for mobile readability (less letter-spacing than desktop site)
  const pillH = 48;
  const pillPadX = 28;
  const iconSize = 18;
  const iconGap = 12;
  const pillChars = 'X402 · BASE';
  const fontSize = 18;
  const trackingEm = 0.18; // still wide, but not unreadable when scaled down
  const pillTextW = pillChars.length * fontSize * (0.75 + trackingEm);
  const pillW = Math.ceil(pillPadX + iconSize + iconGap + pillTextW + pillPadX);
  const pillX = cx - pillW / 2;

  // Even vertical rhythm: equal gap measured between each row's bounding box
  const titleSize = 88;
  const tagSize = 32;
  // Cap heights for layout (tight visual boxes, not full em-box)
  const titleH = 72;
  const tagH = 36;
  const gap = 44; // same air between pill→title and title→tagline
  const stackH = pillH + gap + titleH + gap + tagH;
  // Keep stack clear of X profile crop (~bottom 90px)
  const stackTop = Math.round((500 - 80 - stackH) / 2) + 4;

  const pillY = stackTop;
  const pillCy = pillY + pillH / 2;
  const titleCy = pillY + pillH + gap + titleH / 2;
  const tagCy = pillY + pillH + gap + titleH + gap + tagH / 2;

  const iconX = pillX + pillPadX;
  const iconY = pillCy - iconSize / 2;
  const textX = iconX + iconSize + iconGap;

  const zapScale = iconSize / 24;
  const zapTransform = `translate(${iconX}, ${iconY}) scale(${zapScale})`;

  const headerSvg = Buffer.from(`
<svg width="1500" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1500" height="500" fill="${CF.bg}"/>
  <rect width="1500" height="500" fill="url(#grid)"/>

  <!-- row 1: pill -->
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}"
        rx="${pillH / 2}" ry="${pillH / 2}"
        fill="none" stroke="${CF.primary}" stroke-opacity="0.55" stroke-width="2"/>
  <g transform="${zapTransform}" fill="none" stroke="${CF.primary}" stroke-width="2.25"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </g>
  <text x="${textX}" y="${pillCy}"
        dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${fontSize}" font-weight="900" fill="${CF.primary}"
        letter-spacing="0.18em">${pillChars}</text>

  <!-- row 2: title (center-aligned baseline for even gaps) -->
  <text x="${cx}" y="${titleCy}" text-anchor="middle" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${titleSize}" font-weight="800" fill="${CF.foreground}" letter-spacing="-0.03em">&gt;_ deposit.now</text>

  <!-- row 3: tagline -->
  <text x="${cx}" y="${tagCy}" text-anchor="middle" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${tagSize}" font-weight="600" fill="${CF.primary}">Open x402 funding rail</text>
</svg>`);

  await sharp(headerSvg).png().toFile(path.join(outDir, 'x-header.png'));

  // --- OG / social share 1200×630 (matches current site messaging) ---
  const ogW = 1200;
  const ogH = 630;
  const coinsOg = await sharp(coinsSvg(112, CF.primary, 1.55)).png().toBuffer();

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

  <!-- pill -->
  <rect x="72" y="88" width="268" height="44" rx="22" ry="22"
        fill="none" stroke="${CF.primary}" stroke-opacity="0.55" stroke-width="2"/>
  <g transform="translate(96, 99) scale(0.75)" fill="none" stroke="${CF.primary}" stroke-width="2.25"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </g>
  <text x="128" y="110" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="16" font-weight="900" fill="${CF.primary}" letter-spacing="0.16em">X402 · BASE MAINNET</text>

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
        font-size="22" font-weight="500" fill="${CF.muted}">amount + 1% · no humans · no API key needed</text>

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
