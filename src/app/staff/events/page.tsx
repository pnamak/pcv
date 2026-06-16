import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEventAction, deleteEventAction } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export default async function StaffEventsPage() {
  const user = await getStaffUser();
  if (!user) redirect("/staff");

  const allEvents = await db.query.events.findMany({
    with: { church: true },
    orderBy: (e, { desc }) => [desc(e.startDate)],
  });
  const allChurches = await db.query.churches.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-pcv-burgundy">
        Event Management
      </h1>

      <section className="section-card mb-10">
        <h2 className="mb-4 text-lg font-semibold">Add Event</h2>
        <form action={createEventAction} className="grid gap-4 sm:grid-cols-2">
          <input name="title" placeholder="Event title" required className="input-field sm:col-span-2" />
          <textarea name="description" placeholder="Description" className="input-field sm:col-span-2" />
          <input name="startDate" type="date" required className="input-field" />
          <input name="endDate" type="date" className="input-field" />
          <input name="category" placeholder="Category" className="input-field" />
          <input name="province" placeholder="Province" className="input-field" />
          <select name="churchId" className="select-field sm:col-span-2">
            <option value="">No specific church</option>
            {allChurches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary sm:col-span-2">
            Add Event
          </button>
        </form>
      </section>

      <div className="space-y-4">
        {allEvents.map((event) => (
          <div key={event.id} className="section-card flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-pcv-burgundy">{event.title}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(event.startDate)}
                {event.endDate && ` — ${formatDate(event.endDate)}`}
              </p>
              {event.church && (
                <p className="text-sm text-gray-500">{event.church.name}</p>
              )}
            </div>
            <form action={deleteEventAction.bind(null, event.id)}>
              <button
                type="submit"
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
