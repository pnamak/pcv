import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, desc, or, like, and } from "drizzle-orm";
import Link from "next/link";

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
    orderBy: [desc(newsArticles.publishedAt)],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">
        PCV Media Releases
      </h1>
      <p className="mb-8 text-gray-600">
        Official news and announcements from the Presbyterian Church of Vanuatu.
      </p>

      <form className="mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search news by title, summary, or content..."
          className="input-field max-w-lg"
        />
      </form>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className="overflow-hidden rounded-2xl border border-pcv-cream-dark bg-white shadow-sm"
          >
            <div className="card-gradient flex h-28 items-center justify-center">
              <span className="text-3xl font-bold text-white/90">PCV</span>
            </div>
            <div className="p-5">
              <time className="text-xs text-gray-500">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-VU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
              <h2 className="mt-1 text-lg font-semibold text-pcv-burgundy">
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
