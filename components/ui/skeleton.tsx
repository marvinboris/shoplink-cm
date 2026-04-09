'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-xl', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface p-3 shadow-warm">
      <Skeleton className="aspect-square w-full rounded-2xl mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface p-4 shadow-warm">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface p-5 shadow-warm">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
