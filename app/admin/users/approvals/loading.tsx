import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function UserApprovalsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-28" />
                  </th>
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-20" />
                  </th>
                  <th className="text-left py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-24" />
                  </th>
                  <th className="text-right py-3 px-2 font-medium">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3 px-2">
                      <Skeleton className="h-6 w-16" />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-1">
                        <Skeleton className="h-6 w-10" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-14" />
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
