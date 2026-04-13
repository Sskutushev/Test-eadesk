import * as React from 'react';
import { cn } from '@/lib/utils';

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
};

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex rounded-full border bg-background p-1 shadow-sm',
        size === 'sm' && 'text-[11px]',
        size === 'md' && 'text-sm'
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full whitespace-nowrap transition-all',
            size === 'sm' && 'px-2 py-1',
            size === 'md' && 'px-3 py-1',
            value === option.value
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
