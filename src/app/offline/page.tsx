import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Offline</p>
      <h1 className="display mt-2 text-3xl sm:text-4xl">You’re offline</h1>
      <p className="mt-3 text-muted">
        {SITE_NAME} needs a connection to refresh live feeds. Reconnect and try again.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-ink px-4 py-2 text-sm text-bg"
      >
        Back to home
      </Link>
    </div>
  );
}
