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
        "animate-pulse bg-muted rounded-md",
        variant === 'circle' && "rounded-full",
        variant === 'text' && "h-4 w-full",
        className
      )}
    />
  );
}
