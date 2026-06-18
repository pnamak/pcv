import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ChurchLogo } from "@/components/ChurchLogo";
import { formatDate } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function PublicReportsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();
  const reportType = params.type?.trim();

  const publicReports = await db.query.reports.findMany({
    where: and(
      eq(reports.visibility, "public"),
      reportType ? eq(reports.reportType, reportType) : undefined,
      q
        ? or(
            like(reports.title, `%${q}%`),
            like(reports.description, `%${q}%`),
            like(reports.presbytery, `%${q}%`)
          )
        : undefined
    ),
    with: { church: true },
    orderBy: [desc(reports.uploadedAt)],
  });

  const types = await db
    .selectDistinct({ reportType: reports.reportType })
    .from(reports)
    .where(eq(reports.visibility, "public"));

  return (
    <div className="page-container">
      <PageHeader
        title="PCV Public Reports"
        description="Official reports and documents shared publicly by the Presbyterian Church of Vanuatu."
      />

      <form className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search reports..."
          className="input-field w-full sm:max-w-xs"
        />
        <select name="type" defaultValue={reportType} className="select-field w-full sm:w-auto">
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t.reportType} value={t.reportType}>
              {t.reportType.charAt(0).toUpperCase() + t.reportType.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Search
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publicReports.map((report) => (
          <article
            key={report.id}
            className="section-card flex flex-col"
          >
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Public
              </span>
              <span className="rounded-full bg-pcv-cream px-2 py-0.5 text-xs font-medium capitalize text-pcv-burgundy">
                {report.reportType}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-pcv-burgundy">
              {report.title}
            </h2>
            {report.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {report.description}
              </p>
            )}
            <div className="mb-3 flex items-center gap-2">
              {report.church && (
                <ChurchLogo church={report.church} size="sm" />
              )}
              <p className="text-sm text-gray-500">
                {report.church?.name ?? report.presbytery ?? "PCV General"}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              {formatDate(report.uploadedAt)} · {formatFileSize(report.fileSize)}
            </p>
            <Link
              href={`/api/reports/${report.id}/download`}
              className="btn-primary mt-4 inline-block text-center text-sm"
            >
              Download
            </Link>
          </article>
        ))}
      </div>

      {publicReports.length === 0 && (
        <p className="text-center text-gray-500">
          No public reports available yet.
        </p>
      )}
    </div>
  );
}
