import { Source_Sans_3, Newsreader } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header, Footer } from "@/components/layout/header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppProviders } from "@/components/layout/app-providers";
import { DefaultPageSkeleton } from "@/components/layout/loading-ui";
import { defaultMetadata } from "@/lib/seo";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-geist" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata = defaultMetadata();
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${newsreader.variable} overflow-x-clip antialiased`}>
        <ThemeProvider>
          <AppProviders>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              <Suspense fallback={<DefaultPageSkeleton />}>{children}</Suspense>
            </main>
            <Footer />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
