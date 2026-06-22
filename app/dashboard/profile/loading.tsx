export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-3 w-20 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-8 w-36 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-4 w-60 rounded" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* Avatar upload area */}
      <div className="rounded-2xl border p-6 flex items-center gap-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="h-20 w-20 rounded-full shrink-0" style={{ backgroundColor: "#1E293B" }} />
        <div>
          <div className="h-5 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="h-5 w-36 rounded" style={{ backgroundColor: "#1E293B" }} />
        {/* Form fields */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-3 w-24 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-10 w-full rounded-xl" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
        {/* Bio textarea */}
        <div>
          <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-24 w-full rounded-xl" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-10 w-32 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      {/* ORCID section */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="h-5 w-40 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-10 w-48 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>
    </div>
  );
}
