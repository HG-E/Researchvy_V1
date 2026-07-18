export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-8 w-44 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-60 rounded" style={{ backgroundColor: "#F1F5F9" }} />
      </div>

      {/* Certificate cards */}
      {[1, 2].map((i) => (
        <div key={i} className="rounded-2xl border p-8" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          {/* Certificate header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
            <div>
              <div className="h-4 w-32 rounded mb-1" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="h-3 w-24 rounded" style={{ backgroundColor: "#F1F5F9" }} />
            </div>
          </div>

          {/* Certificate body */}
          <div className="border rounded-xl p-6 mb-6" style={{ borderColor: "#E2E8F0" }}>
            <div className="h-3 w-40 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-6 w-56 rounded mx-auto mb-2" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-4 w-48 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-8 w-72 rounded-lg mx-auto mb-2" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-3 w-32 rounded mx-auto" style={{ backgroundColor: "#F1F5F9" }} />
          </div>

          {/* Share buttons */}
          <div className="flex gap-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-9 w-24 rounded-xl" style={{ backgroundColor: "#F1F5F9" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
