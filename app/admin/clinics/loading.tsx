export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-56 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-12 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-5 w-40 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="space-y-2">
              <div className="h-3 w-full rounded" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-4/5 rounded" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-3/5 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
