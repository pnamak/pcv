import Link from "next/link";
import { getStaffUser } from "@/lib/auth";
import { staffLogoutAction } from "@/lib/actions";

const staffLinks = [
  { href: "/staff/dashboard", label: "Dashboard" },
  { href: "/staff/churches", label: "Churches" },
  { href: "/staff/pastors", label: "Pastors" },
  { href: "/staff/reports", label: "Reports" },
  { href: "/staff/news", label: "News" },
  { href: "/staff/events", label: "Events" },
];

export async function StaffNav() {
  const user = await getStaffUser();

  return (
    <aside className="w-56 shrink-0 border-r border-pcv-cream-dark bg-white p-4">
      <div className="mb-6">
        <Link href="/" className="text-sm text-pcv-burgundy hover:underline">
          ← Public Site
        </Link>
        <h2 className="mt-2 font-bold text-pcv-burgundy">Staff Portal</h2>
        {user && (
          <p className="text-xs text-gray-500">{user.name}</p>
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
      {user && (
        <form action={staffLogoutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sign Out
          </button>
        </form>
      )}
    </aside>
  );
}
