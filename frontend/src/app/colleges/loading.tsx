import SkeletonCard from "@/components/SkeletonCard";

export default function CollegesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block lg:w-60 xl:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-40 mb-5 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
