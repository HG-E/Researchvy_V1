export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#EFF6FF" }} />
        <div className="h-8 w-40 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-64 rounded" style={{ backgroundColor: "#F1F5F9" }} />
      </div>
      {/* Clinic card */}
      <div className="rounded-2xl border p-8" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl" style={{ backgroundColor: "#EFF6FF" }} />
          <div className="h-7 w-28 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
        </div>
        <div className="h-5 w-48 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-80 rounded mb-6" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="rounded-xl border p-4 mb-5 space-y-3" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded" style={{ backgroundColor: "#F1F5F9" }} />
            <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border px-3 py-3" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
                <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
                <div className="h-4 w-20 rounded" style={{ backgroundColor: "#F1F5F9" }} />
              </div>
            ))}
          </div>
        </div>
        <div className="h-10 w-44 rounded-xl" style={{ backgroundColor: "#EFF6FF" }} />
      </div>
      {/* Private consulting card */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "#FAF5FF", borderColor: "#EDE9FE" }}>
        <div className="h-3 w-24 rounded mb-2" style={{ backgroundColor: "#F3E8FF" }} />
        <div className="h-5 w-56 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-full rounded mb-1" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-3/4 rounded mb-3" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-4 w-36 rounded" style={{ backgroundColor: "#F3E8FF" }} />
      </div>
    </div>
  );
}
