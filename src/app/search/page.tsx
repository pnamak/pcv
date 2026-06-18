import { db } from "@/lib/db";
import { churches, pastors, newsArticles, events, reports } from "@/lib/db/schema";
import { eq, or, like, and } from "drizzle-orm";
import Link from "next/link";
import { ChurchLogo } from "@/components/ChurchLogo";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();

  if (!q) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-pcv-burgundy">Search</h1>
        <p className="mt-4 text-gray-600">Enter a search term to get started.</p>
      </div>
    );
  }

  const [churchResults, pastorResults, newsResults, eventResults, reportResults] =
    await Promise.all([
      db.query.churches.findMany({
        where: or(
          like(churches.name, `%${q}%`),
          like(churches.presbytery, `%${q}%`),
          like(churches.island, `%${q}%`)
        ),
        limit: 10,
      }),
      db.query.pastors.findMany({
        where: or(
          like(pastors.firstName, `%${q}%`),
          like(pastors.lastName, `%${q}%`)
        ),
        limit: 10,
      }),
      db.query.newsArticles.findMany({
        where: and(
          eq(newsArticles.status, "published"),
          or(
            like(newsArticles.title, `%${q}%`),
            like(newsArticles.summary, `%${q}%`)
          )
        ),
        limit: 10,
      }),
      db.query.events.findMany({
        where: or(
          like(events.title, `%${q}%`),
          like(events.description, `%${q}%`)
        ),
        limit: 10,
      }),
      db.query.reports.findMany({
        where: and(
          eq(reports.visibility, "public"),
          or(
            like(reports.title, `%${q}%`),
            like(reports.description, `%${q}%`)
          )
        ),
        limit: 10,
      }),
    ]);

  const hasResults =
    churchResults.length +
      pastorResults.length +
      newsResults.length +
      eventResults.length +
      reportResults.length >
    0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        Search results for &ldquo;{q}&rdquo;
      </h1>

      {!hasResults && (
        <p className="text-gray-500">No results found. Try a different term.</p>
      )}

      {churchResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Churches</h2>
          <ul className="space-y-2">
            {churchResults.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <ChurchLogo church={c} size="sm" />
                <div>
                <Link href="/churches" className="text-pcv-burgundy hover:underline">
                  {c.name}
                </Link>
                <span className="text-sm text-gray-500"> — {c.island}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pastorResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Pastors</h2>
          <ul className="space-y-2">
            {pastorResults.map((p) => (
              <li key={p.id}>
                <Link href="/pastors" className="text-pcv-burgundy hover:underline">
                  {p.firstName} {p.lastName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {newsResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">News</h2>
          <ul className="space-y-2">
            {newsResults.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/news/${n.id}`}
                  className="text-pcv-burgundy hover:underline"
                >
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {eventResults.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-semibold">Events</h2>
          <ul className="space-y-2">
            {eventResults.map((e) => (
              <li key={e.id}>
                <Link href="/events" className="text-pcv-burgundy hover:underline">
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reportResults.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">Reports</h2>
          <ul className="space-y-2">
            {reportResults.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/api/reports/${r.id}/download`}
                  className="text-pcv-burgundy hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
