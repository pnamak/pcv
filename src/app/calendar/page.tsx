import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    month?: string;
    category?: string;
    province?: string;
  }>;
}

export default async function CalendarPage({ searchParams }: Props) {
  const params = await searchParams;
  const monthStr = params.month || format(new Date(), "yyyy-MM");
  const currentMonth = parseISO(`${monthStr}-01`);
  const category = params.category;
  const province = params.province;

  const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const monthEvents = await db.query.events.findMany({
    where: and(
      gte(events.startDate, monthStart),
      lte(events.startDate, monthEnd),
      category ? eq(events.category, category) : undefined,
      province ? eq(events.province, province) : undefined
    ),
    with: { church: true },
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const prevMonth = format(subMonths(currentMonth, 1), "yyyy-MM");
  const nextMonth = format(addMonths(currentMonth, 1), "yyyy-MM");

  const categories = await db
    .selectDistinct({ category: events.category })
    .from(events);
  const provinces = await db
    .selectDistinct({ province: events.province })
    .from(events);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">
        PCV Public Calendar
      </h1>
      <p className="mb-8 text-gray-600">
        View upcoming events across presbyteries and provinces.
      </p>

      <form className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Category
          </label>
          <select name="category" defaultValue={category} className="select-field">
            <option value="">Any category</option>
            {categories
              .filter((c) => c.category)
              .map((c) => (
                <option key={c.category!} value={c.category!}>
                  {c.category}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Province
          </label>
          <select name="province" defaultValue={province} className="select-field">
            <option value="">Any province</option>
            {provinces
              .filter((p) => p.province)
              .map((p) => (
                <option key={p.province!} value={p.province!}>
                  {p.province}
                </option>
              ))}
          </select>
        </div>
        <input type="hidden" name="month" value={monthStr} />
        <button type="submit" className="btn-primary">
          Apply
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/calendar?month=${prevMonth}${category ? `&category=${category}` : ""}${province ? `&province=${province}` : ""}`}
          className="btn-secondary"
        >
          Previous
        </Link>
        <h2 className="text-xl font-semibold text-pcv-burgundy">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Link
          href={`/calendar?month=${nextMonth}${category ? `&category=${category}` : ""}${province ? `&province=${province}` : ""}`}
          className="btn-secondary"
        >
          Next
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-pcv-burgundy"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: days[0].getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dayEvents = monthEvents.filter((e) =>
            isSameDay(parseISO(e.startDate), day)
          );
          return (
            <div
              key={day.toISOString()}
              className="min-h-24 rounded-lg border border-pcv-cream-dark bg-white p-2"
            >
              <span className="text-sm font-medium">{format(day, "d")}</span>
              {dayEvents.map((e) => (
                <div
                  key={e.id}
                  className="mt-1 rounded bg-pcv-burgundy/10 px-1 py-0.5 text-xs text-pcv-burgundy"
                  title={e.description ?? undefined}
                >
                  {e.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
