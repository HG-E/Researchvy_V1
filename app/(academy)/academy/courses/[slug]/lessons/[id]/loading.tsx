export default function Loading() {
  return (
    <div className="animate-pulse min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="flex h-screen">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col w-72 border-r flex-shrink-0 p-4 gap-3" style={{ borderColor: "#E2E8F0", backgroundColor: "#F8FAFC" }}>
          <div className="h-4 w-3/4 rounded mb-4" style={{ backgroundColor: "#F1F5F9" }} />
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-10 rounded-lg" style={{ backgroundColor: "#F1F5F9", opacity: 1 - i * 0.1 }} />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {/* Breadcrumb */}
          <div className="h-4 w-48 rounded mb-6" style={{ backgroundColor: "#F1F5F9" }} />

          {/* Title */}
          <div className="h-8 w-2/3 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-4 w-1/3 rounded mb-8" style={{ backgroundColor: "#F1F5F9" }} />

          {/* Video placeholder */}
          <div className="w-full rounded-2xl mb-8" style={{ aspectRatio: "16/9", backgroundColor: "#FFFFFF" }}>
            <div className="w-full h-full rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
            </div>
          </div>

          {/* Content lines */}
          {[100, 90, 95, 70, 85, 75].map((w, i) => (
            <div key={i} className="h-4 rounded mb-3" style={{ backgroundColor: "#F1F5F9", width: `${w}%` }} />
          ))}

          {/* Action buttons */}
          <div className="flex gap-3 mt-10">
            <div className="h-11 w-36 rounded-xl" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-11 w-44 rounded-xl" style={{ backgroundColor: "#F1F5F9" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
