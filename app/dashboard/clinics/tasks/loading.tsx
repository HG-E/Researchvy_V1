export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded mb-2" style={{ backgroundColor: "#F1F5F9" }} />
      <div className="h-4 w-64 rounded mb-8" style={{ backgroundColor: "#F1F5F9" }} />
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <div className="h-5 w-32 rounded mb-4" style={{ backgroundColor: "#F1F5F9" }} />
          {[1,2,3].map(j => (
            <div key={j} className="h-12 rounded-xl mb-3" style={{ backgroundColor: "#F1F5F9" }} />
          ))}
        </div>
      ))}
    </div>
  );
}
