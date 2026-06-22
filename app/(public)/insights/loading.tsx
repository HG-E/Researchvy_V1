export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero header */}
      <div className="max-w-3xl mx-auto text-center py-16 px-4">
        <div className="h-3 w-24 rounded mx-auto mb-4" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-10 w-72 rounded mx-auto mb-4" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-5 w-96 rounded mx-auto mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-5 w-64 rounded mx-auto" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Article grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Featured article */}
        <div className="rounded-2xl border mb-8 overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="h-56 w-full" style={{ backgroundColor: "#1E293B" }} />
          <div className="p-8">
            <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-7 w-3/4 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-4 w-4/5 rounded mb-6" style={{ backgroundColor: "#1E293B" }} />
            <div className="flex gap-3">
              <div className="h-3 w-20 rounded" style={{ backgroundColor: "#1E293B" }} />
              <div className="h-3 w-16 rounded" style={{ backgroundColor: "#1E293B" }} />
            </div>
          </div>
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <div className="h-40 w-full" style={{ backgroundColor: "#1E293B" }} />
              <div className="p-5">
                <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-5 w-full rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-5 w-4/5 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
                <div className="h-3 w-24 rounded" style={{ backgroundColor: "#1E293B" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
