import { Skeleton } from "@/components/ui/skeleton"

export default function JointAccountLoading() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-white h-full flex flex-col border-r border-gray-200 fixed lg:relative z-30">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Skeleton */}
        <header className="bg-white border-b border-gray-200 py-3 px-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content Area Skeleton */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96 mb-6" />

          {/* Account Overview Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-10 w-40 mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>

          {/* Recent Transactions and Spending Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
