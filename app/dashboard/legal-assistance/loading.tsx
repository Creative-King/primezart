import { Skeleton } from "@/components/ui/skeleton"

export default function LegalAssistanceLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <Skeleton className="w-full h-48 rounded-xl mb-8" />

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <Skeleton className="h-8 w-48 mb-4 sm:mb-0" />
          <div className="flex items-center w-full sm:w-auto">
            <Skeleton className="h-10 w-64 mr-2" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex mb-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-32 mr-2 rounded-full" />
          ))}
        </div>

        <Skeleton className="w-full h-96 rounded-lg" />
      </div>

      <Skeleton className="w-full h-32 rounded-xl" />
    </div>
  )
}

