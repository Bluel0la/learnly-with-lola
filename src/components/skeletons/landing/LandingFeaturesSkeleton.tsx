
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingFeaturesSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-10 md:h-12 w-80 md:w-96 mx-auto mb-6" />
          <Skeleton className="h-5 md:h-6 w-full max-w-xs md:max-w-3xl mx-auto" />
        </div>
        
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
              <div className="text-center">
                <Skeleton className="h-16 md:h-20 w-16 md:w-20 rounded-2xl mx-auto mb-6" />
                <Skeleton className="h-6 md:h-7 w-32 md:w-40 mx-auto mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
