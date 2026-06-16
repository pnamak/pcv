import Link from "next/link";
import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function HomePage() {
  const recentNews = await db.query.newsArticles.findMany({
    where: eq(newsArticles.status, "published"),
    orderBy: [desc(newsArticles.publishedAt)],
    limit: 4,
  });

  return (
    <>
      <section className="hero-gradient relative overflow-hidden px-4 py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Presbyterian Church of Vanuatu
            </h1>
            <p className="mb-8 text-lg text-white/90 italic">
              &ldquo;For where two or three gather in my name, there am I with
              them.&rdquo; — Matthew 18:20
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/news" className="btn-outline-light">
                Read News
              </Link>
              <Link href="/churches" className="btn-outline-light">
                Find Churches
              </Link>
              <Link href="/programs" className="btn-outline-light">
                Explore Church Programs
              </Link>
              <Link href="/contact" className="btn-outline-light">
                Contact PCV
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-pcv-burgundy/80 p-6 backdrop-blur">
            <div className="mb-4 text-center">
              <span className="text-5xl font-bold">{recentNews.length}</span>
              <p className="text-sm text-white/80">Recent media releases</p>
            </div>
            <div className="space-y-2">
              <Link
                href="/churches"
                className="block rounded-lg bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"
              >
                Open Church Map →
              </Link>
              <Link
                href="/pastors"
                className="block rounded-lg bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"
              >
                Pastor Directory →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-pcv-burgundy">
          Latest News
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentNews.map((article) => (
            <article
              key={article.id}
              className="overflow-hidden rounded-2xl border border-pcv-cream-dark bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="card-gradient flex h-24 items-center justify-center">
                <span className="text-2xl font-bold text-white/90">PCV</span>
              </div>
              <div className="p-4">
                <time className="text-xs text-gray-500">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("en-VU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </time>
                <h3 className="mt-1 font-semibold text-pcv-burgundy line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {article.summary}
                </p>
                <Link
                  href={`/news/${article.id}`}
                  className="mt-3 inline-block text-sm font-semibold text-pcv-burgundy hover:underline"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}