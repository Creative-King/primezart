import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* Portfolio Summary Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="flex items-end mb-4">
            <Skeleton className="h-8 w-40 mr-3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60 mb-4" />
          <Skeleton className="h-48 w-full rounded-full mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-3 w-3 rounded-full mr-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="bg-card border rounded-lg">
          <div className="p-4">
            <div className="flex border-b pb-2 mb-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1 mr-4" />
              ))}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex py-4 border-b">
                {[...Array(7)].map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1 mr-4" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

