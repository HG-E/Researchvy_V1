export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="h-4 w-20 rounded mb-4 mx-auto" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-12 w-2/3 rounded mb-4 mx-auto" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-6 w-1/2 rounded mb-12 mx-auto" style={{ backgroundColor: "#1E293B" }} />
        <div className="h-64 rounded-3xl mb-8" style={{ backgroundColor: "#0F172A" }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 rounded-2xl" style={{ backgroundColor: "#0F172A" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
