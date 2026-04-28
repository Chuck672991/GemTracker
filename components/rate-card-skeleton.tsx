import { Skeleton } from '@/components/ui/skeleton';

export function MetalCardSkeleton() {
  return (
    <div className="rounded-xl border border-[--border] bg-[--surface] p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function CurrencyCardSkeleton() {
  return (
    <div className="rounded-xl border border-[--border] bg-[--surface] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
