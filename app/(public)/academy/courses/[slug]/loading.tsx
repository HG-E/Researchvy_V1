export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-4 w-32 rounded mb-6" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-10 w-3/4 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-5 w-full rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-5 w-2/3 rounded mb-8" style={{ backgroundColor: "#1E293B" }} />
        <div className="flex gap-4 mb-10">
          <div className="h-12 w-40 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
          <div className="h-12 w-32 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="h-20 rounded-2xl mb-4" style={{ backgroundColor: "#0F172A" }} />
        ))}
      </div>
    </div>
  );
}
