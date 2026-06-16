import { db } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { ChurchMapWrapper } from "@/components/ChurchMapWrapper";

export default async function ChurchesPage() {
  const allChurches = await db.query.churches.findMany({
    with: { pastor: true },
    orderBy: (c, { asc }) => [asc(c.name)],
  });

  const mapChurches = allChurches
    .filter((c) => c.latitude != null && c.longitude != null)
    .map((c) => ({
      id: c.id,
      name: c.name,
      latitude: c.latitude!,
      longitude: c.longitude!,
      presbytery: c.presbytery,
      pastorName: c.pastor
        ? `${c.pastor.firstName} ${c.pastor.lastName}`
        : null,
      memberCount: c.memberCount,
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">
        PCV Church Directory
      </h1>
      <p className="mb-8 text-gray-600">
        Explore congregations across Vanuatu on the map and browse church
        details.
      </p>

      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChurchMapWrapper churches={mapChurches} height="500px" />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-pcv-burgundy">
            Church Cards
          </h2>
          <div className="max-h-[500px] space-y-3 overflow-y-auto">
            {allChurches.map((church) => (
              <div
                key={church.id}
                className="rounded-xl border border-pcv-cream-dark bg-white p-4"
              >
                <h3 className="font-semibold text-pcv-burgundy">
                  {church.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {[church.island, church.presbytery, church.areaCouncil]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
                <p className="mt-1 text-sm">
                  Pastor:{" "}
                  {church.pastor
                    ? `${church.pastor.firstName} ${church.pastor.lastName}`
                    : "Vacant"}
                </p>
                {church.serviceTimes && (
                  <p className="text-sm text-gray-600">{church.serviceTimes}</p>
                )}
                {church.memberCount != null && (
                  <p className="text-sm text-gray-600">
                    {church.memberCount} members
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {parseTags(church.tags).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-pcv-cream px-2 py-0.5 text-xs text-pcv-burgundy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
