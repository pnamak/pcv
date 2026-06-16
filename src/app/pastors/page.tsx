import { db } from "@/lib/db";
import { pastors, churches } from "@/lib/db/schema";
import { eq, like, and } from "drizzle-orm";

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
        q
          ? like(pastors.firstName, `%${q}%`)
          : undefined
      )
    )
    .orderBy(pastors.lastName);

  const islands = await db
    .selectDistinct({ island: pastors.islandOrigin })
    .from(pastors);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">
        Pastor Directory
      </h1>
      <p className="mb-8 text-gray-600">
        Search and browse pastors serving across the Presbyterian Church of
        Vanuatu.
      </p>

      <form className="mb-8 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name..."
          className="input-field max-w-xs"
        />
        <select name="status" defaultValue={status} className="select-field">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select name="island" defaultValue={island} className="select-field">
          <option value="">Any island</option>
          {islands
            .filter((i) => i.island)
            .map((i) => (
              <option key={i.island!} value={i.island!}>
                {i.island}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white">
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
                    <span className="text-gray-500">
                      {" "}
                      · {pastor.ordinationYear}
                    </span>
                  )}
                </td>
                <td className="text-sm text-gray-600">
                  {[pastor.islandOrigin, pastor.villageOrigin]
                    .filter(Boolean)
                    .join(", ")}
                </td>
                <td className="text-sm">
                  {church?.name ?? (
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
