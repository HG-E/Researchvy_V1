function ArticleRow() {
  return (
    <div className="flex items-start gap-4 px-6 py-4 border-b animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="w-16 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: "#1E293B" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-10 w-40 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="px-6 py-3 border-b flex gap-2 animate-pulse" style={{ borderColor: "#1E293B" }}>
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 w-24 rounded-lg" style={{ backgroundColor: "#1E293B" }} />)}
        </div>
        {Array.from({ length: 9 }).map((_, i) => <ArticleRow key={i} />)}
      </div>
    </div>
  );
}
