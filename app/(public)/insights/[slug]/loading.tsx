export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3 w-16 rounded" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-3 w-2 rounded" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-3 w-32 rounded" style={{ backgroundColor: "#F1F5F9" }} />
      </div>

      {/* Article header */}
      <div className="mb-8">
        <div className="h-4 w-24 rounded mb-4" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-10 w-full rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="h-10 w-4/5 rounded mb-6" style={{ backgroundColor: "#F1F5F9" }} />
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-4 w-32 rounded" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-3 w-20 rounded" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-3 w-16 rounded" style={{ backgroundColor: "#F1F5F9" }} />
        </div>
      </div>

      {/* Hero image */}
      <div className="h-64 w-full rounded-2xl mb-8" style={{ backgroundColor: "#FFFFFF" }} />

      {/* Article body */}
      <div className="space-y-4">
        {[100, 90, 100, 75, 100, 85, 100, 60, 95, 80, 100, 70].map((w, i) => (
          <div key={i} className="h-4 rounded" style={{ backgroundColor: "#F1F5F9", width: `${w}%` }} />
        ))}
        <div className="h-8" />
        {[100, 88, 100, 72, 95, 100, 65].map((w, i) => (
          <div key={i + 20} className="h-4 rounded" style={{ backgroundColor: "#F1F5F9", width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
