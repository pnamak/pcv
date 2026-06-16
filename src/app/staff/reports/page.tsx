import { redirect } from "next/navigation";
import Link from "next/link";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadReportAction, deleteReportAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        Report Management
      </h1>

      <section className="section-card mb-10">
        <h2 className="mb-4 text-lg font-semibold">Upload Report</h2>
        <form action={uploadReportAction} className="grid gap-4 sm:grid-cols-2">
          <input name="title" placeholder="Report title" required className="input-field sm:col-span-2" />
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="input-field min-h-20 sm:col-span-2"
          />
          <select name="reportType" className="select-field">
            <option value="general">General</option>
            <option value="financial">Financial</option>
            <option value="outreach">Outreach</option>
            <option value="synod">Synod</option>
            <option value="membership">Membership</option>
          </select>
          <select name="churchId" className="select-field">
            <option value="">No specific church</option>
            {allChurches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="presbytery" placeholder="Presbytery (optional)" className="input-field sm:col-span-2" />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              File (PDF, Excel, Word, etc.)
            </label>
            <input
              name="file"
              type="file"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary sm:col-span-2">
            Upload Report
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Uploaded Reports</h2>
        <div className="overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
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
                      <div className="text-xs text-gray-500">{report.description}</div>
                    )}
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
                  <td colSpan={6} className="py-8 text-center text-gray-500">
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
