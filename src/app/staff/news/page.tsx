import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createNewsAction,
  publishNewsAction,
  deleteNewsAction,
} from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export default async function StaffNewsPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const articles = await db.query.newsArticles.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        News & Media Releases
      </h1>

      <section className="section-card mb-10">
        <h2 className="mb-4 text-lg font-semibold">Create Article</h2>
        <form action={createNewsAction} className="space-y-4">
          <input name="title" placeholder="Title" required className="input-field" />
          <input name="summary" placeholder="Summary" className="input-field" />
          <textarea
            name="content"
            placeholder="Full content"
            required
            className="input-field min-h-40"
          />
          <select name="status" className="select-field">
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Immediately</option>
          </select>
          <button type="submit" className="btn-primary">
            Create Article
          </button>
        </form>
      </section>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="section-card flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-pcv-burgundy">{article.title}</h3>
              <p className="text-sm text-gray-500">{article.summary}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    article.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {article.status}
                </span>
                {article.publishedAt && (
                  <span className="text-gray-500">
                    Published {formatDate(article.publishedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              {article.status === "draft" && (
                <form action={publishNewsAction.bind(null, article.id)}>
                  <button
                    type="submit"
                    className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Publish
                  </button>
                </form>
              )}
              <form action={deleteNewsAction.bind(null, article.id)}>
                <button
                  type="submit"
                  className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
