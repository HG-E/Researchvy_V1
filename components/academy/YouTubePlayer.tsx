"use client";

import { useEffect, useRef } from "react";

// ── YouTube IFrame API types ──────────────────────────────────────────────────

type YTPlayerInstance = {
  seekTo:         (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration:    () => number;
  getPlayerState: () => number;
  destroy:        () => void;
};

type YTPlayerOptions = {
  videoId:     string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?:       (e: { target: YTPlayerInstance }) => void;
    onStateChange?: (e: { data: number; target: YTPlayerInstance }) => void;
  };
};

declare global {
  interface Window {
    YT?: {
      Player:      new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayerInstance;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
    _ytCallbacks?: Array<() => void>;
  }
}

// ── Singleton script loader ───────────────────────────────────────────────────

function loadYTApi(cb: () => void) {
  if (typeof window === "undefined") return;
  if (window.YT?.Player) { cb(); return; }

  if (!window._ytCallbacks) window._ytCallbacks = [];
  window._ytCallbacks.push(cb);

  if (!document.getElementById("yt-iframe-api")) {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      window._ytCallbacks?.forEach((fn) => fn());
      window._ytCallbacks = [];
    };
    const tag = document.createElement("script");
    tag.id  = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const HEARTBEAT_MS = 30_000;

interface YouTubePlayerProps {
  videoId:        string;
  title:          string;
  lessonId:       string;
  initialSeconds: number;
}

export function YouTubePlayer({ videoId, title, lessonId, initialSeconds }: YouTubePlayerProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const playerRef     = useRef<YTPlayerInstance | null>(null);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep refs in sync without causing re-renders
  const lessonIdRef   = useRef(lessonId);
  const initialSecRef = useRef(initialSeconds);
  useEffect(() => { lessonIdRef.current   = lessonId;       }, [lessonId]);
  useEffect(() => { initialSecRef.current = initialSeconds; }, [initialSeconds]);

  function stopHeartbeat() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function sendProgress() {
    const p = playerRef.current;
    if (!p) return;
    const seconds  = Math.floor(p.getCurrentTime());
    const duration = p.getDuration();
    const pct      = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : 0;
    fetch("/api/academy/progress", {
      method:    "POST",
      headers:   { "Content-Type": "application/json" },
      body:      JSON.stringify({ lesson_id: lessonIdRef.current, seconds, watch_percent: pct }),
      keepalive: true,
    }).catch(() => {});
  }

  function startHeartbeat() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(sendProgress, HEARTBEAT_MS);
  }

  useEffect(() => {
    loadYTApi(() => {
      if (!containerRef.current || !window.YT?.Player) return;

      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel:            0,
          modestbranding: 1,
          color:          "white",
          // Resume from last watched position (0 means start from beginning)
          start: Math.max(0, Math.floor(initialSecRef.current)),
        },
        events: {
          onReady: ({ target }) => {
            playerRef.current = target;
          },
          onStateChange: ({ data }) => {
            const PLAYING = window.YT?.PlayerState.PLAYING ?? 1;
            if (data === PLAYING) {
              startHeartbeat();
            } else {
              stopHeartbeat();
              sendProgress(); // flush current position on pause/end
            }
          },
        },
      });

      playerRef.current = player;
    });

    return () => {
      stopHeartbeat();
      if (playerRef.current) {
        sendProgress(); // final flush on unmount
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // Only re-run when the actual video changes, not on every prop update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
      <div ref={containerRef} className="w-full h-full" aria-label={title} />
    </div>
  );
}
