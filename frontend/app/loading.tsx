export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="h-14 w-80 bg-gray-200 rounded mb-6" />
            <div className="h-6 w-48 bg-gray-200 rounded mb-8" />

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="h-[500px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
