interface DepositLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

/** Lucide coins — scaled/positioned to drop into the wallet opening */
export function DepositCoinsPaths() {
  return (
    <>
      <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
      <path d="M15 6h1v4" />
      <path d="m6.134 14.768.866-.5 2 3.464" />
      <circle cx="16" cy="8" r="6" />
    </>
  );
}

export const WALLET_BOT_SCALE = 0.74;
const WALLET_BOT_CENTER = `translate(12, 12) scale(${WALLET_BOT_SCALE}) translate(-12, -12)`;
export const COINS_SCALE = 0.68;
export const COINS_TRANSLATE_X = 0.85;
export const COINS_TRANSLATE_Y_START = -2.75;
const COINS_OFFSET = `translate(${COINS_TRANSLATE_X}, ${COINS_TRANSLATE_Y_START}) scale(${COINS_SCALE})`;

function CoinsIcon({ className }: { className?: string }) {
  return (
    <g className={className}>
      <g transform={COINS_OFFSET}>
        <DepositCoinsPaths />
      </g>
    </g>
  );
}

/** Lucide wallet + opaque fill so the coin can drop behind the body */
export function DepositWalletFrame() {
  return (
    <>
      <path
        d="M4.35 7.85 H18.9 A0.9 0.9 0 0 1 19.8 8.75 V19.35 A1.65 1.65 0 0 1 18.15 21 H5.65 A1.65 1.65 0 0 1 4 19.35 V7.85 Z"
        fill="#0f172a"
        stroke="none"
      />
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  );
}

function DepositBotFrame({ className }: { className?: string }) {
  return (
    <g className={className}>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </g>
  );
}

export function DepositLogo({ className = '', size = 48, animate = true }: DepositLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 overflow-visible ${className}`}
      style={{ shapeRendering: 'geometricPrecision', overflow: 'visible' }}
      aria-label="deposit.now"
      role="img"
    >
      <CoinsIcon className={animate ? 'deposit-logo-coin' : 'deposit-logo-coin-static'} />

      <g transform={WALLET_BOT_CENTER}>
        <g className={animate ? 'deposit-logo-wallet' : undefined}>
          <DepositWalletFrame />
        </g>

        {animate && <DepositBotFrame className="deposit-logo-bot" />}
      </g>
    </svg>
  );
}