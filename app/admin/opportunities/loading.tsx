function Row() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="h-4 flex-1 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-16 rounded-lg" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 w-40 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-56 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-10 w-36 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-3 border-b flex gap-2 animate-pulse" style={{ borderColor: "#1E293B" }}>
          {[1, 2, 3].map((i) => <div key={i} className="h-8 w-20 rounded-lg" style={{ backgroundColor: "#1E293B" }} />)}
        </div>
        {Array.from({ length: 8 }).map((_, i) => <Row key={i} />)}
      </div>
    </div>
  );
}
