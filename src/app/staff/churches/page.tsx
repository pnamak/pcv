import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  createChurchAction,
  updateChurchAction,
  deleteChurchAction,
} from "@/lib/actions";
import { MapLocationPicker } from "@/components/MapLocationPicker";
import { parseTags } from "@/lib/utils";

export default async function StaffChurchesPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const allChurches = await db.query.churches.findMany({
    with: { pastor: true },
    orderBy: (c, { asc }) => [asc(c.name)],
  });
  const allPastors = await db.query.pastors.findMany({
    orderBy: (p, { asc }) => [asc(p.lastName)],
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        Church Management
      </h1>

      <section className="section-card mb-10">
        <h2 className="mb-4 text-lg font-semibold">Add Church</h2>
        <form action={createChurchAction} className="grid gap-4 sm:grid-cols-2">
          <input name="name" placeholder="Church name" required className="input-field" />
          <input name="areaCouncil" placeholder="Area council" className="input-field" />
          <input name="sessionName" placeholder="Session name" className="input-field" />
          <input name="presbytery" placeholder="Presbytery" className="input-field" />
          <input name="island" placeholder="Island" className="input-field" />
          <input name="province" placeholder="Province" className="input-field" />
          <select name="pastorId" className="select-field">
            <option value="">Vacant</option>
            {allPastors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
          <input name="memberCount" type="number" placeholder="Member count" className="input-field" />
          <input name="serviceTimes" placeholder="Service times" className="input-field sm:col-span-2" />
          <input name="tags" placeholder="Tags (comma-separated)" className="input-field sm:col-span-2" />
          <div className="sm:col-span-2">
            <MapLocationPicker />
          </div>
          <button type="submit" className="btn-primary sm:col-span-2">
            Add Church
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">All Churches</h2>
        {allChurches.map((church) => (
          <div key={church.id} className="section-card">
            <form
              action={updateChurchAction.bind(null, church.id)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <input name="name" defaultValue={church.name} required className="input-field" />
              <input name="areaCouncil" defaultValue={church.areaCouncil ?? ""} className="input-field" />
              <input name="sessionName" defaultValue={church.sessionName ?? ""} className="input-field" />
              <input name="presbytery" defaultValue={church.presbytery ?? ""} className="input-field" />
              <input name="island" defaultValue={church.island ?? ""} className="input-field" />
              <input name="province" defaultValue={church.province ?? ""} className="input-field" />
              <select name="pastorId" defaultValue={church.pastorId ?? ""} className="select-field">
                <option value="">Vacant</option>
                {allPastors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
              <input name="memberCount" type="number" defaultValue={church.memberCount ?? 0} className="input-field" />
              <input name="serviceTimes" defaultValue={church.serviceTimes ?? ""} className="input-field sm:col-span-2" />
              <input
                name="tags"
                defaultValue={parseTags(church.tags).join(", ")}
                className="input-field sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <MapLocationPicker
                  defaultLat={church.latitude}
                  defaultLng={church.longitude}
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" className="btn-primary">
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteChurchAction.bind(null, church.id)}
                  className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        ))}
      </section>
    </div>
  );
}
