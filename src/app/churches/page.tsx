import { db } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { ChurchMapWrapper } from "@/components/ChurchMapWrapper";
import { PageHeader } from "@/components/PageHeader";
import { ChurchLogo } from "@/components/ChurchLogo";

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
      logoPath: c.logoPath,
    }));

  return (
    <div className="page-container">
      <PageHeader
        title="PCV Church Directory"
        description="Explore congregations across Vanuatu on the map and browse church details."
      />

      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <div className="min-h-[280px] lg:col-span-2 lg:min-h-[500px]">
          <ChurchMapWrapper
            churches={mapChurches}
            height="100%"
            className="h-[280px] sm:h-[360px] lg:h-[500px]"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-pcv-burgundy">
            Church Cards
          </h2>
          <div className="max-h-[400px] space-y-3 overflow-y-auto lg:max-h-[500px]">
            {allChurches.map((church) => (
              <div
                key={church.id}
                className="flex gap-3 rounded-xl border border-pcv-cream-dark bg-white p-4"
              >
                <ChurchLogo church={church} size="md" className="mt-0.5" />
                <div className="min-w-0 flex-1">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
