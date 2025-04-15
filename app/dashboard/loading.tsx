import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-gray-200">
        <div className="text-center mb-6">
          <Skeleton className="h-4 w-32 mx-auto mb-2" />
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-14 rounded-md" />
          <Skeleton className="h-14 rounded-md" />
          <Skeleton className="h-14 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 rounded-xl mb-6" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div>
          <Skeleton className="h-48 rounded-xl mb-6" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
