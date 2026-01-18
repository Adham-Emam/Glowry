'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="group block rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <Skeleton className="h-56 w-full" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Price row */}
        <div className="pt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  )
}
