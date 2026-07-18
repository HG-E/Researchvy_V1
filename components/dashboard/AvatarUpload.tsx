"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/common/UserAvatar";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export function AvatarUpload({
  name,
  email,
  avatarUrl,
}: {
  name?:      string | null;
  email?:     string | null;
  avatarUrl?: string | null;
}) {
  const [preview,  setPreview]  = useState<string | null>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [saved,    setSaved]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    setSaved(false);

    if (!f.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (f.size > MAX_BYTES)            { setError("Image must be 2 MB or smaller."); return; }

    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function handleSave() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res  = await fetch("/api/auth/avatar", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) { setError(json.error ?? "Upload failed."); return; }

      setSaved(true);
      setFile(null);
      setPreview(null);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayUrl = preview ?? avatarUrl;

  return (
    <div className="flex items-center gap-5">
      {/* Avatar with camera overlay */}
      <div className="relative group">
        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayUrl} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <UserAvatar name={name} email={email} avatarUrl={null} size="lg" className="w-20 h-20 rounded-2xl" />
          )}
        </div>

        {/* Camera overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-2xl flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          aria-label="Change profile photo"
        >
          <Camera className="h-6 w-6" style={{ color: "#fff" }} />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Text + actions */}
      <div>
        <p className="text-sm font-semibold mb-0.5" style={{ color: "#111827" }}>
          Profile Photo
        </p>
        <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
          JPG, PNG or WebP · max 2 MB
        </p>

        {file ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#2563EB" }}
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {loading ? "Saving…" : "Save photo"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ color: "#6B7280" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors hover:border-[#2563EB] hover:text-[#111827]"
            style={{ borderColor: "#CBD5E1", color: "#6B7280" }}
          >
            {avatarUrl ? "Change photo" : "Upload photo"}
          </button>
        )}

        {saved && (
          <p className="text-xs mt-2" style={{ color: "#10B981" }}>Photo saved.</p>
        )}
        {error && (
          <p className="text-xs mt-2" style={{ color: "#F87171" }}>{error}</p>
        )}
      </div>
    </div>
  );
}
