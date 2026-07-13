interface DepositLogoProps {
  className?: string;
  size?: number;
}

export const COINS_SCALE = 0.68;
export const COINS_TRANSLATE_X = 0.85;
export const COINS_TRANSLATE_Y_START = -2.75;

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

export function DepositLogo({ className = '', size = 48 }: DepositLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-2 -2 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      style={{ shapeRendering: 'geometricPrecision' }}
      aria-label="deposit.now"
      role="img"
    >
      <DepositCoinsPaths />
    </svg>
  );
}
