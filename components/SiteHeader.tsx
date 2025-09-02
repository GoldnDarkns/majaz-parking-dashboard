"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-black text-white"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-tight flex items-center gap-2"
        >
          <span className="text-xl">🅿️</span>
          <span>Majaz Parking</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/parking">Parking Insights</NavLink>
        </nav>
      </div>
    </header>
  );
}
