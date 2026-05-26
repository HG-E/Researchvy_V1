"use client";

import { useEffect } from "react";

export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/article-views", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
