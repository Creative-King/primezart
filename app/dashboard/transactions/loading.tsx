import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TransactionsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-32 mr-2" />
        <Skeleton className="h-8 w-64" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-10 w-[300px]" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
              <Skeleton className="h-10 w-[130px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="rounded-md border">
              <div className="border-b bg-muted/50 py-3 px-4">
                <div className="grid grid-cols-5 gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>

              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="border-b py-3 px-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-64" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
