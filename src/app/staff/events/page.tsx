import { redirect } from "next/navigation";
import { getStaffUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteEventAction } from "@/lib/actions";
import { CreateEventForm } from "@/components/forms/CreateEventForm";
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
      <h1 className="mb-2 text-xl font-bold text-pcv-burgundy sm:text-2xl">
        Event Management
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Schedule events that appear on the public calendar.
      </p>

      <section className="section-card mb-10" id="create">
        <h2 className="mb-4 text-lg font-semibold">Create Event</h2>
        <CreateEventForm churches={allChurches} />
      </section>

      <h2 className="mb-4 text-lg font-semibold">
        All Events ({allEvents.length})
      </h2>
      <div className="space-y-4">
        {allEvents.map((event) => (
          <div key={event.id} className="section-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-pcv-burgundy">{event.title}</h3>
              {event.description && <p className="mt-1 text-sm text-gray-600">{event.description}</p>}
              <p className="mt-1 text-sm text-gray-500">
                {formatDate(event.startDate)}
                {event.endDate && ` — ${formatDate(event.endDate)}`}
              </p>
              {event.category && <p className="text-sm text-gray-500">Category: {event.category}</p>}
              {event.church && <p className="text-sm text-gray-500">{event.church.name}</p>}
            </div>
            <form action={deleteEventAction.bind(null, event.id)}>
              <button type="submit" className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
            </form>
          </div>
        ))}
        {allEvents.length === 0 && (
          <p className="text-sm text-gray-500">No events yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
