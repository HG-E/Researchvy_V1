"use client";

import { useState } from "react";
import { Link2, Twitter, Linkedin, Check } from "lucide-react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const btnStyle = {
    base: "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 border",
    default: { backgroundColor: "#1E293B", borderColor: "#334155", color: "#9CA3AF" },
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold tracking-widest uppercase mr-1" style={{ color: "#4B5563" }}>
        Share
      </span>

      <button
        onClick={copyLink}
        className={btnStyle.base}
        style={copied
          ? { backgroundColor: "rgba(16,185,129,0.1)", borderColor: "#10B981", color: "#10B981" }
          : btnStyle.default}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnStyle.base}
        style={btnStyle.default}
      >
        <Twitter className="h-3.5 w-3.5" />
        Twitter
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btnStyle.base}
        style={btnStyle.default}
      >
        <Linkedin className="h-3.5 w-3.5" />
        LinkedIn
      </a>
    </div>
  );
}
