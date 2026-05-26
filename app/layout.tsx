import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import "@/styles/animations.css";
import { siteConfig } from "@/config/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["600", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:  `${siteConfig.name}: ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "1024x1024" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "1024x1024" }],
    shortcut: "/icon.png",
  },
  keywords: [
    "research visibility",
    "scholarly visibility",
    "research intelligence",
    "bibliometrics",
    "discoverability",
    "research impact",
    "citation intelligence",
    "scholarly communication",
    "ORCID",
    "Scopus",
    "Google Scholar",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         siteConfig.url,
    siteName:    siteConfig.name,
    title:       `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.description,
    images:      [siteConfig.ogImage],
    creator:     siteConfig.twitterHandle,
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "_pFdwjPxz4lIfVwh8wREIb2CUCqfcpYSQ4KMOa9Tj9w",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A0F1A" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inject public env vars at request time so they work even if not baked at build time.
  // These are public keys — safe to expose to the browser.
  const runtimeEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${lora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {/* Runtime env injection — runs before the JS bundle, overrides baked-in build values */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__=${JSON.stringify(runtimeEnv)};`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <PostHogProvider>
          <ServiceWorkerRegistration />
          <InstallPrompt />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </PostHogProvider>
      </body>
    </html>
  );
}
