function Row() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-t animate-pulse" style={{ borderColor: "#1E293B" }}>
      <div className="hidden sm:block h-5 w-24 rounded-full" style={{ backgroundColor: "#1E293B" }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>
      <div className="h-7 w-20 rounded-lg" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}

export default function Loading() {
  return (
    <div>
      <div className="mb-8 animate-pulse">
        <div className="h-3 w-12 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="flex items-center gap-3">
          <div className="h-8 w-44 rounded" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-6 w-20 rounded-full" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-4 w-56 rounded mt-1" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Opportunities section */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-4 animate-pulse">
          <div className="h-5 w-28 rounded" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-8 rounded-full" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          {Array.from({ length: 4 }).map((_, i) => <Row key={i} />)}
        </div>
      </div>

      {/* Events section */}
      <div>
        <div className="flex items-center gap-2.5 mb-4 animate-pulse">
          <div className="h-5 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-8 rounded-full" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          {Array.from({ length: 3 }).map((_, i) => <Row key={i} />)}
        </div>
      </div>
    </div>
  );
}
