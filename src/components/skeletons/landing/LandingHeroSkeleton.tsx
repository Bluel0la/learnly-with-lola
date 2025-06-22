
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingHeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Headlines */}
          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-80 sm:w-96 lg:w-[500px] mx-auto" />
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-64 sm:w-80 lg:w-96 mx-auto" />
          </div>
          
          {/* Hero Description */}
          <div className="space-y-3 mb-10">
            <Skeleton className="h-5 sm:h-6 w-full max-w-xs sm:max-w-md lg:max-w-3xl mx-auto" />
            <Skeleton className="h-5 sm:h-6 w-full max-w-xs sm:max-w-md lg:max-w-2xl mx-auto" />
          </div>
          
          {/* CTA Button and Badge */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Skeleton className="h-12 sm:h-14 w-48 sm:w-56 rounded-lg" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32 sm:w-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
