import * as React from 'react';
import { cn } from '@/lib/utils';

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
};

export function Tooltip({ label, children, align = 'center' }: TooltipProps) {
  return (
    <span className="relative inline-flex">
      <span className="group inline-flex items-center">
        {children}
        <span
          className={cn(
            'pointer-events-none absolute top-full z-20 mt-2 w-64 rounded-md border bg-card/95 p-3 text-xs text-foreground shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100',
            align === 'left' && 'left-0',
            align === 'right' && 'right-0',
            align === 'center' && 'left-1/2 -translate-x-1/2'
          )}
        >
          {label}
        </span>
      </span>
    </span>
  );
}
