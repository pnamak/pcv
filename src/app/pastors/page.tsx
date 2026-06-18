import { db } from "@/lib/db";
import { pastors, churches } from "@/lib/db/schema";
import { eq, like, and } from "drizzle-orm";
import { PageHeader } from "@/components/PageHeader";
import { ChurchLogo } from "@/components/ChurchLogo";

interface Props {
  searchParams: Promise<{
    q?: string;
    status?: string;
    island?: string;
  }>;
}

export default async function PastorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status || "active";
  const island = params.island?.trim();

  const allPastors = await db
    .select({
      pastor: pastors,
      church: churches,
    })
    .from(pastors)
    .leftJoin(churches, eq(churches.pastorId, pastors.id))
    .where(
      and(
        status ? eq(pastors.status, status) : undefined,
        island ? eq(pastors.islandOrigin, island) : undefined,
        q ? like(pastors.firstName, `%${q}%`) : undefined
      )
    )
    .orderBy(pastors.lastName);

  const islands = await db
    .selectDistinct({ island: pastors.islandOrigin })
    .from(pastors);

  return (
    <div className="page-container">
      <PageHeader
        title="Pastor Directory"
        description="Search and browse pastors serving across the Presbyterian Church of Vanuatu."
      />

      <form className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name..."
          className="input-field w-full sm:max-w-xs"
        />
        <select name="status" defaultValue={status} className="select-field w-full sm:w-auto">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select name="island" defaultValue={island} className="select-field w-full sm:w-auto">
          <option value="">Any island</option>
          {islands
            .filter((i) => i.island)
            .map((i) => (
              <option key={i.island!} value={i.island!}>
                {i.island}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Search
        </button>
      </form>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {allPastors.map(({ pastor, church }) => (
          <article
            key={pastor.id}
            className="rounded-xl border border-pcv-cream-dark bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-pcv-burgundy">
                {pastor.firstName} {pastor.lastName}
              </h2>
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                {pastor.status}
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              {(pastor.email || pastor.phone) && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Contact</dt>
                  <dd className="text-gray-700">
                    {pastor.email && <div>{pastor.email}</div>}
                    {pastor.phone && <div>{pastor.phone}</div>}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Rank</dt>
                <dd>
                  {pastor.rank}
                  {pastor.ordinationYear && ` · ${pastor.ordinationYear}`}
                </dd>
              </div>
              {(pastor.islandOrigin || pastor.villageOrigin) && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Origin</dt>
                  <dd>
                    {[pastor.islandOrigin, pastor.villageOrigin]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Church</dt>
                <dd className="flex items-center gap-2">
                  {church && <ChurchLogo church={church} size="sm" />}
                  <span>{church?.name ?? "Unassigned"}</span>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white md:block">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pastor</th>
              <th>Contact</th>
              <th>Rank & Ordination</th>
              <th>Origin</th>
              <th>Assigned Church</th>
            </tr>
          </thead>
          <tbody>
            {allPastors.map(({ pastor, church }) => (
              <tr key={pastor.id}>
                <td>
                  <span className="font-medium">
                    {pastor.firstName} {pastor.lastName}
                  </span>
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    {pastor.status}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {pastor.email && <div>{pastor.email}</div>}
                  {pastor.phone && <div>{pastor.phone}</div>}
                </td>
                <td className="text-sm">
                  {pastor.rank}
                  {pastor.ordinationYear && (
                    <span className="text-gray-500"> · {pastor.ordinationYear}</span>
                  )}
                </td>
                <td className="text-sm text-gray-600">
                  {[pastor.islandOrigin, pastor.villageOrigin]
                    .filter(Boolean)
                    .join(", ")}
                </td>
                <td className="text-sm">
                  {church ? (
                    <span className="flex items-center gap-2">
                      <ChurchLogo church={church} size="sm" />
                      {church.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
