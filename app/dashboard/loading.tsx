export default function Loading() {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-4 py-12" style={{ color: "transparent" }}>
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-full" style={{ backgroundColor: "#F1F5F9" }} />
        <div>
          <div className="h-6 w-40 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
          <div className="h-4 w-28 rounded"    style={{ backgroundColor: "#F1F5F9" }} />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1,2,3].map(i => (
          <div key={i} className="h-28 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }} />
        ))}
      </div>
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-20 rounded-2xl" style={{ backgroundColor: "#FFFFFF" }} />
        ))}
      </div>
    </div>
  );
}
