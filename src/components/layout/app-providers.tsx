"use client";

import { Suspense } from "react";
import { AppLoadingProvider } from "@/components/layout/app-loading";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AppLoadingProvider>{children}</AppLoadingProvider>
    </Suspense>
  );
}
