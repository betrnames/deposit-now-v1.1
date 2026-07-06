import { Bot } from 'lucide-react';

interface DepositLogoProps {
  className?: string;
  size?: number;
}

export function DepositLogo({ className = '', size = 48 }: DepositLogoProps) {
  return (
    <Bot
      size={size}
      strokeWidth={1.75}
      className={`shrink-0 text-white/55 ${className}`}
      aria-label="deposit.now"
      role="img"
    />
  );
}