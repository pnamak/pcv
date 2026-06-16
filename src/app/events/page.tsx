import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { gte } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

export default async function EventsPage() {
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = await db.query.events.findMany({
    where: gte(events.startDate, today),
    with: { church: true },
    orderBy: (e, { asc }) => [asc(e.startDate)],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">Events</h1>
      <p className="mb-8 text-gray-600">
        Upcoming events across the Presbyterian Church of Vanuatu.
      </p>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <article
            key={event.id}
            className="rounded-xl border border-pcv-cream-dark bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-pcv-burgundy">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(event.startDate)}
                  {event.endDate && ` — ${formatDate(event.endDate)}`}
                </p>
              </div>
              <div className="flex gap-2">
                {event.category && (
                  <span className="rounded-full bg-pcv-cream px-3 py-1 text-xs font-medium text-pcv-burgundy">
                    {event.category}
                  </span>
                )}
                {event.province && (
                  <span className="rounded-full bg-pcv-cream px-3 py-1 text-xs font-medium text-gray-600">
                    {event.province}
                  </span>
                )}
              </div>
            </div>
            {event.description && (
              <p className="mt-3 text-gray-600">{event.description}</p>
            )}
            {event.church && (
              <p className="mt-2 text-sm text-gray-500">
                Location: {event.church.name}
              </p>
            )}
          </article>
        ))}
        {upcomingEvents.length === 0 && (
          <p className="text-gray-500">No upcoming events scheduled.</p>
        )}
      </div>
    </div>
  );
}
