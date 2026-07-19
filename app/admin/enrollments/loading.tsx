function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-3.5 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: "#1E293B" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-44 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-32 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-52 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-12 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-3 border-b flex gap-2 animate-pulse" style={{ borderColor: "#1E293B" }}>
          {[1, 2, 3].map((i) => <div key={i} className="h-8 w-24 rounded-lg" style={{ backgroundColor: "#1E293B" }} />)}
        </div>
        {Array.from({ length: 9 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
