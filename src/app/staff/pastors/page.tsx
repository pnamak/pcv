import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { churches } from "@/lib/db/schema";
import {
  createPastorAction,
  updatePastorAction,
  deletePastorAction,
} from "@/lib/actions";

export default async function StaffPastorsPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const allPastors = await db.query.pastors.findMany({
    orderBy: (p, { asc }) => [asc(p.lastName)],
  });
  const allChurches = await db.query.churches.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  const pastorChurchMap = new Map<number, string>();
  for (const church of allChurches) {
    if (church.pastorId) {
      pastorChurchMap.set(church.pastorId, String(church.id));
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        Pastor Management
      </h1>

      <section className="section-card mb-10">
        <h2 className="mb-4 text-lg font-semibold">Add Pastor</h2>
        <form action={createPastorAction} className="grid gap-4 sm:grid-cols-2">
          <input name="firstName" placeholder="First name" required className="input-field" />
          <input name="lastName" placeholder="Last name" required className="input-field" />
          <input name="email" type="email" placeholder="Email" className="input-field" />
          <input name="phone" placeholder="Phone" className="input-field" />
          <input name="rank" placeholder="Rank" defaultValue="Pastor" className="input-field" />
          <input name="ordinationYear" type="number" placeholder="Ordination year" className="input-field" />
          <input name="islandOrigin" placeholder="Island of origin" className="input-field" />
          <input name="villageOrigin" placeholder="Village of origin" className="input-field" />
          <select name="status" className="select-field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select name="churchId" className="select-field">
            <option value="">No church assignment</option>
            {allChurches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary sm:col-span-2">
            Add Pastor
          </button>
        </form>
      </section>

      <div className="overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white">
        <table className="data-table">
          <thead>
            <tr>
              <th>Pastor</th>
              <th>Contact</th>
              <th>Rank</th>
              <th>Origin</th>
              <th>Church</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allPastors.map((pastor) => (
              <tr key={pastor.id}>
                <td colSpan={6} className="p-0">
                  <form
                    action={updatePastorAction.bind(null, pastor.id)}
                    className="grid grid-cols-6 gap-2 p-4"
                  >
                    <div className="space-y-1">
                      <input name="firstName" defaultValue={pastor.firstName} className="input-field" />
                      <input name="lastName" defaultValue={pastor.lastName} className="input-field" />
                      <select name="status" defaultValue={pastor.status} className="select-field">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <input name="email" defaultValue={pastor.email ?? ""} className="input-field" />
                      <input name="phone" defaultValue={pastor.phone ?? ""} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <input name="rank" defaultValue={pastor.rank} className="input-field" />
                      <input
                        name="ordinationYear"
                        type="number"
                        defaultValue={pastor.ordinationYear ?? ""}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-1">
                      <input name="islandOrigin" defaultValue={pastor.islandOrigin ?? ""} className="input-field" />
                      <input name="villageOrigin" defaultValue={pastor.villageOrigin ?? ""} className="input-field" />
                    </div>
                    <select
                      name="churchId"
                      defaultValue={pastorChurchMap.get(pastor.id) ?? ""}
                      className="select-field"
                    >
                      <option value="">Unassigned</option>
                      {allChurches.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-col gap-1">
                      <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                        Save
                      </button>
                      <button
                        type="submit"
                        formAction={deletePastorAction.bind(null, pastor.id)}
                        className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
