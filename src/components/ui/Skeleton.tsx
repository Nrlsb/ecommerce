'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export default function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer-overlay bg-slate-200/80 dark:bg-slate-850 rounded-md",
        variant === 'circle' && "rounded-full",
        variant === 'text' && "h-4 w-full",
        className
      )}
    />
  );
}
