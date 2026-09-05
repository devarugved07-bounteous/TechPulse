"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { cn } from "@/lib/utils";

function PendingDot() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "ml-1 inline-block h-1 w-1 rounded-full bg-accent transition-opacity",
        pending ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

export function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center hover:text-ink", className)}>
      {label}
      <PendingDot />
    </Link>
  );
}
