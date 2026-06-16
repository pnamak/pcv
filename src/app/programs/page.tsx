import { db } from "@/lib/db";

export default async function ProgramsPage() {
  const programs = await db.query.churchPrograms.findMany({
    orderBy: (p, { asc }) => [asc(p.title)],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">
        Church Programs
      </h1>
      <p className="mb-8 text-gray-600">
        Fellowship, education, and mission programs across PCV congregations.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {programs.map((program) => (
          <article
            key={program.id}
            className="rounded-2xl border border-pcv-cream-dark bg-white p-6"
          >
            {program.category && (
              <span className="rounded-full bg-pcv-burgundy/10 px-3 py-1 text-xs font-medium text-pcv-burgundy">
                {program.category}
              </span>
            )}
            <h2 className="mt-3 text-xl font-semibold text-pcv-burgundy">
              {program.title}
            </h2>
            <p className="mt-2 text-gray-600">{program.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
