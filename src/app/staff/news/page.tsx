import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  publishNewsAction,
  deleteNewsAction,
} from "@/lib/actions";
import { CreateNewsForm } from "@/components/forms/CreateNewsForm";
import { formatDate } from "@/lib/utils";

export default async function StaffNewsPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const articles = await db.query.newsArticles.findMany({
    with: { church: true },
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });
  const allChurches = await db.query.churches.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">
        News & Media Releases
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Write and publish media releases for the public site.
      </p>

      <section className="section-card mb-10" id="create">
        <h2 className="mb-4 text-lg font-semibold">Create Article</h2>
        <CreateNewsForm churches={allChurches} />
      </section>

      <h2 className="mb-4 text-lg font-semibold">
        All Articles ({articles.length})
      </h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="section-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-pcv-burgundy">{article.title}</h3>
              <p className="text-sm text-gray-500">{article.summary}</p>
              {article.church && (
                <p className="mt-1 text-xs text-gray-500">
                  Church: {article.church.name}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 ${article.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {article.status}
                </span>
                {article.publishedAt && (
                  <span className="text-gray-500">Published {formatDate(article.publishedAt)}</span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              {article.status === "draft" && (
                <form action={publishNewsAction.bind(null, article.id)}>
                  <button type="submit" className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Publish</button>
                </form>
              )}
              <form action={deleteNewsAction.bind(null, article.id)}>
                <button type="submit" className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="text-sm text-gray-500">No articles yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
