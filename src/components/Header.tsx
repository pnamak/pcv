import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
  { href: "/programs", label: "Church Programs" },
  { href: "/news", label: "News" },
  { href: "/churches", label: "Churches" },
  { href: "/pastors", label: "Pastors" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-pcv-cream-dark bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pcv-burgundy text-sm font-bold text-white">
            PCV
          </div>
          <span className="hidden text-sm font-semibold text-pcv-burgundy sm:block">
            Presbyterian Church of Vanuatu
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-pcv-cream hover:text-pcv-burgundy"
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
              className="w-36 rounded-full border border-pcv-cream-dark px-4 py-1.5 text-sm outline-none focus:border-pcv-burgundy lg:w-48"
            />
          </form>
          <Link href="/staff" className="btn-primary whitespace-nowrap text-xs sm:text-sm">
            Staff Login
          </Link>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-pcv-cream-dark px-4 py-2 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-pcv-cream"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
