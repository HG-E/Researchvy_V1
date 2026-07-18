export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center py-16 px-4">
        <div className="h-3 w-20 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-10 w-48 rounded mx-auto mb-4" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-5 w-80 rounded mx-auto" style={{ backgroundColor: "#F1F5F9" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Filter bar */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
          ))}
        </div>

        {/* Event list */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-2xl border p-6 flex gap-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
              {/* Date block */}
              <div className="h-16 w-16 rounded-xl shrink-0 flex flex-col items-center justify-center" style={{ backgroundColor: "#F1F5F9" }}>
                <div className="h-5 w-8 rounded mb-1" style={{ backgroundColor: "#FFFFFF" }} />
                <div className="h-3 w-6 rounded" style={{ backgroundColor: "#FFFFFF" }} />
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-24 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
                  <div className="h-4 w-16 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
                </div>
                <div className="h-5 w-3/4 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
                <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: "#F1F5F9" }} />
                <div className="h-4 w-4/5 rounded mb-3" style={{ backgroundColor: "#F1F5F9" }} />
                <div className="flex gap-4">
                  <div className="h-3 w-24 rounded" style={{ backgroundColor: "#F1F5F9" }} />
                  <div className="h-3 w-20 rounded" style={{ backgroundColor: "#F1F5F9" }} />
                </div>
              </div>
              <div className="h-9 w-24 rounded-xl shrink-0 self-center" style={{ backgroundColor: "#F1F5F9" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
