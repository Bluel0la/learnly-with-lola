
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingStatsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 md:h-10 w-16 md:w-20 mx-auto mb-2" />
              <Skeleton className="h-3 md:h-4 w-20 md:w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
