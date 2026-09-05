import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NavLink } from "@/components/layout/nav-link";

const links = [
  { href: "/", label: "Home" },
  { href: "/technology", label: "Technologies" },
  { href: "/categories", label: "Categories" },
  { href: "/companies", label: "Companies" },
  { href: "/events", label: "Events" },
  { href: "/trending", label: "Trending" },
  { href: "/weekly-digest", label: "Digest" },
  { href: "/search", label: "Search" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 sm:gap-6">
        <Link href="/" className="display shrink-0 text-xl tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center gap-4 text-sm text-muted lg:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex gap-3 overflow-x-auto border-t border-line px-4 py-2 text-xs text-muted [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            className="shrink-0 whitespace-nowrap"
          />
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line px-4 py-8 text-center text-xs text-muted sm:px-6">
      <div className="mx-auto max-w-6xl">
        {SITE_NAME} is a free technology intelligence platform. No paywalls.
      </div>
    </footer>
  );
}
