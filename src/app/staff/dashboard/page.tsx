import { redirect } from "next/navigation";
import Link from "next/link";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function StaffDashboard() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const [churchCount, pastorCount, reportCount, newsCount, eventCount] =
    await Promise.all([
      db.query.churches.findMany().then((r) => r.length),
      db.query.pastors.findMany().then((r) => r.length),
      db.query.reports.findMany().then((r) => r.length),
      db.query.newsArticles.findMany().then((r) => r.length),
      db.query.events.findMany().then((r) => r.length),
    ]);

  const stats = [
    { label: "Churches", count: churchCount, href: "/staff/churches" },
    { label: "Pastors", count: pastorCount, href: "/staff/pastors" },
    { label: "Reports", count: reportCount, href: "/staff/reports" },
    { label: "News Articles", count: newsCount, href: "/staff/news" },
    { label: "Events", count: eventCount, href: "/staff/events" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-pcv-burgundy">Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome back, {user.name}. Manage PCV data from here.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="section-card transition hover:shadow-md"
          >
            <p className="text-3xl font-bold text-pcv-burgundy">{stat.count}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
