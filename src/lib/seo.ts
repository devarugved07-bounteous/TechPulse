import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

export function defaultMetadata(): Metadata {
  const url = siteUrl();
  return {
    metadataBase: new URL(url),
    applicationName: SITE_NAME,
    title: {
      default: `${SITE_NAME} — Technology Intelligence`,
      template: `%s · ${SITE_NAME}`,
    },
    description: SITE_TAGLINE,
    openGraph: {
      title: SITE_NAME,
      description: SITE_TAGLINE,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export function defaultViewport(): Viewport {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#0d9488" },
      { media: "(prefers-color-scheme: dark)", color: "#0d9488" },
    ],
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}
