"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type LoadingContextValue = {
  pending: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue>({
  pending: false,
  startLoading: () => undefined,
  stopLoading: () => undefined,
});

export function useAppLoading() {
  return useContext(LoadingContext);
}

function isInternalHref(href: string | null) {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (/^https?:\/\//i.test(href)) return false;
  return href.startsWith("/");
}

export function AppLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  const stopLoading = useCallback(() => setPending(false), []);
  const startLoading = useCallback(() => setPending(true), []);

  useEffect(() => {
    setPending(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!isInternalHref(href)) return;
      const next = new URL(href!, window.location.origin);
      const current = new URL(window.location.href);
      if (next.pathname === current.pathname && next.search === current.search) {
        if (next.hash) return;
      }
      setPending(true);
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;
      const action = form.getAttribute("action") ?? window.location.pathname;
      if (isInternalHref(action) || action === "" || action.startsWith("?")) {
        setPending(true);
      }
    };

    document.addEventListener("click", onPointerDown, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onPointerDown, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  const value = useMemo(
    () => ({
      pending,
      startLoading,
      stopLoading,
    }),
    [pending, startLoading, stopLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {pending ? (
        <>
          <div
            className="progress-track fixed inset-x-0 top-0 z-40"
            role="status"
            aria-live="polite"
            aria-label="Loading"
          />
          <div className="pointer-events-none fixed inset-0 z-30 bg-bg/35 backdrop-blur-[1px]" />
        </>
      ) : null}
      <div className={cn("transition-opacity duration-200", pending && "pointer-events-none opacity-55")}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
