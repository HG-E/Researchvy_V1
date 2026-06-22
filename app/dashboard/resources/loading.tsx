export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-8 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Featured resource card */}
      <div className="rounded-2xl border p-8" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="h-4 w-24 rounded mb-4" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-6 w-56 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-4/5 rounded mb-6" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-10 w-40 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-8 w-8 rounded-lg mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-5 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      {/* Insights section */}
      <div>
        <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: "#1E293B" }} />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl" style={{ backgroundColor: "#0F172A" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
