function CourseCard() {
  return (
    <div className="rounded-2xl border p-5 animate-pulse" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
      <div className="h-4 w-3/4 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-3 w-full rounded mb-1" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-3 w-2/3 rounded mb-5" style={{ backgroundColor: "#1E293B" }} />
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-8 w-20 rounded-lg" style={{ backgroundColor: "#1E293B" }} />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-pulse">
        <div>
          <div className="h-8 w-32 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-4 w-48 rounded" style={{ backgroundColor: "#1E293B" }} />
        </div>
        <div className="h-10 w-32 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <div className="h-3 w-24 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
            <div className="h-8 w-12 rounded" style={{ backgroundColor: "#1E293B" }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <CourseCard key={i} />)}
      </div>
    </div>
  );
}
