export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center py-16 px-4">
        <div className="h-3 w-28 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-10 w-64 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-5 w-80 rounded mx-auto mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-5 w-56 rounded mx-auto" style={{ backgroundColor: "#F1F5F9" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Category filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-28 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
          ))}
        </div>

        {/* Opportunity cards */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded" style={{ backgroundColor: "#F1F5F9" }} />
                  <div className="h-5 w-24 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
                </div>
                <div className="h-4 w-20 rounded" style={{ backgroundColor: "#F1F5F9" }} />
              </div>
              <div className="h-6 w-3/4 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="h-4 w-5/6 rounded mb-4" style={{ backgroundColor: "#F1F5F9" }} />
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="h-3 w-28 rounded" style={{ backgroundColor: "#F1F5F9" }} />
                  <div className="h-3 w-20 rounded" style={{ backgroundColor: "#F1F5F9" }} />
                </div>
                <div className="h-9 w-28 rounded-xl" style={{ backgroundColor: "#F1F5F9" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
