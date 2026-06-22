export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse" style={{ color: "#F9FAFB" }}>
      {/* Page header */}
      <div>
        <div className="h-8 w-48 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-4 w-20 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-16 rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-3 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border p-5 flex items-center gap-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-10 w-10 rounded-xl shrink-0" style={{ backgroundColor: "#1E293B" }} />
            <div className="flex-1">
              <div className="h-5 w-28 rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="p-4 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="h-5 w-36 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b" style={{ borderColor: "#1E293B" }}>
            <div className="h-8 w-8 rounded-full shrink-0" style={{ backgroundColor: "#1E293B" }} />
            <div className="flex-1">
              <div className="h-4 w-40 rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
            <div className="h-3 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
