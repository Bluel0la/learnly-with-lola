
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="w-full max-w-md">
        {/* Welcome header */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-48 mx-auto" />
        </div>

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          {/* Card header */}
          <div className="text-center pb-4 px-8 pt-8">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>
          
          {/* Card content */}
          <div className="px-8 pb-8">
            {/* Tabs */}
            <div className="mb-6">
              <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded">
                <Skeleton className="h-10 rounded-lg" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
            </div>
            
            {/* Form fields */}
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Email field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
                
                {/* Password field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>
              
              {/* Submit button */}
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
