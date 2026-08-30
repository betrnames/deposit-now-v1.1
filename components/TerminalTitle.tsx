import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Page / section titles with a terminal prompt prefix: >_
 */
export function TerminalTitle({
  children,
  as: Tag = 'h1',
  className,
  promptClassName,
  hideOnMobile = false,
}: {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  promptClassName?: string;
  hideOnMobile?: boolean;
}) {
  return (
    <Tag className={cn('font-mono', className)}>
      <span
        className={cn(
          'text-primary select-none mr-2 sm:mr-3',
          hideOnMobile && 'hidden sm:inline',
          promptClassName,
        )}
        aria-hidden="true"
      >
        {'>_'}
      </span>
      {children}
    </Tag>
  );
}
