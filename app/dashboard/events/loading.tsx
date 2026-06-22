export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-60 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-9 w-32 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Registered events */}
      <div>
        <div className="h-5 w-40 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border p-5 flex gap-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <div className="h-12 w-12 rounded-xl shrink-0" style={{ backgroundColor: "#1E293B" }} />
              <div className="flex-1">
                <div className="h-5 w-48 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-4 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-3 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved events */}
      <div>
        <div className="h-5 w-32 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border p-5 flex gap-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <div className="h-12 w-12 rounded-xl shrink-0" style={{ backgroundColor: "#1E293B" }} />
              <div className="flex-1">
                <div className="h-5 w-52 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-4 w-28 rounded" style={{ backgroundColor: "#1E293B" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
