import {
  COINS_SCALE,
  COINS_TRANSLATE_X,
  COINS_TRANSLATE_Y_START,
  WALLET_BOT_SCALE,
} from '@/components/DepositLogo';

type SiteIconMarkProps = {
  size: number;
};

export function SiteIconMark({ size }: SiteIconMarkProps) {
  const radius = Math.round(size * 0.1875);
  const iconSize = Math.round(size * 0.625);
  const stroke = 'rgba(255, 255, 255, 0.75)';
  const walletBotCenter = `translate(12, 12) scale(${WALLET_BOT_SCALE}) translate(-12, -12)`;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        borderRadius: radius,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          transform={`translate(${COINS_TRANSLATE_X}, ${COINS_TRANSLATE_Y_START + 6.35}) scale(${COINS_SCALE})`}
        >
          <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
          <path d="M15 6h1v4" />
          <path d="m6.134 14.768.866-.5 2 3.464" />
          <circle cx="16" cy="8" r="6" />
        </g>

        <g transform={walletBotCenter}>
          <path
            d="M4.35 7.85 H18.9 A0.9 0.9 0 0 1 19.8 8.75 V19.35 A1.65 1.65 0 0 1 18.15 21 H5.65 A1.65 1.65 0 0 1 4 19.35 V7.85 Z"
            fill="#0f172a"
            stroke="none"
          />
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </g>
      </svg>
    </div>
  );
}