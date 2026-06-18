import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChurchLogo } from "@/components/ChurchLogo";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await db.query.newsArticles.findFirst({
    where: and(
      eq(newsArticles.id, parseInt(id, 10)),
      eq(newsArticles.status, "published")
    ),
    with: { church: true },
  });

  if (!article) notFound();

  return (
    <article className="page-container max-w-3xl">
      <Link
        href="/news"
        className="mb-6 inline-block text-sm text-pcv-burgundy hover:underline"
      >
        ← Back to Media Releases
      </Link>
      <div className="mb-6 flex items-center gap-3">
        <ChurchLogo church={article.church} size="lg" />
        <div>
          {article.church && (
            <p className="text-sm font-medium text-pcv-burgundy">
              {article.church.name}
            </p>
          )}
          <time className="text-sm text-gray-500">
        {article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-VU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
          </time>
        </div>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-pcv-burgundy">
        {article.title}
      </h1>
      {article.summary && (
        <p className="mt-4 text-lg text-gray-600">{article.summary}</p>
      )}
      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-gray-700">
        {article.content}
      </div>
    </article>
  );
}
