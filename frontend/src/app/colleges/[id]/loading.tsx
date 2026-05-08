export default function CollegeDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-28 mb-6" />
      {/* Hero card */}
      <div className="rounded-xl overflow-hidden border border-gray-100 mb-6">
        <div className="h-64 bg-gray-200" />
        <div className="p-5 flex justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-lg" />
            <div className="h-9 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="h-12 bg-gray-100 rounded-xl mb-6" />
      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}
