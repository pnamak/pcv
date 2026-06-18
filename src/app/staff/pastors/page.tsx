import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  updatePastorAction,
  deletePastorAction,
} from "@/lib/actions";
import { CreatePastorForm } from "@/components/forms/CreatePastorForm";

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
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">
        Pastor Management
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Add pastors and assign them to churches.
      </p>

      <section className="section-card mb-10" id="create">
        <h2 className="mb-4 text-lg font-semibold">Create Pastor</h2>
        <CreatePastorForm churches={allChurches} />
      </section>

      <h2 className="mb-4 text-lg font-semibold">
        All Pastors ({allPastors.length})
      </h2>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {allPastors.map((pastor) => (
          <div key={pastor.id} className="section-card">
            <form action={updatePastorAction.bind(null, pastor.id)} className="space-y-3">
              <input name="firstName" defaultValue={pastor.firstName} className="input-field" />
              <input name="lastName" defaultValue={pastor.lastName} className="input-field" />
              <input name="email" defaultValue={pastor.email ?? ""} className="input-field" />
              <input name="phone" defaultValue={pastor.phone ?? ""} className="input-field" />
              <input name="rank" defaultValue={pastor.rank} className="input-field" />
              <input name="ordinationYear" type="number" defaultValue={pastor.ordinationYear ?? ""} className="input-field" />
              <input name="islandOrigin" defaultValue={pastor.islandOrigin ?? ""} className="input-field" />
              <input name="villageOrigin" defaultValue={pastor.villageOrigin ?? ""} className="input-field" />
              <select name="status" defaultValue={pastor.status} className="select-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select name="churchId" defaultValue={pastorChurchMap.get(pastor.id) ?? ""} className="select-field">
                <option value="">Unassigned</option>
                {allChurches.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="submit" formAction={deletePastorAction.bind(null, pastor.id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
              </div>
            </form>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-pcv-cream-dark bg-white md:block">
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
                  <form action={updatePastorAction.bind(null, pastor.id)} className="grid grid-cols-6 gap-2 p-4">
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
                      <input name="ordinationYear" type="number" defaultValue={pastor.ordinationYear ?? ""} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <input name="islandOrigin" defaultValue={pastor.islandOrigin ?? ""} className="input-field" />
                      <input name="villageOrigin" defaultValue={pastor.villageOrigin ?? ""} className="input-field" />
                    </div>
                    <select name="churchId" defaultValue={pastorChurchMap.get(pastor.id) ?? ""} className="select-field">
                      <option value="">Unassigned</option>
                      {allChurches.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="flex flex-col gap-1">
                      <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Save</button>
                      <button type="submit" formAction={deletePastorAction.bind(null, pastor.id)} className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
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
