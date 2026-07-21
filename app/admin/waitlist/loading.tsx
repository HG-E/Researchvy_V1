export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-20 rounded mb-3" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-8 w-52 rounded mb-2" style={{ backgroundColor: "#1E293B" }} />
      <div className="h-4 w-64 rounded mb-8" style={{ backgroundColor: "#0F172A" }} />
      <div className="h-[360px] rounded-2xl" style={{ backgroundColor: "#0F172A" }} />
    </div>
  );
}
