import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
  { href: "/programs", label: "Church Programs" },
  { href: "/what-we-believe", label: "What We Believe" },
  { href: "/news", label: "News" },
  { href: "/reports", label: "Reports" },
  { href: "/churches", label: "Churches" },
  { href: "/pastors", label: "Pastors" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-pcv-cream-dark bg-white shadow-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:py-3">
        <Logo size="sm" className="min-w-0 shrink" />

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-pcv-cream hover:text-pcv-burgundy xl:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form action="/search" className="hidden md:block">
            <input
              type="search"
              name="q"
              placeholder="Search..."
              className="w-28 rounded-full border border-pcv-cream-dark px-3 py-1.5 text-sm outline-none focus:border-pcv-burgundy lg:w-40 xl:w-48"
            />
          </form>
          <Link
            href="/staff"
            className="btn-primary hidden whitespace-nowrap text-xs sm:inline-flex sm:text-sm"
          >
            Staff Login
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
