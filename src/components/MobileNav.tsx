"use client";

import { useState } from "react";
import Link from "next/link";

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

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-pcv-burgundy hover:bg-pcv-cream"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-black/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-pcv-cream-dark bg-white px-4 py-4 shadow-lg">
            <form action="/search" className="mb-4">
              <input
                type="search"
                name="q"
                placeholder="Search..."
                className="input-field w-full"
              />
            </form>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-pcv-cream hover:text-pcv-burgundy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/staff"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 block text-center"
            >
              Staff Login
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
