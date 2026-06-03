export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero skeleton */}
        <div className="h-4 w-24 rounded mb-6" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-10 w-3/4 rounded mb-4" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-6 w-1/2 rounded mb-8" style={{ backgroundColor: "#1E293B" }} />
        <div className="flex gap-4 mb-12">
          <div className="h-12 w-40 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-12 w-40 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-2xl" style={{ backgroundColor: "#0F172A" }} />
          ))}
        </div>
        {/* Content blocks */}
        {[1,2,3].map(i => (
          <div key={i} className="h-48 rounded-2xl mb-6" style={{ backgroundColor: "#0F172A" }} />
        ))}
      </div>
    </div>
  );
}
