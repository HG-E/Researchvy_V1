function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="h-4 w-36 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-44 rounded flex-1" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-12 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-40 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-12 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        {Array.from({ length: 8 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
