export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-8 w-44 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-4 w-56 rounded" style={{ backgroundColor: "#F1F5F9" }} />
        </div>
        <div className="h-9 w-28 rounded-xl" style={{ backgroundColor: "#F1F5F9" }} />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-20 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
        ))}
      </div>

      {/* Notification rows */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 border-b"
            style={{ borderColor: "#E2E8F0" }}
          >
            <div className="h-8 w-8 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-48 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="h-3 w-full rounded mb-1" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="h-3 w-2/3 rounded" style={{ backgroundColor: "#F1F5F9" }} />
            </div>
            <div className="h-3 w-16 rounded shrink-0" style={{ backgroundColor: "#F1F5F9" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
