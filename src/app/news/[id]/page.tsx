import { db } from "@/lib/db";
import { newsArticles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

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
  });

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/news"
        className="mb-6 inline-block text-sm text-pcv-burgundy hover:underline"
      >
        ← Back to Media Releases
      </Link>
      <time className="text-sm text-gray-500">
        {article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-VU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </time>
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
