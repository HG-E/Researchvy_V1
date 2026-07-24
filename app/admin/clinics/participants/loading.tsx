export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-xl" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-72 rounded-lg" style={{ backgroundColor: "#1E293B" }} />
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl" style={{ backgroundColor: "#1E293B" }} />
        ))}
      </div>
      <div className="h-64 rounded-2xl" style={{ backgroundColor: "#1E293B" }} />
    </div>
  );
}
