
import { Skeleton } from "@/components/ui/skeleton";

export default function QuizzesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-8" />
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-xl p-6 text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Quiz mode tabs */}
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1 max-w-md">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
        
        {/* Quiz selector content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border rounded-xl p-6">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
              <Skeleton className="h-12 w-full rounded-md bg-blue-100" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-12">
        <div className="xl:col-span-1">
          <div className="border rounded-xl p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-full rounded mt-4" />
            </div>
          </div>
        </div>
        <div className="xl:col-span-3">
          <div className="border rounded-xl p-6">
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
