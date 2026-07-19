function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-3.5 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: "#1E293B" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-40 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-56 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-8 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-28 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-3 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
          <div className="h-9 w-72 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
        </div>
        {Array.from({ length: 10 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
