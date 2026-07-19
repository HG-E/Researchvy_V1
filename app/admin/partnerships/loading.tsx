function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-56 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-40 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-16 rounded-lg" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-44 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-60 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      <div className="grid grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-3 w-20 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-10 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        {Array.from({ length: 7 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
