function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="h-4 w-28 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-40 rounded flex-1" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-6 w-24 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-56 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-3 border-b flex gap-4" style={{ borderColor: "#1E293B" }}>
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 w-20 rounded animate-pulse" style={{ backgroundColor: "#1E293B" }} />)}
        </div>
        {Array.from({ length: 8 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
