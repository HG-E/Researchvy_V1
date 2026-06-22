export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-8 w-52 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-9 w-32 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 rounded-full" style={{ backgroundColor: "#1E293B" }} />
        ))}
      </div>

      {/* Opportunity cards */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-4 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
          <div className="h-6 w-3/4 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-5/6 rounded mb-4" style={{ backgroundColor: "#1E293B" }} />
          <div className="flex gap-4">
            <div className="h-3 w-28 rounded" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-3 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
