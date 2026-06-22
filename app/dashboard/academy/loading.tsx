export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Enrolled course cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="h-5 w-48 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
            <div className="h-6 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <div className="h-3 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-10 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: "#1E293B" }}>
              <div
                className="h-2 rounded-full"
                style={{ backgroundColor: "#2563EB", width: `${20 + i * 20}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="h-4 w-36 rounded" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-9 w-28 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
