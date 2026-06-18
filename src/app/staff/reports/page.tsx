import { redirect } from "next/navigation";
import Link from "next/link";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  deleteReportAction,
  updateReportVisibilityAction,
} from "@/lib/actions";
import { UploadReportForm } from "@/components/forms/UploadReportForm";
import { visibilityLabel } from "@/lib/reports";
import { formatDate } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const isPublic = visibility === "public";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isPublic
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {visibilityLabel(visibility)}
    </span>
  );
}

export default async function StaffReportsPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const allReports = await db.query.reports.findMany({
    with: { church: true, uploader: true },
    orderBy: (r, { desc }) => [desc(r.uploadedAt)],
  });
  const allChurches = await db.query.churches.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">
        Report Management
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Upload reports and choose whether each is <strong>private</strong> (staff
        only) or <strong>public</strong> (visible on the Reports page).
      </p>

      <section className="section-card mb-10" id="create">
        <h2 className="mb-4 text-lg font-semibold">Upload Report</h2>
        <UploadReportForm churches={allChurches} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          All Reports ({allReports.length})
        </h2>

        <div className="space-y-4 md:hidden">
          {allReports.map((report) => (
            <div key={report.id} className="section-card">
              <div className="mb-2 flex items-center gap-2">
                <VisibilityBadge visibility={report.visibility} />
                <span className="text-sm capitalize text-gray-500">
                  {report.reportType}
                </span>
              </div>
              <h3 className="font-semibold text-pcv-burgundy">{report.title}</h3>
              {report.description && (
                <p className="mt-1 text-sm text-gray-500">{report.description}</p>
              )}
              <p className="text-sm">
                {report.church?.name ?? report.presbytery ?? "—"}
              </p>
              <Link
                href={`/api/reports/${report.id}/download`}
                className="mt-2 inline-block text-sm text-pcv-burgundy hover:underline"
              >
                {report.fileName} ({formatFileSize(report.fileSize)})
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                {formatDate(report.uploadedAt)}
              </p>
              <form
                action={updateReportVisibilityAction.bind(null, report.id)}
                className="mt-3 flex gap-2"
              >
                <select
                  name="visibility"
                  defaultValue={report.visibility}
                  className="select-field flex-1 text-sm"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Update
                </button>
              </form>
              <form action={deleteReportAction.bind(null, report.id)} className="mt-2">
                <button
                  type="submit"
                  className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
          {allReports.length === 0 && (
            <p className="text-sm text-gray-500">No reports uploaded yet.</p>
          )}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white md:block">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Visibility</th>
                <th>Type</th>
                <th>Church / Presbytery</th>
                <th>File</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="font-medium">{report.title}</div>
                    {report.description && (
                      <div className="text-xs text-gray-500">
                        {report.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <form action={updateReportVisibilityAction.bind(null, report.id)}>
                      <div className="flex items-center gap-1">
                        <select
                          name="visibility"
                          defaultValue={report.visibility}
                          className="select-field text-xs"
                        >
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                        </select>
                        <button
                          type="submit"
                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </td>
                  <td className="text-sm capitalize">{report.reportType}</td>
                  <td className="text-sm">
                    {report.church?.name ?? report.presbytery ?? "—"}
                  </td>
                  <td className="text-sm">
                    <Link
                      href={`/api/reports/${report.id}/download`}
                      className="text-pcv-burgundy hover:underline"
                    >
                      {report.fileName}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(report.fileSize)}
                    </div>
                  </td>
                  <td className="text-sm text-gray-500">
                    {formatDate(report.uploadedAt)}
                    {report.uploader && (
                      <div className="text-xs">by {report.uploader.name}</div>
                    )}
                  </td>
                  <td>
                    <form action={deleteReportAction.bind(null, report.id)}>
                      <button
                        type="submit"
                        className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {allReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No reports uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
