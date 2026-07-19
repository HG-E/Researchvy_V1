export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-4 w-4 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
            <div className="h-9 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="rounded-2xl border p-6 animate-pulse" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="h-5 w-40 rounded mb-6" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-52 w-full rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden animate-pulse" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="h-4 w-32 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3 border-b" style={{ borderColor: "#1E293B" }}>
            <div className="h-3 flex-1 rounded" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-3 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-3 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
