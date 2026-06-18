import { redirect } from "next/navigation";
import Link from "next/link";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";

const quickActions = [
  { label: "Create Church", href: "/staff/churches#create", icon: "⛪" },
  { label: "Create Pastor", href: "/staff/pastors#create", icon: "👤" },
  { label: "Upload Report", href: "/staff/reports#create", icon: "📄" },
  { label: "Create Event", href: "/staff/events#create", icon: "📅" },
  { label: "Create News", href: "/staff/news#create", icon: "📰" },
];

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
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-600 sm:mb-8">
        Welcome back, {user.name}. Create and manage PCV data from here.
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Quick Create</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="section-card flex items-center gap-3 transition hover:border-pcv-burgundy hover:shadow-md"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium text-pcv-burgundy">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Overview</h2>
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
      </section>
    </div>
  );
}
