import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, desc, or, like, and } from "drizzle-orm";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { NewsCardHeader } from "@/components/NewsCardHeader";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();

  const articles = await db.query.newsArticles.findMany({
    where: and(
      eq(newsArticles.status, "published"),
      q
        ? or(
            like(newsArticles.title, `%${q}%`),
            like(newsArticles.summary, `%${q}%`),
            like(newsArticles.content, `%${q}%`)
          )
        : undefined
    ),
    with: { church: true },
    orderBy: [desc(newsArticles.publishedAt)],
  });

  return (
    <div className="page-container">
      <PageHeader
        title="PCV Media Releases"
        description="Official news and announcements from the Presbyterian Church of Vanuatu."
      />

      <form className="mb-6 sm:mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search news by title, summary, or content..."
          className="input-field w-full max-w-lg"
        />
      </form>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="overflow-hidden rounded-2xl border border-pcv-cream-dark bg-white shadow-sm"
          >
            <NewsCardHeader church={article.church} />
            <div className="p-4 sm:p-5">
              <time className="text-xs text-gray-500">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-VU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
              <h2 className="mt-1 text-base font-semibold text-pcv-burgundy sm:text-lg">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {article.summary}
              </p>
              <Link
                href={`/news/${article.id}`}
                className="btn-primary mt-4 inline-block text-sm"
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
