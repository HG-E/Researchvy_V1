function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-8 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-60 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-28 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        {Array.from({ length: 8 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
