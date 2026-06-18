"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { staffLogoutAction } from "@/lib/actions";

const staffLinks = [
  { href: "/staff/dashboard", label: "Dashboard" },
  { href: "/staff/churches", label: "Churches" },
  { href: "/staff/pastors", label: "Pastors" },
  { href: "/staff/reports", label: "Reports" },
  { href: "/staff/news", label: "News" },
  { href: "/staff/events", label: "Events" },
];

interface StaffNavProps {
  userName?: string;
}

export function StaffNav({ userName }: StaffNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="border-b border-pcv-cream-dark bg-white px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <Logo size="sm" showText={false} href="/staff/dashboard" />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-pcv-burgundy hover:bg-pcv-cream"
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <nav className="mt-3 space-y-1 border-t border-pcv-cream-dark pt-3">
            {staffLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pcv-cream"
              >
                {link.label}
              </Link>
            ))}
            <form action={staffLogoutAction} className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </form>
          </nav>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-pcv-cream-dark bg-white p-4 md:block">
        <div className="mb-6">
          <Link href="/" className="text-sm text-pcv-burgundy hover:underline">
            ← Public Site
          </Link>
          <div className="mt-3">
            <Logo size="sm" showText={false} href="/staff/dashboard" />
          </div>
          <h2 className="mt-2 font-bold text-pcv-burgundy">Staff Portal</h2>
          {userName && (
            <p className="text-xs text-gray-500">{userName}</p>
          )}
        </div>
        <nav className="space-y-1">
          {staffLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-pcv-cream hover:text-pcv-burgundy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={staffLogoutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </form>
      </aside>
    </>
  );
}
