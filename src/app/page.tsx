import Link from "next/link";
import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Logo } from "@/components/Logo";
import { NewsCardHeader } from "@/components/NewsCardHeader";

export default async function HomePage() {
  const recentNews = await db.query.newsArticles.findMany({
    where: eq(newsArticles.status, "published"),
    with: { church: true },
    orderBy: [desc(newsArticles.publishedAt)],
    limit: 4,
  });

  return (
    <>
      <section className="hero-gradient relative overflow-hidden px-4 py-12 text-white sm:py-16 md:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <Logo size="lg" showText={false} href={undefined} variant="light" />
            </div>
            <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Presbyterian Church of Vanuatu
            </h1>
            <p className="mb-2 text-sm text-blue-100 sm:text-base">
              Presbitirin Jyos Blong Vanuatu
            </p>
            <p className="mb-6 text-base text-white/90 italic sm:mb-8 sm:text-lg">
              &ldquo;For in him we live and move and have our being.&rdquo; —
              Acts 17:28
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
              <Link href="/news" className="btn-outline-light">
                Read News
              </Link>
              <Link href="/churches" className="btn-outline-light">
                Find Churches
              </Link>
              <Link href="/programs" className="btn-outline-light">
                Church Programs
              </Link>
              <Link href="/contact" className="btn-outline-light">
                Contact PCV
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur sm:p-6">
            <div className="mb-4 text-center">
              <span className="text-4xl font-bold sm:text-5xl">{recentNews.length}</span>
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

      <section className="page-container">
        <h2 className="mb-6 text-xl font-bold text-pcv-burgundy sm:mb-8 sm:text-2xl">
          Latest News
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {recentNews.map((article) => (
            <article
              key={article.id}
              className="overflow-hidden rounded-2xl border border-pcv-cream-dark bg-white shadow-sm transition hover:shadow-md"
            >
              <NewsCardHeader church={article.church} />
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
