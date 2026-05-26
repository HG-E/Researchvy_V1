import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
  async redirects() {
    return [
      {
        source: "/pricing",
        destination: "/clinics#pricing",
        permanent: false,
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js hydration + YouTube IFrame API script require unsafe-inline
      "script-src 'self' 'unsafe-inline' https://app.posthog.com https://eu.posthog.com https://www.youtube.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://images.unsplash.com https://i.ytimg.com",
      // YouTube IFrame API creates youtube.com embeds; nocookie kept for direct <iframe> fallbacks + Bunny
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://iframe.mediadelivery.net",
      // Supabase realtime uses WSS; PostHog for analytics; YouTube IFrame API calls googleapis
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://app.posthog.com https://eu.posthog.com https://www.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
          // 2-year HSTS with subdomains — only set once you've confirmed HTTPS everywhere
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
