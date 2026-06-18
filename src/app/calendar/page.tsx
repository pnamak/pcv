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
import { PageHeader } from "@/components/PageHeader";

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
    <div className="page-container">
      <PageHeader
        title="PCV Public Calendar"
        description="View upcoming events across presbyteries and provinces."
      />

      <form className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
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

      <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <Link
          href={`/calendar?month=${prevMonth}${category ? `&category=${category}` : ""}${province ? `&province=${province}` : ""}`}
          className="btn-secondary w-full text-center sm:w-auto"
        >
          Previous
        </Link>
        <h2 className="text-lg font-semibold text-pcv-burgundy sm:text-xl">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Link
          href={`/calendar?month=${nextMonth}${category ? `&category=${category}` : ""}${province ? `&province=${province}` : ""}`}
          className="btn-secondary w-full text-center sm:w-auto"
        >
          Next
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[320px] grid grid-cols-7 gap-1 sm:gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-2 text-center text-xs font-semibold text-pcv-burgundy sm:text-sm"
          >
            <span className="sm:hidden">{d}</span>
            <span className="hidden sm:inline">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
            </span>
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
              className="min-h-16 rounded-lg border border-pcv-cream-dark bg-white p-1 sm:min-h-24 sm:p-2"
            >
              <span className="text-xs font-medium sm:text-sm">{format(day, "d")}</span>
              {dayEvents.map((e) => (
                <div
                  key={e.id}
                  className="mt-0.5 truncate rounded bg-pcv-burgundy/10 px-0.5 py-0.5 text-[10px] text-pcv-burgundy sm:mt-1 sm:px-1 sm:text-xs"
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
    </div>
  );
}
