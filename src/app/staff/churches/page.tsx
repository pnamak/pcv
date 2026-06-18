import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  updateChurchAction,
  deleteChurchAction,
} from "@/lib/actions";
import { CreateChurchForm } from "@/components/forms/CreateChurchForm";
import { MapLocationPicker } from "@/components/MapLocationPicker";
import { ChurchLogo } from "@/components/ChurchLogo";
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
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">
        Church Management
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Create new churches and manage existing congregation records.
      </p>

      <section className="section-card mb-10" id="create">
        <h2 className="mb-4 text-lg font-semibold">Create Church</h2>
        <CreateChurchForm pastors={allPastors} />
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold">
          All Churches ({allChurches.length})
        </h2>
        {allChurches.length === 0 && (
          <p className="text-sm text-gray-500">No churches yet. Create one above.</p>
        )}
        {allChurches.map((church) => (
          <div key={church.id} className="section-card">
            <div className="mb-4 flex items-center gap-3">
              <ChurchLogo church={church} size="md" />
              <div>
                <p className="font-medium text-pcv-burgundy">{church.name}</p>
                <p className="text-xs text-gray-500">
                  {church.logoPath ? "Custom church logo" : "No logo uploaded"}
                </p>
              </div>
            </div>
            <form
              action={updateChurchAction.bind(null, church.id)}
              encType="multipart/form-data"
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
                <label className="mb-1 block text-sm font-medium">
                  Replace logo
                </label>
                <input
                  name="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg"
                  className="input-field"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to keep the current logo.
                </p>
              </div>
              <div className="sm:col-span-2">
                <MapLocationPicker
                  defaultLat={church.latitude}
                  defaultLng={church.longitude}
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="submit"
                  formAction={deleteChurchAction.bind(null, church.id)}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:px-6 sm:py-2.5"
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
