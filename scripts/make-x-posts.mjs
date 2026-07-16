import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * X post images — Cloudflare default theme (matches site on load).
 * Optimized for mobile: large type, short lines, high contrast.
 * Spec: 1600×900 (16:9) — X timeline friendly.
 */
const CF = {
  bg: '#111111',
  card: '#1c1c1c',
  primary: '#f6821f',
  foreground: '#fafafa',
  muted: '#a1a1aa',
  mutedDim: '#737373',
};

const W = 1600;
const H = 900;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'social');
fs.mkdirSync(outDir, { recursive: true });

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

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function baseLayer() {
  return `
  <defs>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${CF.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0" y="0" width="8" height="${H}" fill="${CF.primary}"/>
  `;
}

function footerBar() {
  return `
  <text x="80" y="${H - 56}"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="22" fill="${CF.mutedDim}">deposit.now</text>
  <text x="${W - 80}" y="${H - 56}" text-anchor="end"
        font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="20" fill="${CF.mutedDim}">Base mainnet · x402</text>
  `;
}

function pill({ x, y, label, fontSize = 20, tracking = 0.16 }) {
  const padX = 28;
  const iconSize = 18;
  const iconGap = 12;
  const h = 48;
  const textW = label.length * fontSize * (0.72 + tracking);
  const w = Math.ceil(padX + iconSize + iconGap + textW + padX);
  const cy = y + h / 2;
  const iconX = x + padX;
  const iconY = cy - iconSize / 2;
  const textX = iconX + iconSize + iconGap;
  const zapScale = iconSize / 24;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}"
        rx="${h / 2}" ry="${h / 2}"
        fill="none" stroke="${CF.primary}" stroke-opacity="0.55" stroke-width="2"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${zapScale})" fill="none" stroke="${CF.primary}" stroke-width="2.25"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </g>
  <text x="${textX}" y="${cy}" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${fontSize}" font-weight="900" fill="${CF.primary}"
        letter-spacing="${tracking}em">${esc(label)}</text>
  `;
}

/** Multiline text block — each line is a full <text> */
function lines(items, { x, startY, lineHeight, size, weight, fill, anchor = 'start' }) {
  return items
    .map((line, i) => {
      const y = startY + i * lineHeight;
      return `<text x="${x}" y="${y}" text-anchor="${anchor}"
        font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
        font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`;
    })
    .join('\n');
}

async function writePng(name, svg) {
  const out = path.join(outDir, name);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log('OK', out);
}

async function main() {
  const coins = await sharp(coinsSvg(120, CF.primary, 1.55)).png().toBuffer();

  // --- 1) Main post: open rail ---
  const post1Svg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${baseLayer()}
      ${pill({ x: 80, y: 100, label: 'X402 · OPEN RAIL' })}
      ${lines(
        ['>_ deposit.now', 'Open x402', 'funding rail'],
        {
          x: 80,
          startY: 260,
          lineHeight: 88,
          size: 84,
          weight: 800,
          fill: CF.foreground,
        }
      )}
      <text x="80" y="560"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="32" font-weight="500" fill="${CF.primary}">Pay amount + 1%  ·  net to any EVM target</text>
      <text x="80" y="620"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="400" fill="${CF.muted}">No deposit.now API key  ·  optional public receipt</text>
      ${footerBar()}
    </svg>`);
  await sharp(post1Svg)
    .composite([{ input: coins, left: 1400, top: 100 }])
    .png()
    .toFile(path.join(outDir, 'x-post-1-open-rail.png'));
  console.log('OK', path.join(outDir, 'x-post-1-open-rail.png'));

  // --- 2) Why x402 / machine commerce ---
  await writePng(
    'x-post-2-why-x402.png',
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${baseLayer()}
      ${pill({ x: 80, y: 100, label: 'MACHINE COMMERCE' })}
      ${lines(
        ['Agents that', "can't pay are", 'just chatbots.'],
        {
          x: 80,
          startY: 260,
          lineHeight: 92,
          size: 78,
          weight: 800,
          fill: CF.foreground,
        }
      )}
      <text x="80" y="580"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="30" font-weight="500" fill="${CF.primary}">x402 = payment is the auth</text>
      <text x="80" y="640"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="26" font-weight="400" fill="${CF.muted}">HTTP 402  ·  no accounts  ·  no humans in the loop</text>
      ${footerBar()}
    </svg>`
  );

  // --- 3) Early founders / open standards ---
  await writePng(
    'x-post-3-early-founders.png',
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${baseLayer()}
      ${pill({ x: 80, y: 100, label: 'EARLY FOUNDERS' })}
      ${lines(
        ['Build on open rails', 'while the standard', 'is still forming.'],
        {
          x: 80,
          startY: 260,
          lineHeight: 88,
          size: 72,
          weight: 800,
          fill: CF.foreground,
        }
      )}
      <text x="80" y="560"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="500" fill="${CF.primary}">Protocol surface + llms.txt &gt; locked-in stacks</text>
      <text x="80" y="620"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="26" font-weight="400" fill="${CF.muted}">Position early. Standards compound.</text>
      ${footerBar()}
    </svg>`
  );

  // --- 4) Honest fit vs CDP Fund ---
  await writePng(
    'x-post-4-honest-fit.png',
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${baseLayer()}
      ${pill({ x: 80, y: 100, label: 'HONEST SCOPE' })}
      ${lines(
        ['Not a Fund clone.', 'An open 402 rail.'],
        {
          x: 80,
          startY: 280,
          lineHeight: 96,
          size: 76,
          weight: 800,
          fill: CF.foreground,
        }
      )}
      <text x="80" y="520"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="400" fill="${CF.muted}">CDP Fund is great inside Coinbase’s stack.</text>
      <text x="80" y="580"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="500" fill="${CF.primary}">deposit.now = any target + x402 + optional receipt</text>
      ${footerBar()}
    </svg>`
  );

  // --- 5) One-liner flow card ---
  await writePng(
    'x-post-5-flow.png',
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${baseLayer()}
      ${pill({ x: 80, y: 100, label: 'ONE CALL' })}
      <text x="80" y="280"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="64" font-weight="800" fill="${CF.foreground}">&gt;_ POST /api/deposit</text>
      <text x="80" y="400"
            font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            font-size="36" font-weight="600" fill="${CF.primary}">target + amount  →  pay amount + 1%</text>
      <text x="80" y="480"
            font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            font-size="36" font-weight="600" fill="${CF.primary}">→  net forward  →  /receipt/{id}</text>
      <text x="80" y="600"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="400" fill="${CF.muted}">payment_received ≠ target funded yet — check forwardStatus</text>
      ${footerBar()}
    </svg>`
  );

  // --- 6) Square 1080 for carousel / profile grid ---
  const S = 1080;
  await writePng(
    'x-post-6-square.png',
    `<svg width="${S}" height="${S}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gridS" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${S}" height="${S}" fill="${CF.bg}"/>
      <rect width="${S}" height="${S}" fill="url(#gridS)"/>
      <rect x="0" y="0" width="8" height="${S}" fill="${CF.primary}"/>
      ${pill({ x: 72, y: 120, label: 'X402 · BASE' })}
      <text x="72" y="340"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="72" font-weight="800" fill="${CF.foreground}">&gt;_ deposit.now</text>
      <text x="72" y="440"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="36" font-weight="600" fill="${CF.primary}">Open x402 funding rail</text>
      <text x="72" y="540"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="400" fill="${CF.muted}">Pay amount + 1%</text>
      <text x="72" y="590"
            font-family="ui-sans-serif, system-ui, 'Segoe UI', sans-serif"
            font-size="28" font-weight="400" fill="${CF.muted}">Net to any EVM target</text>
      <text x="72" y="980"
            font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            font-size="22" fill="${CF.mutedDim}">deposit.now</text>
    </svg>`
  );

  console.log('Done — post images in public/social/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
