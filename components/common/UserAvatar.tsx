import Image from "next/image";

const SIZE_MAP = {
  xs: { px: 24, cls: "w-6 h-6 text-[10px]" },
  sm: { px: 28, cls: "w-7 h-7 text-xs" },
  md: { px: 36, cls: "w-9 h-9 text-sm" },
  lg: { px: 64, cls: "w-16 h-16 text-xl" },
};

export function UserAvatar({
  name,
  email,
  avatarUrl,
  size = "md",
  className = "",
}: {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    ? name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : (email?.split("@")[0]?.[0]?.toUpperCase() ?? "R");

  const { px, cls } = SIZE_MAP[size];
  const combined = `${cls} rounded-full flex-shrink-0 ${className}`.trim();

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name ?? "User avatar"}
        width={px}
        height={px}
        className={`${combined} object-cover`}
        unoptimized={avatarUrl.includes("?v=")}
      />
    );
  }

  return (
    <div
      className={`${combined} flex items-center justify-center font-bold`}
      style={{ backgroundColor: "#2563EB", color: "#fff" }}
      aria-label={name ?? email ?? "User"}
    >
      {initials}
    </div>
  );
}
