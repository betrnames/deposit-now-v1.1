import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Page titles with a terminal prompt prefix: >_
 */
export function TerminalTitle({
  children,
  as: Tag = 'h1',
  className,
  promptClassName,
}: {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  promptClassName?: string;
}) {
  return (
    <Tag className={cn('font-mono', className)}>
      <span
        className={cn('text-primary select-none mr-2 sm:mr-3', promptClassName)}
        aria-hidden="true"
      >
        &gt;_
      </span>
      {children}
    </Tag>
  );
}
