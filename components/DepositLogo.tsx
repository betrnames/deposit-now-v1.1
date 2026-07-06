import { Bot } from 'lucide-react';

interface DepositLogoProps {
  className?: string;
  size?: number;
}

export function DepositLogo({ className = '', size = 48 }: DepositLogoProps) {
  return (
    <Bot
      size={size}
      strokeWidth={2}
      absoluteStrokeWidth
      className={`shrink-0 text-white/75 ${className}`}
      style={{ shapeRendering: 'geometricPrecision' }}
      aria-label="deposit.now"
      role="img"
    />
  );
}