
import { Skeleton } from "@/components/ui/skeleton";

export default function IndexPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Skeleton */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-8 w-20" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
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

      {/* Stats Section Skeleton */}
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

      {/* Features Section Skeleton */}
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
                  {/* Feature Icon */}
                  <Skeleton className="h-16 md:h-20 w-16 md:w-20 rounded-2xl mx-auto mb-6" />
                  {/* Feature Title */}
                  <Skeleton className="h-6 md:h-7 w-32 md:w-40 mx-auto mb-4" />
                  {/* Feature Description */}
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

      {/* Testimonials Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Skeleton className="h-10 md:h-12 w-72 md:w-80 mx-auto mb-6" />
            <Skeleton className="h-5 md:h-6 w-64 md:w-96 mx-auto" />
          </div>
          
          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 mr-1 rounded" />
                  ))}
                </div>
                
                {/* Quote Icon */}
                <Skeleton className="h-6 w-6 mb-4" />
                
                {/* Testimonial Content */}
                <div className="space-y-2 mb-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                
                {/* Author Info */}
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 md:h-12 w-80 md:w-96 mx-auto mb-6 bg-white/20" />
          <div className="space-y-3 mb-10">
            <Skeleton className="h-5 md:h-6 w-full max-w-md md:max-w-xl mx-auto bg-white/20" />
            <Skeleton className="h-5 md:h-6 w-full max-w-sm md:max-w-lg mx-auto bg-white/20" />
          </div>
          <Skeleton className="h-12 md:h-14 w-48 md:w-56 mx-auto rounded-lg bg-white/20 mb-4" />
          <div className="flex items-center justify-center space-x-2">
            <Skeleton className="h-4 w-4 bg-white/20 rounded-full" />
            <Skeleton className="h-4 w-64 md:w-80 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-8 w-8 rounded-lg bg-gray-700" />
                <Skeleton className="h-6 w-20 bg-gray-700" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-4/5 bg-gray-700" />
                <Skeleton className="h-4 w-3/5 bg-gray-700" />
              </div>
            </div>
            
            {/* Footer Links Columns */}
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-16 mb-4 bg-gray-700" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-12 bg-gray-700" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <Skeleton className="h-4 w-48 mx-auto bg-gray-700" />
          </div>
        </div>
      </footer>
    </div>
  );
}
