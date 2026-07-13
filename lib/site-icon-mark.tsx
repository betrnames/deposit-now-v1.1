type SiteIconMarkProps = {
  size: number;
};

export function SiteIconMark({ size }: SiteIconMarkProps) {
  const radius = Math.round(size * 0.1875);
  const iconSize = Math.round(size * 0.625);
  const stroke = 'rgba(255, 255, 255, 0.75)';

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
        viewBox="-2 -2 28 28"
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
        <path d="M15 6h1v4" />
        <path d="m6.134 14.768.866-.5 2 3.464" />
        <circle cx="16" cy="8" r="6" />
      </svg>
    </div>
  );
}
